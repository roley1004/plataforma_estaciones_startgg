# 🎨 UI_KONVA.md — Reglas Estrictas de Frontend, Tailwind CSS, Zustand y Konva.js

> **Regla de Oro del Lienzo:** Queda **TERMINANTEMENTE PROHIBIDO** usar librerías de Drag & Drop del DOM (como `dnd-kit`, `react-beautiful-dnd` o HTML5 drag events) dentro del área del mapa de estaciones. Todo el arrastre, selección, rotación y zoom de estaciones vive **100% dentro del Canvas de `react-konva` (`Stage` -> `Layer` -> `Group` / `Rect` / `Image` / `Text`)**.  
> **Regla de Auto-Actualización:** Cualquier nuevo store de Zustand o componente visual clave debe registrarse en este archivo.

---

## 1. Configuración de Next.js + Konva.js (SSR Safe)
* Konva requiere el objeto `window` del navegador. Todo componente que importe `react-konva` o `konva` debe cargarse en Next.js usando importación dinámica sin SSR:
  ```tsx
  import dynamic from 'next/dynamic';
  const LayoutCanvas = dynamic(() => import('@/components/canvas/LayoutCanvas'), { ssr: false });
  ```
* `frontend/next.config.mjs` ya incluye `config.externals = [...config.externals, { canvas: 'canvas' }]`. **No eliminar esa configuración.**

---

## 2. Paleta de Colores Hexadecimales por Estado de Estación (`StationStatus`)

El Editor de Layouts permite al organizador elegir cualquier color Hexadecimal (`#RRGGBB`) para el fondo del lienzo (`backgroundColorHex`) y el color base de la estación (`fillColorHex`). Durante la ejecución del torneo en vivo (`LIVE`), el borde/indicador de estado de cada estación en Konva y Tailwind sigue este código semántico:

| Estado (`StationStatus`) | Color Hex Principal | Clase Tailwind Equivalente | Significado Visual en Mapa |
| :--- | :--- | :--- | :--- |
| **`IDLE`** | `#10B981` (Emerald 500) | `border-emerald-500 bg-emerald-500/10` | Estación libre y disponible |
| **`ASSIGNED`** | `#F59E0B` (Amber 500) | `border-amber-500 bg-amber-500/10` | Partida asignada, esperando QR + PIN de jugadores |
| **`READY`** | `#3B82F6` (Blue 500) | `border-blue-500 bg-blue-500/10` | Todos validaron PIN, lista para iniciar |
| **`ACTIVE`** | `#8B5CF6` (Violet 500) | `border-violet-500 bg-violet-500/10` | Partida en juego actualmente |
| **`COOLDOWN`** | `#06B6D4` (Cyan 500) | `border-cyan-500 bg-cyan-500/10` | En enfriamiento (muestra botón *"Skip Cooldown"*) |
| **`DISABLED`** | `#64748B` (Slate 500) | `border-slate-600 bg-slate-800/40` | Estación apagada o deshabilitada |
| **Alerta `No-Show` (>10m)**| `#EF4444` (Red 500) | `border-red-500 animate-pulse` | Parpadeo rojo sugiriendo `On Hold` o `DQ` |

---

## 3. Reglas de la Barra Lateral del Editor de Layouts (Módulo 2 y 6)
1. **Edición de Nombre y Colores Hex:** Inputs controlados con selector `<input type="color">` sincronizado con un input de texto `#RRGGBB` validado por expresión regular `/^#[0-9A-Fa-f]{6}$/`.
2. **Identificación Visual Bidireccional (Pulso/Parpadeo):** Al hacer clic en una estación en la lista lateral de prioridad (`priorityIndex`), el nodo correspondiente dentro de `react-konva` ejecuta una animación (`Konva.Tween` o ciclo de escala/halo) para que el organizador la ubique visualmente en el mapa al instante.
3. **Personalización de Estación (Íconos vs. Imágenes Sanitizadas):**
   * **Catálogo `PRESET`:** `"console"`, `"monitor"`, `"arcade"`, `"stage"`, `"pc"`, `"tv"`.
   * **Subida `CUSTOM_IMAGE`:** El input `accept="image/png,image/jpeg,image/webp"` rechaza `.svg` desde el cliente y el backend vuelve a validar *Magic Bytes* y re-codifica con `sharp`.

---

## 4. Arquitectura de Stores en Zustand (`frontend/src/store/`)
* **`useAuthStore`**: Sesión JWT del Organizador o token activo del `StaffAccessPass` (`permissionMode`: `CHECKIN_DESK` | `FLOOR_JUDGE` | `BOTH`).
* **`useLayoutEditorStore`**: Estado del lienzo Konva (`stations`, `selectedStationId`, zoom `scale`, posición `stagePos`, orden de `priorityIndex`, colores hexadecimales).
* **`useLiveTournamentStore`**: Estado en vivo conectado a `Socket.io` (partidas activas, estaciones, cola de espera, alertas de No-Show y configuración de widgets visibles en el Dashboard de KPIs).
