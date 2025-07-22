# Mediart Backend (Carpeta `server`)

-----

## Descripción General

Este backend es la API de Mediart, una plataforma para gestionar, recomendar y descubrir contenido multimedia (libros, música, películas, videojuegos y más). Está construido con **Node.js**, **Express** y **Sequelize**, integrando múltiples servicios externos y capacidades de inteligencia artificial.

-----

## Herramientas y Tecnologías

  * **Node.js** y **Express**: Framework principal del servidor.
  * **Sequelize**: ORM para PostgreSQL.
  * **Passport**: Autenticación local y JWT.
  * **Joi**: Validación de datos.
  * **Swagger**: Documentación interactiva de la API.
  * **Multer**: Manejo de archivos y uploads.
  * **Nodemailer**: Envío de emails (recuperación de contraseña, etc).
  * **Docker** y **docker-compose**: Contenedores para backend y base de datos.
  * **Integraciones externas**: Spotify, TMDB, IGDB, Google Books, Gemini AI, DeepSeek AI.

-----

## Estructura de Carpetas

  * `routes/`: Rutas principales de la API (usuarios, auth, playlists, búsqueda, recomendaciones, etc).
  * `services/`: Lógica de negocio y conexión con APIs externas e IA.
  * `db/models/`: Modelos de base de datos (usuarios, playlists, items, etc).
  * `schemas/`: Validaciones de datos con Joi.
  * `middlewares/`: Middlewares de autenticación, validación y manejo de errores.
  * `uploads/`: Archivos subidos (imágenes de perfil, portadas de playlists).
  * `swagger/`: Configuración y documentación de la API.
  * `templates/emails/`: Plantillas de email.
  * `utils/`: Utilidades (estrategias de Passport, subida de imágenes, etc).

-----

## Características Principales

  * **Autenticación JWT y local** (registro, login, recuperación de contraseña).
  * **Gestión de usuarios** (perfil, seguidores, etc).
  * **Playlists**: Crear, editar, eliminar, compartir y colaborar.
  * **Búsqueda avanzada**: Por título, autor, género, etc.
  * **Recomendaciones**: Algoritmos propios y soporte de IA (Gemini, DeepSeek).
  * **Integración con APIs externas**: Spotify, TMDB, IGDB, Google Books.
  * **Carga y gestión de imágenes**: Perfiles y portadas de playlists.
  * **Documentación Swagger**: Acceso a la documentación interactiva en `/api-docs`.
  * **Soporte para Docker**: Fácil despliegue y desarrollo.

-----

## Instalación y Ejecución

### Requisitos

  * Node.js 20+
  * Docker y docker-compose (opcional, recomendado)
  * PostgreSQL (si no usas Docker)

### Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta `server/` con las siguientes variables. Puedes tomar como referencia el archivo `.env-example`.

```dotenv
# -----------------------------------------------------------------------------
# Configuración Principal de la Aplicación
# -----------------------------------------------------------------------------
NODE_ENV=development
# NODE_ENV=production # Descomentar para despliegue en producción y aplicar SSL/TLS
PORT=3000

CLIENT_URL='http://localhost:5173' # URL del frontend
BACKEND_URL='http://localhost:3000' # URL del backend
CORS_WHITELIST='http://localhost:3000,http://localhost:5173,https://mediart.onrender.com' # Orígenes permitidos para CORS, separados por comas

# -----------------------------------------------------------------------------
# Configuración de Seguridad y Autenticación
# -----------------------------------------------------------------------------
API_KEY=tu_api_key_segura
JWT_SECRET=tu_jwt_secret_largo_y_seguro

# -----------------------------------------------------------------------------
# Configuración de la Base de Datos (PostgreSQL)
# -----------------------------------------------------------------------------
POSTGRES_DB=mediart_db
POSTGRES_USER=usuario_postgres
POSTGRES_PASSWORD=contraseña_postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB_URL='postgresql://usuario_postgres:contraseña_postgres@localhost:5432/mediart_db'
# Ejemplo para Docker:
DOCKER_POSTGRES_URL='postgresql://usuario_postgres:contraseña_postgres@postgres:5432/mediart_db'
# Para despliegues en la nube (ej. Render, Aiven), podrías necesitar un certificado CA:
# POSTGRES_CA_CERT='-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----'

# -----------------------------------------------------------------------------
# Claves y Credenciales de APIs Externas
# -----------------------------------------------------------------------------
TMDB_API_KEY=tu_tmdb_api_key
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret
GOOGLE_BOOKS_API_KEY=tu_google_books_api_key
GOOGLE_GEMINI_API_KEY=tu_google_gemini_api_key
DEEPSEEK_API_KEY=tu_deepseek_api_key
IMGBB_API_KEY=tu_imgbb_api_key

# -----------------------------------------------------------------------------
# Configuración de Email
# -----------------------------------------------------------------------------
NO_REPLY_EMAIL=tu_email@ejemplo.com
EMAIL_APP_PASSWORD=tu_contraseña_de_aplicacion_email # Contraseña de aplicación si usas Gmail

# -----------------------------------------------------------------------------
# API de Videojuegos (Twitch/IGDB)
# -----------------------------------------------------------------------------
VIDEOGAMES_CLIENT_ID=tu_igdb_client_id
VIDEOGAMES_CLIENT_SECRET=tu_igdb_client_secret
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

-----

## Migraciones y Base de Datos

  * Las migraciones están en `db/migrations/`.

  * Usa los scripts de npm para generar, aplicar o revertir migraciones:

    ```bash
    npm run migrations:generate --name nombre_de_la_migracion
    ```

    ```bash
    npm run migrations:run
    ```

    ```bash
    npm run migrations:revert
    ```

    ```bash
    npm run migrations:delete
    ```

-----

## Endpoints Principales

  * `/api/auth`: Autenticación y recuperación de contraseña.
  * `/api/users`: Gestión de usuarios y perfiles.
  * `/api/playlists`: CRUD y colaboración en playlists.
  * `/api/items`: Gestión de ítems multimedia.
  * `/api/search`: Búsqueda avanzada.
  * `/api/recommendations`: Recomendaciones personalizadas y por IA.

Consulta la documentación Swagger en `/api-docs` para ver todos los endpoints y probarlos.

-----

## Contribución

¡**Pull requests** y **sugerencias** son bienvenidas\! Por favor, abre un issue para discutir cambios importantes.