# 🧭 INDEX.md — Enrutador Maestro de Contexto (Lectura Ligera)

> **Instrucción para la IA:** Este archivo es tu mapa de navegación. **NO leas todos los archivos `.md` del proyecto a la vez.** Identifica qué tarea vas a realizar en la tabla inferior y lee **únicamente** los documentos requeridos para ahorrar tokens y evitar alucinaciones.

---

## 1. Matriz de Decisión: ¿Qué archivo debo leer según la tarea?

| Si la tarea actual consiste en... | Lee ÚNICAMENTE este archivo | Propósito del archivo |
| :--- | :--- | :--- |
| **Iniciar un chat nuevo o saber en qué paso vamos** | [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | Estado actual del entorno, checklist de fases completadas y siguiente paso exacto. |
| **Entender reglas de negocio, máquina de estados o flujos** | [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Definición general del sistema, reglas del motor de asignación, módulos y fases. |
| **Crear/editar consultas Prisma, migraciones o tablas SQL** | [`docs/SCHEMA.md`](./docs/SCHEMA.md) | Diccionario exacto de modelos Prisma, enums, relaciones (`1v1/2v2/4v4`), PINs y `StaffAccessPass`. |
| **Crear/conectar Endpoints REST o eventos Socket.io** | [`docs/API_SOCKETS.md`](./docs/API_SOCKETS.md) | Contratos JSON estrictos (Request/Response) y nombres/payloads exactos de WebSockets. |
| **Desarrollar pantallas Next.js, Tailwind, Zustand o Konva.js** | [`docs/UI_KONVA.md`](./docs/UI_KONVA.md) | Reglas de Canvas Konva (prohibido `dnd-kit`), colores Hex, sanitización de imágenes y componentes. |
| **Trabajar en la integración con Start.gg o el Leaky Bucket** | [`docs/STARTGG_GRAPHQL.md`](./docs/STARTGG_GRAPHQL.md) | Queries/Mutations exactas de GraphQL v2 de Start.gg, estados (`1, 2, 3`) y cola de 1 req/seg. |
| **Ejecutar scripts de consola, Prisma, Docker o Git** | [`docs/COMANDOS.md`](./docs/COMANDOS.md) | Scripts reales de `package.json`, comandos de Prisma y guía paso a paso de Git/GitHub. |

---

## 2. Mapa Rápido de Carpetas del Código

```text
Plataforma_startgg/
├── GEMINI.md                  # Reglas globales de asistencia y auto-actualización (carga automática)
├── INDEX.md                   # Este enrutador ligero de contexto
├── PROJECT_STATUS.md          # Punto de guardado vivo (qué está hecho y qué falta)
├── ARCHITECTURE.md            # Reglas de negocio y arquitectura general
├── docker-compose.yml         # Orquestación para futuro despliegue en la nube
├── docs/                      # Contratos técnicos modulares (leer bajo demanda)
│   ├── SCHEMA.md              # Estructura de Base de Datos y Prisma
│   ├── API_SOCKETS.md         # Contratos REST y eventos WebSocket
│   ├── UI_KONVA.md            # Reglas de Frontend, Tailwind, Zustand y Konva.js
│   ├── STARTGG_GRAPHQL.md     # Queries GraphQL v2 de Start.gg y Leaky Bucket
│   └── COMANDOS.md            # Comandos de consola, Prisma y Git
├── backend/                   # Servidor NestJS (Puerto 4000)
│   ├── .env                   # Variables de entorno locales (PostgreSQL puerto 5432)
│   ├── prisma/schema.prisma   # Fuente de verdad del esquema SQL
│   ├── uploads/               # Imágenes de estaciones sanitizadas por Sharp
│   └── src/                   # Módulos de NestJS (prisma, auth, layouts, stations, matches, startgg, sockets)
└── frontend/                  # Cliente Next.js App Router (Puerto 3000)
    ├── .env.local             # URLs hacia el backend local (http://localhost:4000)
    └── src/app/               # Rutas, vistas operativas y componentes Konva/Tailwind
```

---

## 3. Regla de Auto-Actualización (Mantenimiento de Contexto Corto)

1. **Sincronización Inmediata:** Todo cambio en `schema.prisma`, endpoints REST/WebSockets, componentes UI/Konva o scripts **debe reflejarse inmediatamente** en su archivo respectivo dentro de `docs/` y en `PROJECT_STATUS.md`.
2. **Concisión Estricta:** Al actualizar cualquier archivo dentro de `docs/`, mantén formato de tablas y esquemas directos (sin texto de relleno) para que futuras lecturas consuman el mínimo de tokens posible.
3. **Nuevos Archivos `.md`:** Si una nueva necesidad del proyecto requiere crear un nuevo documento en `docs/`, agrégale una fila en la **Sección 1 de este `INDEX.md`**.
