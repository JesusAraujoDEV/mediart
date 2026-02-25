# Mediart - Landing Page

¡Bienvenido al repositorio de la Landing Page de Mediart! Este proyecto se enfoca en la creación de una página de aterrizaje atractiva y funcional que sirva como puerta de entrada para los nuevos usuarios de Mediart, la plataforma definitiva para el descubrimiento personalizado de contenido multimedia.

---

## Propósito del Proyecto

Esta rama y el desarrollo asociado se dedican exclusivamente a la elaboración de la Landing Page de Mediart, diseñada para:

* **Comunicar la Propuesta de Valor:** Destacar de manera concisa qué es Mediart y cómo beneficia a los usuarios.
* **Captar el Interés:** Atraer a visitantes y convertirlos en usuarios registrados.
* **Informar sobre la Plataforma:** Presentar las características clave y el tipo de contenido disponible.
* **Generar Expectativa:** Crear una comunidad en torno a la fase de lanzamiento (Early Adopters).

---

## Estructura y Secciones de la Landing Page

La Landing Page de Mediart estará compuesta por las siguientes secciones principales, diseñadas para guiar al usuario a través de un flujo intuitivo y persuasivo:

1.  ### **Hero Section**
    * **Objetivo:** Impactar al visitante con la propuesta de valor principal de Mediart.
    * **Contenido:** Un titular potente, una breve descripción de los beneficios y un **Call-to-Action (CTA)** prominente para el registro o la búsqueda inicial.
    * **Referencia Visual:** 

2.  ### **Cómo Funciona**
    * **Objetivo:** Explicar de forma sencilla el proceso de interacción con Mediart.
    * **Contenido:** Una guía paso a paso, idealmente de 3 a 4 pasos claros, como:
        1.  **Registro Fácil:** Crea tu cuenta en segundos.
        2.  **Generación de Recomendaciones Personalizadas:** Ingresa tus gustos y deja que nuestra IA haga la magia.
        3.  **Exploración y Descubrimiento:** Sumérgete en un universo de contenido curado solo para ti.

3.  ### **Categorías de Contenido**
    * **Objetivo:** Mostrar la amplitud y diversidad del contenido que los usuarios pueden explorar.
    * **Contenido:** Una visualización atractiva que destaque las principales categorías, como:
        * Películas 
        * Series TV 
        * Canciones 
        * Artistas 
        * Álbumes 
        * Libros 
        * Videojuegos 

4.  ### **Ventajas Clave de Mediart**
    * **Objetivo:** Resaltar los beneficios únicos y diferenciadores de la plataforma.
    * **Contenido:** Puntos clave que expliquen por qué Mediart es la mejor opción para el descubrimiento personalizado, tales como:
        * Recomendaciones impulsadas por IA.
        * Experiencia de usuario intuitiva.
        * Amplio catálogo de contenido.
        * Comunidad activa y colaborativa.

5.  ### **Comunidad / Early Adopters**
    * **Objetivo:** Invitar a los usuarios a unirse a la comunidad inicial y obtener acceso anticipado.
    * **Contenido:** Un mensaje que fomente la participación, quizá con un formulario de suscripción a una lista de espera o enlaces a canales de comunidad (Discord, grupos, etc.).

6.  ### **Call to Action (CTA) Final**
    * **Objetivo:** Ofrecer una última oportunidad clara y directa para que el usuario realice la acción deseada (registro).
    * **Contenido:** Un botón o enlace destacado para "Registrarse ahora" o "Comenzar mi experiencia".

---

## Componentes de Navegación

### **Navbar (Barra de Navegación Superior)**
La barra de navegación será intuitiva y proporcionará acceso rápido a las secciones principales de la Landing Page, así como opciones clave para el usuario. Podría incluir:

* Logo de Mediart
* Enlaces a secciones (`#como-funciona`, `#categorias`, `#ventajas`)
* Botones de `Iniciar Sesión`  y `Registrarse`.

### **Footer (Pie de Página)**
El pie de página contendrá información importante y enlaces de utilidad, garantizando transparencia y soporte al usuario:

* **Información Legal y de Soporte:**
    * Términos y Condiciones
    * Política de Privacidad
    * Política de Cookies
    * Preguntas Frecuentes (FAQ)
    * Contacta con nosotros
* **Recursos y Educación:**
    * Sobre nosotros
    * Mediart Education (Si aplica, material educativo o tutoriales)
    * Diccionario (Conceptos clave de Mediart, ej. "Qué es una Playlist Personalizada")
    * Precios (Si hay planes futuros o premium)
    * Coming Soon (Funcionalidades o categorías futuras)
* **Conexión Social:**
    * Redes Sociales: Instagram, LinkedIn, Letterboxd, WhatsApp, Discord, TikTok, MusicBoard, Spotify, Twitter, Pinterest, YouTube.

---

## Diagramas Relevantes

Para una comprensión más profunda de la arquitectura y el comportamiento del sistema, se pueden consultar los siguientes diagramas:

* **Diagrama de Casos de Uso (UC-001.1 Registrarse, UC-002 Gestionar Perfil, UC-004 Seguir Usuario, UC-005 Gestionar Listas Personalizadas, UC-006 Cerrar Sesión):** Muestra las interacciones del usuario con el sistema.
* **Diagrama de Estado del Objeto "Usuario":** Representa los diferentes estados de un usuario en la plataforma (ej. Autenticado, No Autenticado, Eliminado).
* **Diagrama de Estado del Objeto "Lista Personalizada":** Muestra el ciclo de vida de las listas creadas por el usuario.
* **Diagrama de Estado del Objeto "Relación de Seguimiento":** Describe cómo un seguimiento entre usuarios se establece y se deshace.
* **Diagramas de Actividad (Login, Register, Recuperación de Contraseña, Cerrar Sesión, Seguir Usuario):** Ilustran los flujos de trabajo de procesos clave.

---

## Tecnologías Utilizadas

El desarrollo de la Landing Page de Mediart se apoya en las siguientes tecnologías y herramientas principales:

- **[Nuxt 3](https://nuxt.com/):** Framework de desarrollo web basado en Vue 3, utilizado para construir aplicaciones modernas, rápidas y escalables.
- **[Vue 3](https://vuejs.org/):** Framework progresivo de JavaScript para la construcción de interfaces de usuario reactivas y componentes reutilizables.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework de utilidades CSS para un diseño rápido y altamente personalizable.
- **[PrimeIcons](https://www.primefaces.org/primeicons/):** Conjunto de iconos vectoriales para enriquecer la interfaz de usuario.
- **[Lucide Vue Next](https://lucide.dev/):** Colección de iconos SVG open source, integrados fácilmente con Vue 3.
- **[SweetAlert2](https://sweetalert2.github.io/):** Biblioteca para mostrar alertas y diálogos personalizados y atractivos.
- **[Vue Toastification](https://vue-toastification.maronato.dev/):** Sistema de notificaciones toast para Vue 3.
- **[Flashy JS](https://github.com/flashy-js/flashy):** Biblioteca para mostrar mensajes flash y notificaciones.
- **[@nuxt/image](https://image.nuxt.com/):** Optimización y manipulación de imágenes en aplicaciones Nuxt.
- **[@nuxt/icon](https://icon.nuxt.com/):** Integración sencilla de iconos en proyectos Nuxt.
- **[Vue Router](https://router.vuejs.org/):** Enrutador oficial para Vue.js, utilizado para la navegación entre páginas y secciones.

Estas tecnologías permiten crear una experiencia de usuario moderna, eficiente y visualmente atractiva, facilitando el desarrollo y mantenimiento del proyecto.


---

## Cómo Contribuir


---

## Licencia


---

**© 2026 Mediart. Todos los derechos reservados.**
