# Mediart

¡Bienvenido a **Mediart**! 🎨🎶

Sistema de Información 2

---

## Descripción

Mediart es una plataforma para la gestión y exploración de contenido multimedia, pensada para artistas, creadores y amantes del arte. Permite organizar bibliotecas, crear playlists y conectar con otros usuarios en un entorno moderno y seguro.

## Características principales

- Autenticación de usuarios
- Biblioteca multimedia personal
- Creación y gestión de playlists
- Perfil de usuario y seguimiento
- Interfaz moderna con Nuxt.js
- Backend robusto con Node.js y Sequelize

## Estructura del proyecto

```
mediart/
├── client/        # Frontend Nuxt.js
├── server/        # Backend Node.js
├── test/          # Pruebas
└── README.md      # Documentación
```

## Instalación rápida

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/JesusAraujoDEV/mediart.git
   ```
2. **Instala dependencias en `client` y `server`:**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
3. **Configura las variables de entorno** según los archivos de ejemplo (`.env.example`).
4. **Inicia el proyecto:**
   - Frontend:
     ```bash
     cd client
     npm run dev
     ```
   - Backend:
     ```bash
     cd ../server
     npm start
     ```

## Documentación

Consulta la documentación en el archivo [`README.md`](README.md) y los comentarios en el código para más detalles sobre la arquitectura y uso de la plataforma.

## Contribuir

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request siguiendo las buenas prácticas de desarrollo.

## Licencia

Este proyecto está bajo la licencia MIT.