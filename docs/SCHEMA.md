# 🗄️ SCHEMA.md — Diccionario Exacto de Base de Datos y Prisma ORM

> **Fuente de verdad física:** [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma).  
> **Regla de Auto-Actualización:** Cualquier cambio en `schema.prisma` debe reflejarse en este resumen.

---

## 1. Enums Exactos de Prisma

| Enum | Valores Exactos | Uso |
| :--- | :--- | :--- |
| `UserRole` | `SUPER_ADMIN`, `ORGANIZER`, `JUDGE` | Roles de cuentas cerradas (creadas solo por Super Admin). |
| `StaffPermissionMode` | `CHECKIN_DESK`, `FLOOR_JUDGE`, `BOTH` | Permisos en vivo para ayudantes temporales (`StaffAccessPass`). |
| `LayoutOperationalStatus` | `DRAFT`, `ARMED_STANDBY`, `LIVE` | Fase A (Edición), Fase B (Activado/Mapeado), Fase C (En vivo). |
| `PinGenerationMode` | `UNIFIED_PER_PLAYER`, `ISOLATED_PER_GAME` | Switch global: Mismo PIN en varios juegos vs. 1 PIN por juego. |
| `StationStatus` | `IDLE`, `ASSIGNED`, `READY`, `ACTIVE`, `COOLDOWN`, `DISABLED` | Estado físico de cada consola. |
| `StationIconType` | `PRESET`, `CUSTOM_IMAGE` | Ícono vectorial predeterminado vs. imagen sanitizada con `sharp`. |
| `TeamFormat` | `SOLO_1V1`, `DOUBLES_2V2`, `SQUAD_4V4` | Modalidad del evento para la tabla pivote `MatchParticipant`. |
| `MatchState` | `PENDING`, `ASSIGNED`, `READY`, `ACTIVE`, `ON_HOLD`, `COMPLETED`, `DQ` | Máquina de estados estricta de partidas. |

---

## 2. Tablas / Modelos y Campos Clave (Prohibido inventar nombres de columnas)

| Modelo Prisma | Campos Principales (`camelCase` exacto) | Relaciones / Reglas Críticas |
| :--- | :--- | :--- |
| **`User`** | `id`, `email`, `username`, `passwordHash`, `role`, `isActive`, `startggUserId?`, `startggAccessToken?`, `startggRefreshToken?`, `dashboardKpiConfig?` (`Json`) | Posee `layouts`, `tournaments`, `createdStaffPasses`. Sin sign-up público. |
| **`StaffAccessPass`** | `id`, `tournamentId`, `createdByUserId`, `label`, `accessToken` (`@unique`), `accessPin?` (`VARCHAR(6)`), `permissionMode`, `isActive`, `revokedAt?`, `assignedEventIds` (`String[]`), `lastUsedAt?` | Acceso temporal recuperable (URL `/staff-access/[accessToken]` + QR) para torneos grandes (120+ jugadores). |
| **`Layout`** | `id`, `name`, `description?`, `canvasWidth`, `canvasHeight`, `backgroundColorHex`, `gridColorHex`, `isActive`, `operationalStatus`, `pinGenerationMode`, `requireAdminStart`, `universalCooldownSeconds`, `noShowTimeoutMinutes`, `ownerId` | Contiene `stations[]` y se vincula a `tournaments[]`. |
| **`Station`** | `id` (UUID del QR), `layoutId`, `stationNumber`, `name`, `priorityIndex`, `isPriority`, `posX`, `posY`, `width`, `height`, `rotation`, `fillColorHex`, `strokeColorHex`, `iconType`, `presetIconName`, `customImageUrl?`, `metaTags` (`String[]`), `status`, `progressiveShutdown`, `cooldownEndsAt?` | Relación M:N con `Videogame` a través de `StationVideogame`. |
| **`Videogame`** | `id`, `startggVideogameId?` (`Int @unique`), `name`, `slug?`, `iconUrl?` | Vincula los juegos de `TournamentEvent` con las consolas compatibles en `StationVideogame`. |
| **`StationVideogame`** | `id`, `stationId`, `videogameId` | `@@unique([stationId, videogameId])`. Define qué juegos soporta cada estación. |
| **`Tournament`** | `id`, `name`, `startggSlug?`, `startggTournamentId?`, `isOffline`, `layoutId?`, `discordGuildId?`, `discordChannelId?`, `ownerId` | Agrupa múltiples `events[]` (`TournamentEvent`) y `staffPasses[]`. |
| **`TournamentEvent`** | `id`, `tournamentId`, `videogameId`, `name`, `startggEventId?`, `startggSlug?`, `teamFormat`, `isStarted`, `startggState` | Doble candado de inicio: `isStarted == true` AND (`isOffline` OR `startggState == "ACTIVE"`). |
| **`Player`** | `id`, `startggUserId?` (`@unique`), `gamerTag`, `prefix?` | Identidad física global. Permite el **Candado Multi-Juego (`Player Busy Lock`)** usando `playerId`. |
| **`EventParticipant`** | `id`, `eventId`, `playerId`, `startggEntrantId?`, `startggParticipantId?`, `pinCode?` (`@db.VarChar(6)`), `isCheckedInVenue`, `isEliminated`, `finalPlacement?` | **`pinCode` se guarda SIEMPRE en TEXTO PLANO** (sin hash) para consulta rápida del staff. |
| **`Match`** | `id`, `eventId`, `stationId?`, `startggSetId?`, `roundText`, `roundNumber`, `bestOf`, `state`, `isComponentsDefined`, `startggSetState?`, `queuePriority`, `discordNotified`, `winnerTeamSlot?`, `team1Score?`, `team2Score?`, `assignedAt?`, `readyAt?`, `startedAt?`, `onHoldAt?`, `completedAt?`, `durationSeconds?` | `queuePriority` sube a `1000` al salir de `ON_HOLD` para ir al tope absoluto de la cola. |
| **`MatchParticipant`** | `id`, `matchId`, `eventParticipantId`, `playerId`, `teamSlot` (`1` o `2`), `isReady`, `checkedInAt?`, `isDq` | Tabla pivote para 1v1, 2v2 y 4v4. La partida pasa a `READY` solo cuando **TODOS** sus registros tienen `isReady == true`. |

---

## 3. Consultas Críticas de Referencia (Reglas de Negocio en Prisma)

1. **Verificación de `Player Busy Lock` (Jugador ocupado en otro juego):**
   Antes de pasar un `Match` a `ASSIGNED`, verificar que ningún `playerId` de sus `MatchParticipant` tenga otro registro en `MatchParticipant` cuyo `match.state` esté en `['ASSIGNED', 'READY', 'ACTIVE']`.
2. **Transición a `READY` tras Check-in QR:**
   Contar cuántos `MatchParticipant` del `matchId` tienen `isReady: false`. Si el conteo es `0`, actualizar `Match.state` a `READY` (o directamente a `ACTIVE` si `layout.requireAdminStart == false`).
