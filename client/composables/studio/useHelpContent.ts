import { ref, computed } from "vue";

/**
 * Define la estructura de los datos para el contenido de ayuda.
 */
interface Content {
  pageTitle: string;
  title: string;
  intro: string;
  tabs: {
    gettingStarted: string;
    newFeatures: string;
    advancedTips: string;
    faq: string;
    contact: string;
  };
  sections: {
    newFeaturesDescription: string;
    advancedTipsDescription: string;
    faqDescription: string;
    contactDescription: string;
  };
  faq: {
    question1: string;
    answer1: string;
    question2: string;
    answer2: string;
    question3: string;
    answer3: string;
    question4: string;
    answer4: string;
    question5: string;
    answer5: string;
    question6: string;
    answer6: string;
  };
  step1: {
    heading: string;
    paragraph1: string;
    strong1: string;
    paragraph2: string;
    strong2: string;
    paragraph3: string;
    strong3: string;
    paragraph4: string;
  };
  step2: {
    heading: string;
    paragraph1: string;
    strong1: string;
    paragraph2: string;
    strong2: string;
    paragraph3: string;
  };
  step3: {
    heading: string;
    paragraph1: string;
    strong1: string;
    paragraph2: string;
    list1Strong: string;
    listItem1: string;
    list2Strong: string;
    listItem2: string;
    list3Strong: string;
    listItem3: string;
    list4Strong: string;
    listItem4: string;
    list5Strong: string;
    listItem5: string;
    list6Strong: string;
    listItem6: string;
    list7Strong: string;
    listItem7: string;
    list8Strong: string;
    listItem8: string;
    paragraph3: string;
  };
  step4: {
    heading: string;
    paragraph1: string;
    strong1: string;
    paragraph2: string;
    strong2: string;
    paragraph3: string;
  };
  step5: {
    heading: string;
    paragraph1: string;
    strong1: string;
    listItem1: string;
    listStrong1: string;
    listItem2: string;
    listStrong2: string;
    listItem3: string;
  };
  step6: {
    heading: string;
    paragraph1: string;
    strong1: string;
    paragraph2: string;
    strong2: string;
    paragraph3: string;
  };
  outro: string;
  contact: {
    reportIssuesTitle: string;
    reportIssuesDescription: string;
    reportIssuesButton: string;
    suggestionsTitle: string;
    suggestionsDescription: string;
    suggestionsButton: string;
    tourTitle: string;
    tourDescription: string;
    tourButton: string;
    contactTitle: string;
    contactDescription: string;
  };
}

// Define todo el contenido de ayuda en ambos idiomas
const contentData = {
  en: {
    pageTitle: "Help",
    title: "How to Use MediartStudio",
    intro:
      "Welcome to MediartStudio! Here's how you can easily generate and save your personalized playlists:",
    tabs: {
      gettingStarted: "Getting Started",
      newFeatures: "New Features",
      advancedTips: "Advanced Tips",
      faq: "FAQ",
      contact: "Contact",
    },
    sections: {
      newFeaturesDescription: "Discover the latest improvements in MediartStudio",
      advancedTipsDescription: "Maximize your experience with MediartStudio",
      faqDescription: "Answers to the most common questions",
      contactDescription: "Need help? We're here for you",
    },
    faq: {
      question1: "How does the recommendation system work?",
      answer1: "MediartStudio uses advanced machine learning algorithms to analyze your tastes and generate personalized recommendations based on patterns from other users. The system learns from your selections to continuously improve suggestions.",
      question2: "Can I create collaborative playlists?",
      answer2: "Yes, MediartStudio allows creating collaborative playlists where multiple users can contribute recommendations. This feature is perfect for groups of friends or work teams who share similar interests.",
      question3: "Is the data secure?",
      answer3: "Absolutely. We use enterprise-level encryption and comply with the strictest data protection regulations. Your personal preferences and playlists are completely protected.",
      question4: "Is there a limit on the number of playlists?",
      answer4: "There are no limits on the number of playlists you can create. Organize your content as you wish and access all your creations from your personal profile.",
      question5: "Can I export my playlists?",
      answer5: "Yes, you can export your playlists in multiple formats including JSON, CSV and shareable links. This allows you to use your playlists on other platforms or share them easily.",
      question6: "How does the smart cache work?",
      answer6: "The system temporarily saves your recent searches to speed up future similar queries. This means that if you search for something you've searched for before, the results will appear instantly.",
    },
    step1: {
      heading: "1. Express Your Tastes",
      paragraph1: "At the bottom of the screen, you'll find a",
      strong1: "text input field ",
      paragraph2:
        "This is where you'll start expressing your preferences. You can type in names of",
      strong2: "songs, artists, albums, movies, TV shows, books, or video games ",
      paragraph3: "As you type, the system will offer",
      strong3: "suggestions ",
      paragraph4: "to help you select your interests.",
    },
    step2: {
      heading: "2. Select Your Tags",
      paragraph1: "Once suggestions appear, you can",
      strong1: "select as many tastes (tags) as you wish ",
      paragraph2:
        'by clicking on them. Each selection will be added as a visible "tag" in the same field. If you change your mind, you can',
      strong2: "remove a tag ",
      paragraph3: "by clicking the '✕' icon next to it.",
    },
    step3: {
      heading: "3. Choose the Category",
      paragraph1: "To the right of the text field, you'll see a",
      strong1: "dropdown menu (select) ",
      paragraph2:
        "This allows you to specify the content category you want the system to consider when generating your playlist. Options include:",
      list1Strong: "Mix (default)",
      listItem1: "For a varied playlist combining all media types.",
      list2Strong: "Songs",
      listItem2: "Focused exclusively on songs.",
      list3Strong: "Artists",
      listItem3: "Centered on artists.",
      list4Strong: "Albums",
      listItem4: "Based on albums.",
      list5Strong: "Movies",
      listItem5: "For movie-related playlists.",
      list6Strong: "TV Shows",
      listItem6: "For TV show content.",
      list7Strong: "Books",
      listItem7: "Generates playlists inspired by books.",
      list8Strong: "Videogames",
      listItem8: "For playlists based on video games.",
      paragraph3:
        "Make sure to select the category that best suits your mood or need.",
    },
    step4: {
      heading: "4. Generate Your Playlist",
      paragraph1:
        "Once you've selected your tastes and the category, click the",
      strong1: "send button (the paper airplane icon) ",
      paragraph2: "MediartStudio will process your request and",
      strong2: "generate a playlist ",
      paragraph3: "based on your preferences.",
    },
    step5: {
      heading: "5. Review and Refine",
      paragraph1:
        "After the playlist is generated, you'll have the option to either",
      strong1: "accept or reformulate it",
      listItem1: "If you're satisfied with the playlist, click",
      listStrong1: "Accept",
      listItem2: "If you want to try something different, you can",
      listStrong2: "reformulate it",
      listItem3:
        "by entering new tastes or adjusting the category, and then resubmit the request.",
    },
    step6: {
      heading: "6. Name and Save",
      paragraph1:
        "Finally, once you've accepted the generated playlist, you'll be prompted to",
      strong1: "give it a name",
      paragraph2: "Choose a name you like, and the playlist will be",
      strong2: "automatically saved to your profile",
      paragraph3: "ready for you to enjoy anytime.",
    },
    outro: "Enjoy creating your personalized playlists with MediartStudio!",
    contact: {
      reportIssuesTitle: "Report Issues",
      reportIssuesDescription: "Found a bug or error? Let us know so we can fix it quickly.",
      reportIssuesButton: "Report Problem",
      suggestionsTitle: "Suggestions",
      suggestionsDescription: "Do you have ideas to improve MediartStudio? We'd love to hear them!",
      suggestionsButton: "Send Suggestion",
      tourTitle: "Interactive Tour",
      tourDescription: "Prefer to learn step by step? Start our guided tour.",
      tourButton: "Start Tour",
      contactTitle: "Direct Contact",
      contactDescription: "For specific queries, contact us directly.",
    },
  },
  es: {
    pageTitle: "Ayuda",
    title: "¿Cómo Usar MediartStudio?",
    intro:
      "¡Bienvenido a MediartStudio! Aquí te explicamos cómo puedes generar y guardar tus playlists personalizadas de manera sencilla:",
    tabs: {
      gettingStarted: "Primeros Pasos",
      newFeatures: "Nuevas Funcionalidades",
      advancedTips: "Consejos Avanzados",
      faq: "Preguntas Frecuentes",
      contact: "Contacto",
    },
    sections: {
      newFeaturesDescription: "Descubre las últimas mejoras de MediartStudio",
      advancedTipsDescription: "Maximiza tu experiencia con MediartStudio",
      faqDescription: "Respuestas a las dudas más comunes",
      contactDescription: "¿Necesitas ayuda? Estamos aquí para ti",
    },
    faq: {
      question1: "¿Cómo funciona el sistema de recomendaciones?",
      answer1: "MediartStudio utiliza algoritmos avanzados de machine learning para analizar tus gustos y generar recomendaciones personalizadas basadas en patrones similares de otros usuarios. El sistema aprende de tus selecciones para mejorar continuamente las sugerencias.",
      question2: "¿Puedo crear playlists colaborativas?",
      answer2: "Sí, MediartStudio permite crear playlists colaborativas donde varios usuarios pueden contribuir con recomendaciones. Esta función es perfecta para grupos de amigos o equipos de trabajo que comparten intereses similares.",
      question3: "¿Los datos están seguros?",
      answer3: "Absolutamente. Utilizamos encriptación de nivel empresarial y cumplimos con las normativas de protección de datos más estrictas. Tus preferencias y playlists personales están completamente protegidas.",
      question4: "¿Hay límite en el número de playlists?",
      answer4: "No hay límites en la cantidad de playlists que puedes crear. Organiza tu contenido como prefieras y accede a todas tus creaciones desde tu perfil personal.",
      question5: "¿Puedo exportar mis playlists?",
      answer5: "Sí, puedes exportar tus playlists en múltiples formatos incluyendo JSON, CSV y enlaces compartibles. Esto te permite usar tus playlists en otras plataformas o compartirlas fácilmente.",
      question6: "¿Cómo funciona el caché inteligente?",
      answer6: "El sistema guarda temporalmente tus búsquedas recientes para acelerar futuras consultas similares. Esto significa que si buscas algo que ya has buscado antes, los resultados aparecerán instantáneamente.",
    },
    step1: {
      heading: "1. Expresa Tus Gustos",
      paragraph1: "En la parte inferior de la pantalla, encontrarás un",
      strong1: "campo de texto. ",
      paragraph2:
        "Aquí es donde comenzarás a expresar tus preferencias. Puedes escribir nombres de",
      strong2:
        "canciones, artistas, álbumes, películas, series de televisión, libros o videojuegos ",
      paragraph3: "A medida que escribes, el sistema te ofrecerá",
      strong3: "sugerencias ",
      paragraph4: "para ayudarte a seleccionar tus intereses.",
    },
    step2: {
      heading: "2. Selecciona Tus Etiquetas (Tags)",
      paragraph1: "Una vez que las sugerencias aparezcan, puedes",
      strong1: "seleccionar la cantidad de gustos (etiquetas) que desees ",
      paragraph2:
        'haciendo clic en ellas. Cada selección se añadirá como una "etiqueta" visible en el mismo campo. Si cambias de opinión, puedes',
      strong2: "eliminar una etiqueta ",
      paragraph3: "haciendo clic en el ícono '✕' junto a ella.",
    },
    step3: {
      heading: "3. Elige la Categoría",
      paragraph1: "A la derecha del campo de texto, verás un",
      strong1: "menú desplegable (select) ",
      paragraph2:
        "Este te permite especificar la categoría de contenido que deseas que el sistema considere al generar tu playlist. Las opciones incluyen:",
      list1Strong: "Mix (por defecto)",
      listItem1:
        "Para una playlist variada que combina todos los tipos de medios.",
      list2Strong: "Canciones",
      listItem2: "Enfocada exclusivamente en canciones.",
      list3Strong: "Artistas",
      listItem3: "Centrada en artistas.",
      list4Strong: "Álbumes",
      listItem4: "Basada en álbumes.",
      list5Strong: "Películas",
      listItem5: "Para playlists relacionadas con películas.",
      list6Strong: "Series de TV",
      listItem6: "Para contenido de series de televisión.",
      list7Strong: "Libros",
      listItem7: "Genera playlists inspiradas en libros.",
      list8Strong: "Videojuegos",
      listItem8: "Para playlists basadas en videojuegos.",
      paragraph3:
        "Asegúrate de seleccionar la categoría que mejor se adapte a tu estado de ánimo o necesidad.",
    },
    step4: {
      heading: "4. Genera Tu Playlist",
      paragraph1:
        "Una vez que hayas seleccionado tus gustos y la categoría, haz clic en el",
      strong1: "botón de enviar (el ícono de avión de papel) ",
      paragraph2: "MediartStudio procesará tu solicitud y",
      strong2: "generará una playlist ",
      paragraph3: "basada en tus preferencias.",
    },
    step5: {
      heading: "5. Revisa y Refina",
      paragraph1:
        "Después de que la playlist sea generada, tendrás la opción de",
      strong1: "aceptarla o reformularla",
      listItem1: "Si estás satisfecho con la playlist, haz clic en",
      listStrong1: "Aceptar",
      listItem2: "Si deseas probar algo diferente, puedes",
      listStrong2: "reformularla",
      listItem3:
        "introduciendo nuevos gustos o ajustando la categoría, y luego volver a enviar la solicitud.",
    },
    step6: {
      heading: "6. Nombra y Guarda",
      paragraph1:
        "Finalmente, una vez que hayas aceptado la playlist generada, se te pedirá que le",
      strong1: "pongas un nombre",
      paragraph2: "Elige un nombre que te guste, y la playlist",
      strong2: "se guardará automáticamente en tu perfil",
      paragraph3: "lista para que la disfrutes en cualquier momento.",
    },
    outro: "¡Disfruta creando tus playlists personalizadas con MediartStudio!",
    contact: {
      reportIssuesTitle: "Reportar Problemas",
      reportIssuesDescription: "¿Encontraste un bug o error? Háznoslo saber para solucionarlo rápidamente.",
      reportIssuesButton: "Reportar Problema",
      suggestionsTitle: "Sugerencias",
      suggestionsDescription: "¿Tienes ideas para mejorar MediartStudio? ¡Queremos escucharlas!",
      suggestionsButton: "Enviar Sugerencia",
      tourTitle: "Tour Interactivo",
      tourDescription: "¿Prefieres aprender paso a paso? Inicia nuestro tour guiado.",
      tourButton: "Iniciar Tour",
      contactTitle: "Contacto Directo",
      contactDescription: "Para consultas específicas, contáctanos directamente.",
    },
  },
};

/**
 * Composable para gestionar el contenido de la página de ayuda.
 * Permite cambiar el idioma y obtener el contenido reactivo.
 *
 * @returns {object} Un objeto con el idioma actual, la función para cambiarlo y el contenido computado.
 */
export const useHelpContent = () => {
  const currentLanguage = ref("es");

  const toggleLanguage = () => {
    currentLanguage.value = currentLanguage.value === "en" ? "es" : "en";
  };

  const currentContent = computed<Content>(() => {
    return contentData[currentLanguage.value as "en" | "es"];
  });

  return {
    currentLanguage,
    toggleLanguage,
    currentContent,
  };
};