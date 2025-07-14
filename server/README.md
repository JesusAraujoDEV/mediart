# Mediart Backend (Carpeta `server`)

## Descripción General

Este backend es la API de Mediart, una plataforma para gestionar, recomendar y descubrir contenido multimedia (libros, música, películas, videojuegos y más). Está construido con Node.js, Express y Sequelize, integrando múltiples servicios externos y capacidades de inteligencia artificial.

---

## Herramientas y Tecnologías

- **Node.js** y **Express**: Framework principal del servidor.
- **Sequelize**: ORM para PostgreSQL.
- **Passport**: Autenticación local y JWT.
- **Joi**: Validación de datos.
- **Swagger**: Documentación interactiva de la API.
- **Multer**: Manejo de archivos y uploads.
- **Nodemailer**: Envío de emails (recuperación de contraseña, etc).
- **Docker** y **docker-compose**: Contenedores para backend y base de datos.
- **Integraciones externas**: Spotify, TMDB, IGDB, Google Books, Gemini AI, DeepSeek AI.

---

## Estructura de Carpetas

- `routes/`: Rutas principales de la API (usuarios, auth, playlists, búsqueda, recomendaciones, etc).
- `services/`: Lógica de negocio y conexión con APIs externas e IA.
- `db/models/`: Modelos de base de datos (usuarios, playlists, items, etc).
- `schemas/`: Validaciones de datos con Joi.
- `middlewares/`: Middlewares de autenticación, validación y manejo de errores.
- `uploads/`: Archivos subidos (imágenes de perfil, portadas de playlists).
- `swagger/`: Configuración y documentación de la API.
- `templates/emails/`: Plantillas de email.
- `utils/`: Utilidades (estrategias de Passport, subida de imágenes, etc).

---

## Características Principales

- **Autenticación JWT y local** (registro, login, recuperación de contraseña).
- **Gestión de usuarios** (perfil, seguidores, etc).
- **Playlists**: Crear, editar, eliminar, compartir y colaborar.
- **Búsqueda avanzada**: Por título, autor, género, etc.
- **Recomendaciones**: Algoritmos propios y soporte de IA (Gemini, DeepSeek).
- **Integración con APIs externas**: Spotify, TMDB, IGDB, Google Books.
- **Carga y gestión de imágenes**: Perfiles y portadas de playlists.
- **Documentación Swagger**: Acceso a la documentación interactiva en `/api-docs`.
- **Soporte para Docker**: Fácil despliegue y desarrollo.

---

## Instalación y Ejecución

### Requisitos

- Node.js 20+
- Docker y docker-compose (opcional, recomendado)
- PostgreSQL (si no usas Docker)

### Variables de Entorno

Crea un archivo `.env` en `server/` con las siguientes variables (ver ejemplo en `docker-compose.yml`):

```
NODE_ENV=development
PORT=3000
POSTGRES_DB=mediart
POSTGRES_USER=usuario
POSTGRES_PASSWORD=contraseña
DOCKER_POSTGRES_URL=postgres://usuario:contraseña@postgres:5432/mediart
API_KEY=tu_api_key
JWT_SECRET=tu_jwt_secret
PASSWORD_APP=clave_email
EMAIL_TESTING=correo@prueba.com
TMDB_API_KEY=...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
GOOGLE_BOOKS_API_KEY=...
GOOGLE_GEMINI_API_KEY=...
DEEPSEEK_API_KEY=...
VIDEOGAMES_CLIENT_ID=...
VIDEOGAMES_CLIENT_SECRET=...
```

### Instalación local

```bash
cd server
npm install
npm run migrations:run
npm run dev
```

### Usando Docker

```bash
cd server
docker-compose up --build
```

---

## Migraciones y Base de Datos

- Las migraciones están en `db/migrations/`.
- Usa los scripts de npm para generar, aplicar o revertir migraciones:
  - `npm run migrations:generate --name nombre`
  - `npm run migrations:run`
  - `npm run migrations:revert`
  - `npm run migrations:delete`

---

## Endpoints Principales

- `/api/auth`: Autenticación y recuperación de contraseña.
- `/api/users`: Gestión de usuarios y perfiles.
- `/api/playlists`: CRUD y colaboración en playlists.
- `/api/items`: Gestión de ítems multimedia.
- `/api/search`: Búsqueda avanzada.
- `/api/recommendations`: Recomendaciones personalizadas y por IA.

Consulta la documentación Swagger en `/api-docs` para ver todos los endpoints y probarlos.

---

## Contribución

¡Pull requests y sugerencias son bienvenidas! Por favor, abre un issue para discutir cambios importantes.
