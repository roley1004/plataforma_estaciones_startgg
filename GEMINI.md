# Reglas de Asistencia Paso a Paso, Enrutamiento de Contexto y Auto-Actualización

## 1. Reglas de Asistencia Paso a Paso e Instalaciones
1. **No asumir software ni herramientas preinstaladas:**
   - Antes de ejecutar comandos o avanzar en tareas que dependan de software externo (ej. Node.js, PostgreSQL, Docker, Git, librerías globales, etc.), SIEMPRE pregunta primero al usuario si lo tiene instalado y configurado, o ayúdale a verificarlo.
   - Si el usuario no lo tiene instalado o tiene dudas de cómo configurarlo, detente y proporciona una guía paso a paso clara y amigable para instalarlo manualmente.
2. **No asumir cuentas de desarrollador, API Keys o Bots preconfigurados:**
   - Antes de integrar servicios externos que requieran registro de desarrollador, tokens o configuración en portales web (ej. Discord Developer Portal para bots, Start.gg Developer Token / OAuth2, proveedores cloud, etc.), pregunta primero si el usuario ya cuenta con ellos.
   - Si no los tiene o pregunta cómo obtenerlos, explica el procedimiento paso a paso (dónde entrar, qué opciones elegir y cómo copiar las credenciales) sin dar nada por sentado.
3. **Acompañamiento al ritmo del usuario:**
   - Responde siempre con paciencia y claridad a cualquier pregunta sobre cómo verificar, instalar o configurar ambientes antes de pasar a escribir o ejecutar código que dependa de ellos.

---

## 2. Enrutamiento de Contexto Anti-Alucinaciones (Ahorro de Tokens)
- **PROHIBIDO leer todos los archivos `.md` de golpe al iniciar una tarea.**
- **Paso Obligatorio Inicial:** Lee SIEMPRE primero [`INDEX.md`](./INDEX.md) (y [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) si estás retomando el proyecto en un chat nuevo).
- Usa la **Matriz de Decisión de `INDEX.md`** para abrir ÚNICAMENTE el archivo específico dentro de `docs/` que corresponda a la tarea actual (`SCHEMA.md`, `API_SOCKETS.md`, `UI_KONVA.md`, `STARTGG_GRAPHQL.md` o `COMANDOS.md`).

---

## 3. Protocolo de Auto-Actualización Continua de Documentación
Cada vez que realices un cambio en el código o en la arquitectura, **ESTÁS OBLIGADO a actualizar la documentación correspondiente en ese mismo turno** siguiendo estas reglas:
1. **Si modificas `backend/prisma/schema.prisma`** -> Actualiza inmediatamente [`docs/SCHEMA.md`](./docs/SCHEMA.md).
2. **Si creas o modificas un Endpoint REST o evento de Socket.io** -> Actualiza inmediatamente [`docs/API_SOCKETS.md`](./docs/API_SOCKETS.md).
3. **Si creas o modificas componentes de React, Zustand o el lienzo de Konva.js** -> Actualiza inmediatamente [`docs/UI_KONVA.md`](./docs/UI_KONVA.md).
4. **Si modificas queries de Start.gg o la cola Leaky Bucket** -> Actualiza inmediatamente [`docs/STARTGG_GRAPHQL.md`](./docs/STARTGG_GRAPHQL.md).
5. **Si agregas scripts al `package.json` o nuevos comandos operativos** -> Actualiza inmediatamente [`docs/COMANDOS.md`](./docs/COMANDOS.md).
6. **Si completas un paso, subtarea o fase del proyecto** -> Actualiza inmediatamente [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).
7. **Si creas un nuevo archivo `.md` o un nuevo módulo mayor** -> Regístralo en [`INDEX.md`](./INDEX.md) manteniendo descripciones ultra-cortas para no inflar el consumo de tokens.
