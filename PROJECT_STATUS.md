# 📌 PROJECT_STATUS.md — Estado Actual del Proyecto (Punto de Guardado)

> **Última actualización:** Fase 1 Completada (Dependencias instaladas y Base de Datos `plataforma_startgg` sincronizada en PostgreSQL)

---

## 1. Entorno Local del Usuario (Verificado)
* **Sistema Operativo:** Windows.
* **Node.js:** Instalado y verificado (`v24.19.0`).
* **Base de Datos:** **PostgreSQL local nativo** corriendo en el puerto **`5432`** (verificado en pgAdmin 4).
  * Base de datos `plataforma_startgg` creada y sincronizada con las 11 tablas de Prisma (`npx prisma db push` exitoso).
  * *Nota:* No se usa Docker en desarrollo local para ahorrar memoria RAM; `docker-compose.yml` está listo únicamente para futuro despliegue en la nube.
* **Archivo `backend/.env`:** Configurado por el usuario con su contraseña real codificada para URL (`%` -> `%25`, `+` -> `%2B`).

---

## 2. Progreso por Fases (Roadmap)

### 🟢 Fase 1: Cimientos, Estructura Monorepo y Base de Datos (COMPLETADA)
- [x] Definición de Arquitectura y Reglas de Negocio (`ARCHITECTURE.md`).
- [x] Sistema de Blindaje Anti-Alucinaciones (`INDEX.md`, `PROJECT_STATUS.md`, carpeta `docs/`).
- [x] Estructura base de carpetas `backend/` (NestJS + Prisma) y `frontend/` (Next.js + Tailwind + Konva).
- [x] Diseño completo de `backend/prisma/schema.prisma` (incluyendo soporte Multi-Juego, PINs en texto plano `VARCHAR(6)` con Switch Global, y `StaffAccessPass` para torneos de 120+ jugadores).
- [x] Configuración de `DATABASE_URL` en `backend/.env`.
- [x] Instalación de paquetes (`npm install` en `backend/` y `frontend/`) y creación de base de datos `plataforma_startgg` + cliente Prisma (`npx prisma db push` y `npx prisma generate`).

### 🟡 Fase 2: Motor de Estados, Asignación Multi-Juego, Staff Passes y Modo Independiente (SIGUIENTE PASO)
- [ ] **Paso 2.1:** Módulo de Autenticación cerrada (`SUPER_ADMIN`, `ORGANIZER`, `JUDGE`), semilla inicial (Seed) del usuario Super Admin y gestión de `StaffAccessPass` (`CHECKIN_DESK`, `FLOOR_JUDGE`, `BOTH` con URL/QR recuperable y baja en caliente).
- [ ] **Paso 2.2:** Gateway de WebSockets (`Socket.io` en `/realtime`) para emitir eventos en tiempo real (`station:updated`, `match:state_changed`, `queue:updated`, `player:called`, `staff:permissions_updated`).
- [ ] **Paso 2.3:** Máquina de estados de partidas (`PENDING` -> `ASSIGNED` -> `READY` -> `ACTIVE` -> `ON_HOLD` -> `COMPLETED` / `DQ`) y Motor de Asignación Automática (`priorityIndex`, compatibilidad de videojuego, `Player Busy Lock`, `Skip Cooldown`).
- [ ] **Paso 2.4:** Endpoint `POST /api/checkin` (validación de QR + PIN de 6 dígitos en texto plano) y creación de torneos/partidas en Modo Independiente (Offline) + generador de PINs con Switch Global (`UNIFIED_PER_PLAYER` vs `ISOLATED_PER_GAME`).

### ⚪ Fase 3: Editor Visual de Layouts (Konva.js), Subida Segura de Imágenes y PDF de QRs (PENDIENTE)
- [ ] Lienzo 100% en `react-konva` con selector de colores Hexadecimal (`#RRGGBB`) y barra lateral de prioridad.
- [ ] Subida de íconos personalizados sanitizados con `sharp` y validación de *Magic Bytes*.
- [ ] Generador de PDF de códigos QR con ahorro de hojas (grilla de 2, 4, 6, 9, 12 QRs por página en Carta/A4 y etiquetas térmicas).

### ⚪ Fase 4: Paneles Operativos en Tiempo Real (PENDIENTE)
- [ ] Check-in Desk (búsqueda en vivo y generador de PINs en lote con Switch Global Único vs Individual).
- [ ] Web View móvil exclusivo por QR de estación (`/station/[stationId]`).
- [ ] Monitor Admin / Juez de Piso en vivo y Vista Pública (Pantalla dividida + alertas de llamado).

### ⚪ Fase 5: Orquestador Start.gg (Leaky Bucket + GraphQL), KPIs y Bot de Discord (PENDIENTE)
- [ ] Cola secuencial estricta (1 req/1000ms) para Start.gg GraphQL v2 (lectura por URL/Slug usando `STARTGG_SYSTEM_API_TOKEN` o escritura con OAuth2).
- [ ] Detección automática de marcadores y DQs reportados por el juez en Start.gg.
- [ ] Dashboard de KPIs personalizable (mostrar/ocultar widgets) y Bot de anuncios en Discord.
