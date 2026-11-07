# 💻 COMANDOS.md — Guía Exacta de Comandos del Proyecto, Base de Datos y Git

> **Regla Anti-Alucinaciones:** Solo utilizar los scripts definidos en `backend/package.json` y `frontend/package.json`.  
> **Regla de Asistencia:** Siempre preguntar o confirmar con el usuario antes de ejecutar instalaciones nuevas o migraciones destructivas.

---

## 1. Comandos de Instalación y Base de Datos (PostgreSQL Local Puerto 5432)

### Instalar dependencias de Node.js
```powershell
# 1. Instalar paquetes del Backend (NestJS + Prisma + Socket.io + Sharp)
cd c:\Users\user1\Desktop\Plataforma_startgg\backend
npm install

# 2. Instalar paquetes del Frontend (Next.js + Tailwind + Konva.js + Zustand)
cd c:\Users\user1\Desktop\Plataforma_startgg\frontend
npm install
```

### Comandos de Prisma ORM (Dentro de `backend/`)
```powershell
cd c:\Users\user1\Desktop\Plataforma_startgg\backend

# Generar el cliente tipado de TypeScript tras editar schema.prisma
npm run prisma:generate

# Crear/sincronizar automáticamente la base de datos 'plataforma_startgg' y todas sus tablas en PostgreSQL
npm run prisma:push

# Abrir visor visual web de Prisma para ver/editar registros en el navegador (http://localhost:5555)
npm run prisma:studio
```

---

## 2. Comandos para Levantar el Proyecto en Desarrollo Local

```powershell
# Terminal 1: Iniciar Backend en modo desarrollo (http://localhost:4000)
cd c:\Users\user1\Desktop\Plataforma_startgg\backend
npm run start:dev

# Terminal 2: Iniciar Frontend en modo desarrollo (http://localhost:3000)
cd c:\Users\user1\Desktop\Plataforma_startgg\frontend
npm run dev
```

---

## 3. Guía Paso a Paso de Git y GitHub (Para usar desde VS Code)

Cuando quieras guardar tu avance y subirlo a tu repositorio de GitHub:

### A. Primera vez (Inicializar el repositorio y conectarlo a GitHub)
```powershell
cd c:\Users\user1\Desktop\Plataforma_startgg

# 1. Inicializar Git en la carpeta del proyecto
git init

# 2. Asegurar que la rama principal se llame 'main'
git branch -M main

# 3. Conectar con la URL del repositorio vacío que crees en tu cuenta de GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

### B. Flujo diario para guardar y subir cambios (`add`, `commit`, `push`)
```powershell
# 1. Ver qué archivos cambiaron (verifica que .env NO aparezca gracias al .gitignore)
git status

# 2. Agregar todos los archivos nuevos/modificados (o especifica un archivo: git add ruta/archivo)
git add .

# 3. Guardar el punto de control con un mensaje descriptivo
git commit -m "feat: estructura inicial Fase 1, arquitectura y esquema Prisma"

# 4. Subir los cambios a la rama 'main' en GitHub ('origin')
git push -u origin main
```
*(En los siguientes `push` después del primero, bastará con escribir `git push origin main`).*
