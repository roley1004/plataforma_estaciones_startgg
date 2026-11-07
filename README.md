# Plataforma Gestor de Estaciones para Torneos (Start.gg Bridge)

Plataforma Web Service para la gestión logística física y asignación inteligente de estaciones (consolas) en torneos de eSports, interconectada con la API de Start.gg.

## Características Principales
- **Asignación Física Automatizada:** Repartición inteligente de partidas listas en consolas compatibles.
- **Check-in por QR Estático + PIN:** Validación física de participantes en cada estación sin fricción.
- **Soporte Multi-Juego & Staff Colaborativo:** Operación simultánea de múltiples juegos y gestión de accesos temporales para jueces y staff de registro.
- **Lienzo Gráfico (Konva.js):** Mapa interactivo en tiempo real del área de juego.
- **Sincronización con Start.gg:** Consumo en segundo plano optimizado con política de Rate Limit.

## Estructura del Proyecto
- `backend/`: API REST, WebSockets y servicios en segundo plano con NestJS, Prisma ORM y PostgreSQL.
- `frontend/`: Aplicación web moderna en Next.js (React), Tailwind CSS y Konva.js.
