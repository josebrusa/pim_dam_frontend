# Lumify PIM — Frontend

Aplicación React para Lumify PIM SaaS multitenant. Migración del prototipo HTML a Vite + React + Tailwind.

## Stack

- Vite, React, TypeScript
- Tailwind CSS v4
- React Router, Axios, TanStack Query, Zod, Lucide React

## Inicio rápido

```bash
cp .env.example .env
pnpm install
pnpm dev
```

App: http://localhost:5173

Asegúrate de que el backend esté en marcha (`../backend`) para login real.

## Rutas

| Ruta | Pantalla |
|------|----------|
| `/login` | Login |
| `/app/dashboard` | Dashboard |
| `/app/attributes` | Atributos |
| `/app/products` | PDP / Búsqueda |
| `/app/categories` | Categorías |
| `/app/import-export` | Import / Export |
| `/app/mapping` | Mapping |
| `/app/workflows` | Workflows |
| `/app/channels` | Canales |
| `/app/gdsn` | GDSN / GS1 |
| `/app/dam` | DAM |
| `/app/users` | Usuarios / Roles |

## Estructura

```
src/
  app/          # router, providers, config
  shared/       # api, ui reutilizable
  features/     # módulos por dominio
```

Documentación compartida: `../docs/`

## Scripts

```bash
pnpm dev      # desarrollo
pnpm build    # producción
pnpm lint     # eslint
```
