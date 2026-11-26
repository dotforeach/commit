# Arquitectura de cifrado (conocimiento cero, modo híbrido)

Objetivo: que nadie fuera del hogar (ni el administrador, ni el dueño del servidor, ni quien robe la base) pueda leer los datos financieros. El modelo es el de Proton en modo "dos contraseñas".

## Dos secretos por usuario

| Secreto | Dónde se usa | ¿Llega al servidor? |
|---|---|---|
| **Contraseña de login** | Autenticación (`@nestjs/authentication`, scrypt) | Sí, por TLS; se guarda solo su hash |
| **Clave de descifrado** | Deriva la clave que abre las claves privadas del usuario | **Nunca** |
| **Frase de recuperación** (24 palabras, BIP39) | Copia alternativa para abrir las claves privadas | **Nunca**; se muestra una sola vez al registrarse |

## Jerarquía de claves

```
clave de descifrado ──Argon2id(salt)──▶ KEK ──┐
frase de recuperación ─Argon2id(salt)─▶ RK ───┤  (cifran, por separado, lo mismo)
                                              ▼
                       claves privadas del usuario (X25519 + Ed25519)
                                              │  abren (sealed box)
                                              ▼
                       clave del hogar v1, v2… (XChaCha20-Poly1305, 256 bits)
                                              │  cifra
                                              ▼
                       `payload` de cada fila financiera
```

- Librería: **libsodium** (`libsodium-wrappers-sumo`, carga diferida) en el navegador. Argon2id `crypto_pwhash` (128 MiB, 3 pasadas; el backend exige ≥ 64 MiB), `crypto_box_seal` para envolver claves de hogar, `crypto_sign` para firmar el envoltorio, `crypto_aead_xchacha20poly1305_ietf` para los datos.
- Frase de recuperación: BIP39 en español (`@scure/bip39`, 256 bits). RK = BLAKE2b(entropía, clave = `recoveryKdfSalt`): la frase ya tiene 256 bits, no hace falta un KDF lento. Se aceptan palabras sin tildes.
- Claves privadas cifradas: `boxSecretKey(32) ‖ signSecretKey(64)` con AAD `finanzas:user-keys:v1:passphrase|recovery`. Al abrirlas se verifica que correspondan a las públicas registradas.
- Firma del envoltorio: Ed25519 sobre `"finanzas:member-key:v1:<householdId>:<version>:<userId>:" ‖ wrappedKey` (idéntico en `backend/src/auth/member-key-signature.ts` y `frontend/src/app/core/crypto/member-key.ts`). Si quien envolvió es el propio usuario, el cliente usa su propia clave pública verificada, no la que informa el servidor.
- Los IDs (usuario, hogar, filas) los genera el navegador (UUID v7), porque forman parte del AAD.
- Código: `frontend/src/app/core/crypto/`. Tablas: `user_keys`, `household_keys`, `household_member_keys` (ver `backend/prisma/schema.prisma`).

## Qué queda en claro y qué se cifra (modo híbrido)

- **En claro**: IDs, relaciones (cuenta, categoría, activo), fechas, tipos y estados, moneda, parámetros estructurales (día de cierre, frecuencia, cantidad de cuotas), `revision`/`deletedAt` para sincronizar. El servidor puede filtrar, paginar y sincronizar con esto.
- **Cifrado** (`payload`): montos, tasas, cantidades, precios, nombres, descripciones, notas, puntaje de salud, nivel e hitos.
- **Lo que el servidor puede inferir** (riesgo aceptado del modo híbrido): cuántos movimientos hay y en qué fechas, de qué tipo, en qué categoría (sin su nombre), qué activos del catálogo público tiene un hogar, y las fechas de vencimientos y recordatorios.
- **Datos públicos** (cotizaciones y precios de mercado del catálogo) se guardan en claro: no son del usuario.

## Formato del payload

```
payload = version(1 byte) ‖ nonce(24 bytes) ‖ ciphertext+tag
AAD     = "<tabla>:<id>:<householdId>:<keyVersion>"
```

El AAD ata el cifrado a su fila: si el servidor intercambia payloads entre filas u hogares, el descifrado falla. El contenido es JSON; los montos van como string decimal (nunca `number`).

## Flujos

**Registro**: el navegador genera las claves, la frase de recuperación y la clave del hogar personal; envía al servidor solo las claves públicas, las privadas cifradas (con la KEK y con la RK), sales y parámetros de KDF, y la clave del hogar envuelta para el propio usuario. El usuario confirma que guardó la frase.

**Ingreso**: login con contraseña (access token de 15 min en memoria; refresh token rotativo en cookie `HttpOnly`, `SameSite=Strict`, `Path=/api/auth`, guardado en Redis) → `GET /api/me` devuelve `user_keys` cifradas → el usuario ingresa su clave de descifrado → el navegador abre las privadas → abre las claves de sus hogares. Las claves viven solo en memoria (nunca en `localStorage`); al cerrar sesión o tras inactividad se borran.

**Cambiar la clave de descifrado**: se vuelven a cifrar las privadas con una KEK nueva. Los datos no se tocan.

**Invitar a un miembro**: invitación por email → la persona se registra/acepta → queda `PENDING_KEY` → el próximo admin que abra la app verifica la clave pública del invitado (huella visible) y le envuelve la clave del hogar → `ACTIVE`.

**Quitar un miembro**: se crea una versión nueva de la clave del hogar, envuelta para los que quedan. Lo nuevo se cifra con la versión nueva; lo ya cifrado puede re-cifrarse en segundo plano desde el navegador. (Lo que el ex-miembro ya descargó, inevitablemente, lo conserva.)

**Recuperación**:
1. Con la frase de recuperación: abre las privadas y define una clave de descifrado nueva. No se pierde nada.
2. Sin clave ni frase: el usuario resetea sus claves (`keyVersion + 1`). Sus membresías pasan a `PENDING_KEY` y otro miembro ACTIVE (OWNER/ADMIN) del hogar le vuelve a compartir la clave. **Los hogares donde era el único miembro (incluido el personal) se pierden**: nadie más tenía la clave.

## Caché offline

Los registros se guardan **cifrados** en IndexedDB y se sincronizan con `GET /sync?since=<revision>`; se descifran en memoria tras ingresar la clave. Las escrituras offline se encolan y se envían al reconectar, con control de concurrencia optimista por `revision` (409 si cambió).

Pendiente para el módulo de sync: una `revision` asignada por secuencia puede hacerse visible fuera de orden entre transacciones concurrentes. El endpoint debe devolver solo hasta una marca de agua segura (p. ej. basada en `pg_current_snapshot()`), no simplemente el máximo visto.

## Recordatorios

El navegador agenda `reminders` con `remindAt` en claro y el texto cifrado. Un job de BullMQ crea, a esa hora, una `notification` por miembro activo con el mismo payload cifrado. El servidor conoce cuándo, no qué ni cuánto.

**Web Push** (decidido): con la app cerrada, el servidor envía una notificación push genérica ("Tenés un recordatorio"), sin datos financieros; el detalle se descifra al abrir la app.

## Lo que el cifrado NO protege

- **Código del cliente**: el servidor entrega el JavaScript que cifra. Un servidor comprometido podría servir código malicioso. Mitigaciones: CSP estricta, Subresource Integrity, builds reproducibles y, a futuro, app de escritorio/móvil firmada.
- **Metadatos** listados arriba (modo híbrido).
- **Dispositivo comprometido**: con malware en el equipo del usuario, nada de esto alcanza.

Como segunda capa, el disco del servidor de producción debe estar cifrado (configuración del hosting).
