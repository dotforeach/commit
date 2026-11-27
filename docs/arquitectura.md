# Arquitectura

Visión general de cómo está armado Commit: componentes, módulos, flujos principales y modelo de datos. El detalle criptográfico está en [arquitectura-cifrado.md](arquitectura-cifrado.md).

> Principio rector: **el servidor guarda y sincroniza datos cifrados, el navegador calcula**. Saldos, presupuestos, el Plan mágico, el puntaje de progreso y las recomendaciones de facturas se calculan en el cliente, con los datos ya descifrados.

## Componentes y despliegue

```mermaid
flowchart TB
    subgraph Cliente["Dispositivo de la persona"]
        BR["Navegador / PWA<br/>Angular 22"]
        IDB[("IndexedDB<br/>caché cifrada offline")]
        SW["Service worker<br/>(producción)"]
        BR --- IDB
        BR --- SW
    end

    subgraph Servidor["Servidor (docker compose)"]
        NG["frontend<br/>nginx: SPA + proxy /api"]
        BE["backend<br/>NestJS 12"]
        MG["migrate<br/>prisma migrate deploy"]
        PG[("postgres 18")]
        RD[("redis 8")]
        OCR["ocr (opcional)<br/>RapidOCR"]
    end

    subgraph Externos["Servicios externos"]
        META["WhatsApp Cloud API (Meta)"]
        AI["IA: Claude API"]
        FX["Cotizaciones: BCE vía Frankfurter,<br/>CoinGecko, DolarApi"]
        PUSH["Servicios de Web Push<br/>del navegador"]
    end

    BR -->|HTTPS| NG
    NG -->|/api/*| BE
    MG --> PG
    BE --> PG
    BE --> RD
    BE -.-> OCR
    META -->|webhook firmado| NG
    BE -.-> META
    BE -.-> AI
    BE --> FX
    BE -.-> PUSH
```

| Servicio compose | Perfil | Función |
|---|---|---|
| `postgres`, `redis` | siempre | Datos (cifrados) y sesiones, códigos temporales y colas |
| `backend-dev`, `frontend-dev`, `adminer` | `dev` | Desarrollo con recarga en caliente (http://localhost:4200) |
| `migrate`, `backend`, `frontend` | `prod` | Producción: migraciones, API y nginx (http://localhost:8080) |
| `ocr` | `ocr` | OCR propio para facturas, opcional |

## Backend: módulos

```mermaid
flowchart LR
    subgraph Núcleo
        AUTH[auth] --- USERS[users]
        HH[households] --- CUR[currencies]
        HEALTH[health] --- STATUS[status]
    end
    subgraph Finanzas["Datos financieros (payload cifrado)"]
        ACC[accounts] --- TX[transactions]
        CAT[categories] --- REC[recurring]
        BUD[budgets] --- DEBT[debts]
        INST[installments] --- GOALS[goals]
        DEP[deposits] --- INV[investments]
        PROG[progress]
    end
    subgraph Fondo["Trabajos en segundo plano (BullMQ)"]
        RATES[rates] --- NOTIF[notifications]
        RCPT[receipts]
    end
    Núcleo --> Finanzas
    Núcleo --> Fondo
```

| Módulo | Responsabilidad |
|---|---|
| `auth`, `users` | Registro, login (scrypt), access token en memoria + refresh rotativo en cookie, claves públicas y privadas **cifradas** |
| `households` | Hogares, miembros, roles, invitaciones y envoltorios de la clave del hogar |
| `accounts` … `investments` | CRUD de filas con metadatos en claro y `payload` cifrado; sincronización por `revision` |
| `rates` | Cotizaciones públicas cada hora (cola `rates`) |
| `notifications` | Recordatorios cifrados, notificaciones y Web Push (cola `reminders`, cada minuto) |
| `receipts` | Facturas por WhatsApp: webhook, vinculación, OCR + IA y bandeja **sellada** (cola `receipts`) |
| `status` | Estado en vivo de la infraestructura para `/estado` |

## Frontend: áreas

| Ruta | Acceso | Qué hace |
|---|---|---|
| `/`, `/aprende`, `/herramientas` | Público | Landing, artículos y calculadoras |
| `/registro`, `/ingresar`, `/desbloquear`, `/recuperar` | Sesión | Cuenta, clave de descifrado y frase de recuperación |
| `/inicio`, `/movimientos`, `/presupuesto`, `/deudas`, `/ahorro`, `/cuentas`, `/recurrentes` | Desbloqueado | Finanzas del hogar |
| `/plan`, `/progreso` | Desbloqueado | Plan mágico y salud financiera |
| `/por-revisar`, `/suscripcion` | Desbloqueado | Facturas recibidas y planes |
| `/ajustes`, `/hogar`, `/cotizaciones` | Desbloqueado | Preferencias, WhatsApp, apariencia, miembros y monedas |
| `/estado` | Desarrollo o token de operador | Diagrama de infraestructura en vivo |

## Flujos principales

### Ingreso y desbloqueo

```mermaid
sequenceDiagram
    autonumber
    actor P as Persona
    participant N as Navegador
    participant B as Backend
    P->>N: email + contraseña de ingreso
    N->>B: POST /api/auth/login
    B-->>N: access token (memoria) + refresh (cookie HttpOnly)
    N->>B: GET /api/me
    B-->>N: claves privadas CIFRADAS + claves de hogar envueltas
    P->>N: clave de descifrado
    Note over N: Argon2id (Web Worker) → abre las claves privadas<br/>→ abre las claves de los hogares
    N->>N: guarda el par de claves cifrado en la pestaña (F5 sin clave)
    Note over N,B: La clave de descifrado nunca sale del navegador
```

### Guardar un movimiento

```mermaid
sequenceDiagram
    autonumber
    participant N as Navegador
    participant B as Backend
    participant DB as PostgreSQL
    N->>N: id = UUID v7<br/>payload = XChaCha20-Poly1305(monto, descripción…)<br/>AAD = tabla:id:hogar:versión
    N->>B: POST /api/households/{hogar}/transactions { id, fecha, cuenta, categoría, payload }
    B->>DB: INSERT (metadatos en claro + payload cifrado)
    DB-->>B: revision (secuencia global)
    B-->>N: fila con revision
    N->>N: actualiza saldos y presupuesto en memoria y la caché cifrada
```

### Sincronización y modo sin conexión

```mermaid
sequenceDiagram
    autonumber
    participant N as Navegador
    participant C as IndexedDB (cifrado)
    participant B as Backend
    N->>C: lee la última revisión segura
    N->>B: GET /api/households/{hogar}/transactions?since=<revision>
    B-->>N: cambios y borrados lógicos (deletedAt)
    N->>C: guarda las respuestas tal como llegan (cifradas)
    Note over N,B: Sin conexión: se abre lo guardado en IndexedDB<br/>y la app queda en modo solo lectura
```

### Factura por WhatsApp

```mermaid
sequenceDiagram
    autonumber
    actor P as Persona
    participant M as WhatsApp (Meta)
    participant B as Backend
    participant Q as Cola receipts
    participant O as OCR propio
    participant A as IA (Claude)
    participant N as Navegador
    P->>M: foto de la factura
    M->>B: webhook (firma X-Hub-Signature-256)
    B->>B: valida firma · busca el número por HMAC · revisa suscripción y límite
    B->>Q: encola el trabajo
    B-->>M: "Recibido, lo estoy leyendo…"
    Q->>M: descarga la foto
    Q->>O: imagen
    O-->>Q: texto
    Q->>A: solo el TEXTO
    A-->>Q: datos estructurados (comercio, fecha, total, ITBMS…)
    Q->>Q: sella el resultado con la clave pública de la persona<br/>y descarta la foto
    Q-->>M: "✅ Recibido: Súper 99 · $23.40"
    N->>B: GET /api/me/receipts (sellados)
    N->>N: abre con su clave privada<br/>recomienda cuenta y categoría con su historial
    P->>N: acepta o cambia la recomendación
    N->>B: guarda el movimiento cifrado y borra el comprobante
```

Más detalle en [facturas-whatsapp.md](facturas-whatsapp.md).

### Recordatorios y Web Push

```mermaid
sequenceDiagram
    autonumber
    participant N as Navegador
    participant B as Backend
    participant J as Cola reminders (cada minuto)
    participant WP as Web Push
    N->>B: agenda recordatorio { remindAt (claro), texto (cifrado) }
    J->>B: reclama los vencidos (FOR UPDATE SKIP LOCKED)
    J->>B: crea una notificación por miembro (texto cifrado)
    J->>WP: "Tienes un recordatorio" (sin datos financieros)
    N->>B: al abrir la app, lee y descifra la notificación
```

## Modelo de datos (simplificado)

Toda fila financiera pertenece a un hogar y guarda sus datos sensibles en `payload` (cifrado). Las tablas sincronizables tienen `revision` (asignada por un trigger) y `deletedAt`.

```mermaid
erDiagram
    USER ||--|| USER_KEYS : "claves públicas y privadas cifradas"
    USER ||--o{ HOUSEHOLD_MEMBER : pertenece
    HOUSEHOLD ||--o{ HOUSEHOLD_MEMBER : tiene
    HOUSEHOLD ||--o{ HOUSEHOLD_KEY : "versiones de clave"
    HOUSEHOLD_KEY ||--o{ HOUSEHOLD_MEMBER_KEY : "envuelta por miembro"
    HOUSEHOLD ||--o{ ACCOUNT : tiene
    HOUSEHOLD ||--o{ CATEGORY : tiene
    ACCOUNT ||--o{ TRANSACTION : registra
    CATEGORY ||--o{ TRANSACTION : clasifica
    HOUSEHOLD ||--o{ RECURRING_RULE : programa
    HOUSEHOLD ||--o{ BUDGET : planifica
    HOUSEHOLD ||--o{ DEBT : debe
    DEBT ||--o{ DEBT_PAYMENT : "se paga con"
    HOUSEHOLD ||--o{ SAVINGS_GOAL : ahorra
    HOUSEHOLD ||--o{ REMINDER : recuerda
    USER ||--o{ NOTIFICATION : recibe
    USER ||--o| WHATSAPP_LINK : "número (solo HMAC)"
    USER ||--o{ RECEIPT_INBOX_ITEM : "comprobantes sellados"
    USER ||--o| SUBSCRIPTION : "plan $2 o $20"

    TRANSACTION {
        uuid id
        uuid accountId
        uuid categoryId
        date date
        enum type
        bytes payload "monto, descripción, notas (cifrado)"
        bigint revision
    }
    RECEIPT_INBOX_ITEM {
        uuid id
        bytes sealed "crypto_box_seal para la persona"
    }
```

El esquema completo está en [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma).

## Decisiones clave

| Decisión | Motivo |
|---|---|
| Cálculos en el navegador | El servidor no puede leer montos: saldos, presupuestos, Plan mágico y recomendaciones se calculan con los datos descifrados |
| IDs generados en el cliente (UUID v7) | Forman parte del AAD del cifrado, así que existen antes de enviar la fila |
| Montos como texto decimal | Sin errores de punto flotante (aritmética con BigInt) |
| `revision` global + `deletedAt` | Sincronización incremental y conflictos detectados (409) |
| Colas BullMQ con prefijo por entorno | Los tests no comparten trabajos con el entorno de desarrollo |
| OCR propio antes que la IA | A la IA le llega el texto de la factura, no la foto |
