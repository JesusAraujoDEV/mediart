# Mediart Frontend

Este proyecto es el frontend de Mediart, una plataforma para gestión y visualización de perfiles, bibliotecas y recursos multimedia, construido con Nuxt 3 y Vue 3.

## Tabla de Contenidos
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Comandos Útiles](#comandos-útiles)
- [Descripción de Carpetas](#descripción-de-carpetas)
- [Páginas Principales](#páginas-principales)
- [Componentes Destacados](#componentes-destacados)
- [Layouts y Middleware](#layouts-y-middleware)
- [Gestión de Usuario y Perfil](#gestión-de-usuario-y-perfil)
- [Recursos y Estilos](#recursos-y-estilos)
- [Configuración](#configuración)

---

## Estructura del Proyecto

```
client/
  assets/           # Imágenes y recursos estáticos
  components/       # Componentes Vue reutilizables
    navigation/     # Navegación principal y de estudio
    sections/       # Secciones de páginas (perfil, biblioteca, etc.)
    ui/             # Componentes de interfaz (botones, etc.)
  layouts/          # Layouts globales y personalizados
  middleware/       # Middlewares de autenticación y edición
  pages/            # Páginas principales y rutas anidadas
  public/           # Archivos públicos accesibles directamente
  styles/           # Archivos CSS globales
  types/            # Tipos TypeScript compartidos
  nuxt.config.ts    # Configuración principal de Nuxt
  package.json      # Dependencias y scripts
  tsconfig.json     # Configuración de TypeScript
  Dockerfile        # Configuración para despliegue en Docker
  README.md         # Este archivo
```

## Instalación

1. Clona el repositorio y entra en la carpeta `client`.
2. Instala las dependencias:

```bash
npm install
```

## Comandos Útiles

- `npm run dev`     - Inicia el servidor de desarrollo en `http://localhost:3000`
- `npm run build`   - Compila la aplicación para producción
- `npm run preview` - Previsualiza la build de producción localmente

## Descripción de Carpetas

- **assets/**: Imágenes y recursos estáticos usados en la app.
- **components/**: Componentes Vue reutilizables, organizados por tipo o sección.
- **layouts/**: Plantillas globales para páginas (por ejemplo, `default.vue`, `custom.vue`).
- **middleware/**: Funciones que se ejecutan antes de cargar ciertas rutas (ej: autenticación).
- **pages/**: Cada archivo `.vue` es una ruta. Soporta rutas anidadas y dinámicas (ej: `[username]`).
- **public/**: Archivos accesibles directamente desde la web (imágenes, favicon, etc).
- **styles/**: Archivos CSS globales.
- **types/**: Definiciones TypeScript para datos como Usuario, Item, Playlist, etc.

## Páginas Principales

- `/`                - Página de inicio
- `/login`           - Login de usuario
- `/register`        - Registro de usuario
- `/profile/[username]` - Perfil de usuario
- `/profile/edit`    - Edición de perfil (nombre, bio, foto)
- `/studio`          - Panel principal de usuario
- `/studio/playlists/[id]` - Detalle de playlist
- `/studio/item/[id]`      - Detalle de item
- `/studio/search`   - Buscador de recursos
- `/forgot` y `/recovery`  - Recuperación de contraseña
- `404.vue`          - Página de error personalizada

## Componentes Destacados

- **NavigationStudio.vue**: Barra de navegación para el estudio.
- **sections/Profile.vue**: Vista de perfil de usuario.
- **sections/Library.vue**: Biblioteca de recursos del usuario.
- **ui/Button.vue**: Botón reutilizable con estilos personalizados.

## Layouts y Middleware

- **layouts/default.vue**: Layout base para la mayoría de páginas.
- **layouts/custom.vue**: Layout personalizado para páginas especiales.
- **middleware/auth.middleware.ts**: Protege rutas que requieren autenticación.
- **middleware/edit.middleware.ts**: Lógica para edición de recursos.

## Gestión de Usuario y Perfil

- El usuario puede editar su nombre, biografía y foto de perfil desde `/profile/edit`.
- Para actualizar la foto de perfil:
  - Si se sube un archivo, se envía como `profilePicture` (form-data).
  - Si se elimina la foto, se envía `profilePictureUrl` como string vacío.
  - Para solo editar nombre/bio, se envía JSON normal.
- El token de autenticación se almacena en `localStorage` y se envía en el header `Authorization`.

## Recursos y Estilos

- Imágenes y fondos en `assets/` y `public/`.
- Estilos globales en `styles/float.css`.
- Uso de TailwindCSS para utilidades rápidas de diseño.

## Configuración

- Variables de entorno y endpoints en `nuxt.config.ts`.
- Tipos TypeScript en `types/` para mayor seguridad y autocompletado.

---

### ¿Dudas o sugerencias?
Puedes abrir un issue o contribuir directamente al repositorio.
