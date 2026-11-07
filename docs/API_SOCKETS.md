# 🔌 API_SOCKETS.md — Contratos Estrictos de Endpoints REST y Eventos Socket.io

> **Convención Obligatoria:** Todos los cuerpos JSON (Request/Response) de nuevos endpoints usan `camelCase`, con excepción de `/api/checkin` que soporta tanto `snake_case` (`station_id`, `pin_code`) como `camelCase` (`stationId`, `pinCode`) para cumplir el contrato original del documento de definición.  
> **Regla de Auto-Actualización:** Todo nuevo endpoint o evento WebSocket debe documentarse aquí antes o durante su creación.

---

## 1. Endpoints REST Core (`http://localhost:4000/api`)

### A. Salud y Autenticación Cerrada (`Allowlist`)
* **`GET /api/health`** -> `{ "status": "ok", "service": "Start.gg Station Manager Backend", "timestamp": "ISO-8601" }`
* **`POST /api/auth/login`**
  * Request: `{ "usernameOrEmail": "string", "password": "string" }`
  * Response: `{ "accessToken": "jwt", "user": { "id": "uuid", "username": "string", "role": "SUPER_ADMIN | ORGANIZER | JUDGE", "dashboardKpiConfig": {} } }`
* **`POST /api/admin/users`** *(Solo `SUPER_ADMIN` — No existe registro público)*
  * Request: `{ "email": "string", "username": "string", "password": "string", "role": "ORGANIZER | JUDGE" }`

### B. Gestión de Staff Temporal (`StaffAccessPass` para Torneos de 120+ Jugadores)
* **`POST /api/tournaments/:tournamentId/staff-passes`**
  * Request: `{ "label": "Juez Juan - Pasillo A", "permissionMode": "CHECKIN_DESK" | "FLOOR_JUDGE" | "BOTH", "assignedEventIds": ["uuid"], "accessPin": "123456" }`
  * Response: `{ "id": "uuid", "label": "string", "accessToken": "uuid", "shareUrl": "http://.../staff-access/uuid", "permissionMode": "BOTH", "isActive": true }`
* **`PATCH /api/staff-passes/:passId`** *(Cambio de permisos en caliente o baja inmediata)*
  * Request: `{ "permissionMode"?: "CHECKIN_DESK" | "FLOOR_JUDGE" | "BOTH", "isActive"?: boolean, "assignedEventIds"?: ["uuid"] }`
  * Efecto secundario: Dispara evento WebSocket `staff:permissions_updated`.
* **`GET /api/staff-passes/verify/:accessToken`**
  * Devuelve la sesión del ayudante, permisos activos y datos del torneo (permite reutilizar el mismo link o QR si el ayudante cerró su navegador).

### C. Layouts, Estaciones e Imágenes Sanitizadas
* **`GET /api/layouts`** / **`POST /api/layouts`** / **`PATCH /api/layouts/:id`** / **`DELETE /api/layouts/:id`**
* **`POST /api/stations/:stationId/upload-icon`** (`multipart/form-data`, campo `file`)
  * Regla: Solo `.png`, `.jpg`, `.jpeg`, `.webp`. Validación de *Magic Bytes* + re-codificación `sharp` a WebP/PNG (`512x512`). Prohibido `.svg`.
* **`POST /api/layouts/:layoutId/activate`** *(Fase B: Activar y Mapear Videojuegos por Estación)*
  * Request: `{ "tournamentIds": ["uuid"], "stationGameMap": { "stationUuid": ["videogameUuid1", "videogameUuid2"] }, "pinGenerationMode": "UNIFIED_PER_PLAYER" | "ISOLATED_PER_GAME" }`

### D. Check-in Desk (PINs en Texto Plano) y Check-in Móvil QR
* **`POST /api/tournaments/:tournamentId/generate-pins`**
  * Request: `{ "mode": "UNIFIED_PER_PLAYER" | "ISOLATED_PER_GAME", "overwriteExisting": false }`
  * Regla: Genera PINs de 6 dígitos en texto plano (`VARCHAR(6)`). Si es `UNIFIED_PER_PLAYER`, asigna el mismo PIN a todas las inscripciones del mismo `playerId`.
* **`GET /api/station-view/:stationId`** *(Web View exclusivo al escanear el QR físico de la estación)*
  * Response: `{ "station": { "id": "uuid", "stationNumber": 4, "name": "Estación #4", "status": "ASSIGNED" }, "currentMatch": { "id": "uuid", "gameName": "Street Fighter 6", "roundText": "Winners Round 1", "participants": [{ "eventParticipantId": "uuid", "gamerTag": "Player1", "teamSlot": 1, "isReady": false }] } }`
* **`POST /api/checkin`** *(Contrato estricto de validación de PIN en consola)*
  * Request: `{ "station_id": "uuid", "pin_code": "123456", "participant_id"?: "uuid" }` *(acepta también `stationId`, `pinCode`, `participantId`)*
  * Response: `{ "success": true, "player_ready": true, "match_state": "assigned" | "ready" | "active" }`

### E. Operación del Torneo en Vivo (Motor, On Hold, Skip Cooldown y DQ)
* **`POST /api/events/:eventId/start`** -> Activa el motor de asignación (`isStarted = true`).
* **`POST /api/matches/:matchId/on-hold`** -> Pausa la partida (`state = ON_HOLD`), libera inmediatamente la estación (`IDLE`) y asigna la siguiente partida de la cola.
* **`POST /api/matches/:matchId/resume-hold`** -> Devuelve la partida a `PENDING` con `queuePriority = 1000` (cima absoluta de la cola).
* **`POST /api/stations/:stationId/skip-cooldown`** -> Fuerza sincronización con el tope de la cola Leaky Bucket y **salta el Cooldown Universal ($N$ seg)** pasando la estación a `IDLE` de inmediato.
* **`POST /api/matches/:matchId/offline-result`** *(Modo Offline o DQ directo)*
  * Request: `{ "winnerTeamSlot": 1 | 2, "team1Score": 3, "team2Score": 1, "isDq": false, "dqTeamSlot"?: 2 }`

---

## 2. Eventos WebSocket (`Socket.io` — Namespace `/realtime`)

| Nombre Exacto del Evento | Dirección | Payload JSON Exacto | Quién lo escucha |
| :--- | :--- | :--- | :--- |
| **`station:updated`** | Server -> Client | `{ "stationId": "uuid", "status": "IDLE\|ASSIGNED\|READY\|ACTIVE\|COOLDOWN\|DISABLED", "currentMatch": { ... } \| null, "cooldownEndsAt": "ISO" \| null }` | Monitor Admin, Juez de Piso, Web View QR Móvil, Vista Pública |
| **`match:state_changed`** | Server -> Client | `{ "matchId": "uuid", "eventId": "uuid", "previousState": "ASSIGNED", "newState": "READY", "stationId": "uuid" \| null }` | Monitor Admin, Juez de Piso, Web View QR Móvil |
| **`queue:updated`** | Server -> Client | `{ "tournamentId": "uuid", "pendingMatches": [{ "matchId": "uuid", "gameName": "string", "roundText": "string", "queuePriority": 0, "players": ["P1", "P2"] }] }` | Vista Pública (Lado Derecho), Monitor Admin |
| **`player:called`** | Server -> Client | `{ "matchId": "uuid", "gamerTags": ["Player1"], "stationNumber": 4, "stationName": "Consola 4", "gameName": "Tekken 8", "calledAt": "ISO" }` | Vista Pública (Overlay de Alerta Visual/Sonora) |
| **`noshow:alert`** | Server -> Client | `{ "matchId": "uuid", "stationId": "uuid", "stationNumber": 4, "missingPlayers": ["Player2"], "elapsedMinutes": 10 }` | Monitor Admin y Jueces de Piso (Sugiere `On Hold` o `DQ`) |
| **`staff:permissions_updated`** | Server -> Client | `{ "passId": "uuid", "accessToken": "uuid", "permissionMode": "CHECKIN_DESK\|FLOOR_JUDGE\|BOTH", "isActive": boolean, "assignedEventIds": ["uuid"] }` | Dispositivo del Ayudante / Staff Temporal en vivo |
