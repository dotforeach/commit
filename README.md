# Finanzas 0→100

App para ordenar las finanzas personales de punta a punta: cuentas, movimientos, recurrentes, presupuesto, deudas, ahorro e inversiones. Los datos se cifran en tu dispositivo (conocimiento cero): ni el servidor ni sus administradores pueden leerlos. Ver [docs/arquitectura-cifrado.md](docs/arquitectura-cifrado.md).

## Stack

- `backend/`: NestJS 12, Prisma 7, PostgreSQL 18, Redis 8.
- `frontend/`: Angular 22, Angular Material, Transloco, libsodium.

## Levantar

```bash
cp .env.example .env            # y cambiar las contraseñas
docker compose --profile dev up --build    # desarrollo: http://localhost:4200
docker compose --profile prod up --build -d # producción: http://localhost:8080
```

## Tests

```bash
cd backend && pnpm test && pnpm test:e2e   # necesita Postgres y Redis del compose
cd frontend && pnpm ng test && pnpm e2e    # e2e: con el stack de desarrollo levantado
```

## Licencia

[GNU AGPL-3.0](LICENSE) o posterior. Podés usar, modificar y redistribuir este software libremente, pero cualquier versión modificada, **incluida una que se ofrezca como servicio web**, tiene que publicar su código fuente bajo la misma licencia.
