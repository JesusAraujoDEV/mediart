import { ref, nextTick } from 'vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { Driver, DriveStep } from 'driver.js'

export function useStudioTutorial() {
  const isTutorialActive = ref(false)
  const driverInstance = ref<Driver | null>(null)
  let popoverObserver: MutationObserver | null = null

  // Limpieza defensiva: elimina instancias y listeners previos para evitar popovers duplicados
  function ensureCleanState() {
    try {
      // Destruir instancia previa si existe
      if (driverInstance.value) {
        try { driverInstance.value.destroy() } catch (e) { /* ignore */ }
        driverInstance.value = null
      }

      // Quitar overlays y popovers remanentes
      const overlays = document.querySelectorAll('.driver-overlay, .driver-popover, .driver-popover-custom')
      overlays.forEach(el => el.remove())

      // Remover resaltados
      const highlighted = document.querySelectorAll('.driver-highlighted-element')
      highlighted.forEach(el => el.classList.remove('driver-highlighted-element'))

      // Remover listener delegado si existe
      const globalL = (window as any).__mediart_driver_done_listener as ((e: MouseEvent) => void) | undefined
      if (globalL) {
        try { document.removeEventListener('click', globalL, true) } catch (err) { /* ignore */ }
        try { delete (window as any).__mediart_driver_done_listener } catch (err) { /* ignore */ }
      }

      // Desconectar observer si existe
      if (popoverObserver) {
        try { popoverObserver.disconnect() } catch (err) { /* ignore */ }
        popoverObserver = null
      }

      isTutorialActive.value = false
    } catch (err) {
      console.warn('Error during ensureCleanState:', err)
    }
  }

  const startTutorial = async () => {
  // Asegurar que no haya una instancia previa corriendo (evita popovers/btns duplicados)
  ensureCleanState()
  await nextTick()

    // Detectar la página actual
    const currentPath = window.location.pathname
    let steps: DriveStep[] = []

    if (currentPath.includes('/studio/search')) {
      // Pasos específicos para la página de búsqueda
      steps = [
        {
          element: '[data-tutorial="navbar"]',
          popover: {
            title: '🧭 Navegación de Mediart Studio',
            description: 'Aquí tienes acceso a tu perfil, ayuda, búsqueda y opciones para crear playlists. En móvil, toca el menú hamburguesa para ver más opciones.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="search-type"]',
          popover: {
            title: '🎯 Tipo de Búsqueda',
            description: 'Selecciona el tipo de contenido que quieres buscar. Puedes elegir entre usuarios, canciones, artistas, álbumes, películas, series, libros o videojuegos.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="search-bar"]',
          popover: {
            title: '🔍 Barra de Búsqueda',
            description: 'Aquí puedes escribir el término que quieres buscar. La barra se adapta automáticamente al tipo de contenido seleccionado.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="search-button"]',
          popover: {
            title: '🚀 Iniciar Búsqueda',
            description: 'Haz clic aquí para buscar el contenido que has especificado. Los resultados aparecerán abajo.',
            side: 'left' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="tutorial-button"]',
          popover: {
            title: '📚 Centro de Ayuda',
            description: 'Si necesitas más ayuda, puedes acceder al tutorial interactivo o al centro de ayuda completo.',
            side: 'top' as const,
            align: 'center' as const
          }
        }
      ]
    } else if (currentPath.includes('/studio/create')) {
      // Pasos específicos para la página de crear playlist
      steps = [
        {
          element: '[data-tutorial="navbar"]',
          popover: {
            title: '🧭 Navegación de Mediart Studio',
            description: 'Aquí tienes acceso a tu perfil, ayuda, búsqueda y opciones para crear playlists. En móvil, toca el menú hamburguesa para ver más opciones.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="playlist-name"]',
          popover: {
            title: '📝 Nombre de la Playlist',
            description: 'Dale un nombre único y descriptivo a tu playlist. Este será el título que verán otros usuarios.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="playlist-description"]',
          popover: {
            title: '📖 Descripción',
            description: 'Describe el propósito o ambiente de tu playlist. Una buena descripción ayuda a otros usuarios a entender qué esperar.',
            side: 'top' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="search-input"]',
          popover: {
            title: '🔍 Buscar Contenido',
            description: 'Busca canciones, películas, libros y más contenido para añadir a tu playlist. Escribe el nombre del ítem que quieres buscar.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="item-type"]',
          popover: {
            title: '🎯 Filtrar por Tipo',
            description: 'Selecciona el tipo de contenido que quieres buscar para refinar los resultados.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="selected-items"]',
          popover: {
            title: '📋 Tus Ítems Seleccionados',
            description: 'Aquí verás todos los ítems que has añadido a tu playlist. Puedes quitarlos haciendo clic en la X.',
            side: 'top' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="create-button"]',
          popover: {
            title: '✨ Crear Playlist',
            description: 'Cuando tengas todo listo, haz clic aquí para crear tu playlist. Necesitas al menos un nombre y un ítem.',
            side: 'left' as const,
            align: 'center' as const
          }
        }
      ]
    } else {
      // Pasos para la página principal (index.vue)
      steps = [
        {
          element: '[data-tutorial="navbar"]',
          popover: {
            title: '🧭 Navegación de Mediart Studio',
            description: 'Aquí tienes acceso a tu perfil, ayuda, búsqueda y opciones para crear playlists. En móvil, toca el menú hamburguesa para ver más opciones. En escritorio, usa la flecha para expandir o contraer los íconos del menú completo.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="search-type"]',
          popover: {
            title: '🎯 Tipo de Búsqueda',
            description: 'Selecciona el tipo de contenido que quieres buscar. Puedes elegir entre canciones, artistas, álbumes, películas, series, libros o videojuegos.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="search-bar"]',
          popover: {
            title: '🔍 Barra de Búsqueda Inteligente',
            description: 'Aquí puedes buscar y agregar tags de tus intereses. Escribe el nombre de un artista, género, película o cualquier tema que te guste. Los tags aparecerán como etiquetas que puedes eliminar.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="category-selector"]',
          popover: {
            title: '📋 Tipo de Lista',
            description: 'Elige qué tipo de lista quieres crear. Puedes hacer una mezcla de todo o enfocarte en un tipo específico de contenido.',
            side: 'bottom' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="send-button"]',
          popover: {
            title: '🚀 Generar Recomendaciones',
            description: 'Haz clic aquí para enviar tus tags y generar recomendaciones personalizadas basadas en tus intereses.',
            side: 'left' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="recommendations-area"]',
          popover: {
            title: '✨ Tus Recomendaciones',
            description: 'Aquí aparecerán tus recomendaciones personalizadas. Cada elemento incluye información detallada, calificaciones y enlaces externos.',
            side: 'top' as const,
            align: 'center' as const
          }
        },
        {
          element: '[data-tutorial="action-buttons"]',
          popover: {
            title: '🎵 Gestionar tu Lista',
            description: 'Cuando tengas recomendaciones, puedes aceptarlas para crear una playlist o regenerar nuevas recomendaciones si no te convencen.',
            side: 'top' as const,
            align: 'center' as const
          }
        }
      ]
    }

    driverInstance.value = driver({
      showProgress: true,
      steps: steps,
      onHighlightStarted: (element, step, options) => {
        // Buscar el botón "Entendido" en cada paso
        setTimeout(() => {
          const doneButton = document.querySelector('.driver-popover-next-btn') as HTMLButtonElement
          if (doneButton && doneButton.textContent?.includes('¡Entendido!') && !doneButton.hasAttribute('data-tutorial-listener')) {
            doneButton.setAttribute('data-tutorial-listener', 'true')
            doneButton.addEventListener('click', () => {
              console.log('Botón Entendido clickeado desde onHighlightStarted')
              stopTutorial()
            })
          }
        }, 100)
      },
      onDestroyStarted: () => {
        isTutorialActive.value = false
      },
      onDestroyed: () => {
        isTutorialActive.value = false
        driverInstance.value = null
      },
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Entendido!',
      progressText: '{{current}} de {{total}}',
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.7)',
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: 'driver-popover-custom',
      showButtons: ['next', 'previous', 'close'],
      disableActiveInteraction: false
    })

  // Registrar un listener delegado en el documento para detectar clicks
    // en el botón "¡Entendido!" aunque driver.js re-renderice el popover
    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // If any driver button is clicked, try to detect if it's the final "done" action
      const btn = target.closest('.driver-popover-next-btn, .driver-popover-done-btn, .driver-popover-close-btn') as HTMLElement | null
      if (btn) {
        const txt = (btn.textContent || '').trim().toLowerCase()
        const isCloseBtn = btn.classList.contains('driver-popover-close-btn')
        // Check progress text (e.g. "3 de 6") to know if we're on the last step
        const progressEl = document.querySelector('.driver-popover-progress-text')
        let isLast = false
        if (progressEl && progressEl.textContent) {
          const m = (progressEl.textContent || '').match(/(\d+)\s*[^\d]+\s*(\d+)/)
          if (m) {
            const cur = parseInt(m[1], 10)
            const tot = parseInt(m[2], 10)
            if (!isNaN(cur) && !isNaN(tot) && cur >= tot) isLast = true
          }
        }

        // Conditions to force close:
        // - button text contains 'entendido' OR
        // - progress indicates last step OR
        // - button has attribute data-driver-action="done" (defensive) OR
        // - button is the close button
        const hasDoneAttr = btn.getAttribute('data-driver-action') === 'done'
        if (txt.includes('entendido') || isLast || hasDoneAttr || isCloseBtn) {
          try { e.preventDefault() } catch {}
          try { e.stopPropagation() } catch {}
          console.log('Delegated listener: detected final action or close — closing tutorial', { txt, isLast, hasDoneAttr, isCloseBtn })
          forceStopTutorial()
          try { document.removeEventListener('click', onDocumentClick, true) } catch {}
          try { delete (window as any).__mediart_driver_done_listener } catch {}
          return
        }
      }
    }

  // Exponer el listener globalmente para poder limpiarlo desde stop/forceStop
  ;(window as any).__mediart_driver_done_listener = onDocumentClick
  document.addEventListener('click', onDocumentClick, true)

    // MutationObserver: cuando se cree un popover, buscar y enlazar directamente
    popoverObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue
          if (node.classList && node.classList.contains('driver-popover')) {
            const buttons = Array.from(node.querySelectorAll('button')) as HTMLElement[]
            for (const b of buttons) {
              const txt = (b.textContent || '').trim().toLowerCase()
              const isCloseBtn = b.classList.contains('driver-popover-close-btn')
              if ((txt.includes('entendido') || txt.includes('entender') || isCloseBtn) && !(b as any).__mediart_listener) {
                ;(b as any).__mediart_listener = true
                b.addEventListener('click', (ev) => {
                  try { ev.preventDefault() } catch {}
                  try { ev.stopPropagation() } catch {}
                  console.log('Popover observer: Entendido or Close clicked — closing tutorial')
                  forceStopTutorial()
                })
              }
            }
          }
        }
      }
    })
    popoverObserver.observe(document.body, { childList: true, subtree: true })

    isTutorialActive.value = true
    driverInstance.value.drive()
  }

  const stopTutorial = () => {
    if (driverInstance.value) {
      try {
        driverInstance.value.destroy()
      } catch (error) {
        console.warn('Error destroying driver instance:', error)
      }
      driverInstance.value = null
    }
    isTutorialActive.value = false

    // Limpiar cualquier overlay restante
    const overlays = document.querySelectorAll('.driver-overlay')
    overlays.forEach(overlay => overlay.remove())

    const popovers = document.querySelectorAll('.driver-popover, .driver-popover-custom')
    popovers.forEach(popover => popover.remove())

    // Desconectar observer si está activo
    if (popoverObserver) {
      try { popoverObserver.disconnect() } catch (err) { /* ignore */ }
      popoverObserver = null
    }
  }

  const forceStopTutorial = () => {
    // Forzar la detención limpiando todo manualmente
    isTutorialActive.value = false

    // Destruir la instancia de driver
    if (driverInstance.value) {
      try {
        driverInstance.value.destroy()
      } catch (error) {
        console.warn('Error destroying driver instance:', error)
      }
      driverInstance.value = null
    }

    // Limpiar elementos del DOM
    const overlays = document.querySelectorAll('.driver-overlay, .driver-popover, .driver-popover-custom')
    overlays.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })

    // Desconectar observer si está activo
    if (popoverObserver) {
      try { popoverObserver.disconnect() } catch (err) { /* ignore */ }
      popoverObserver = null
    }

    // Remover clases de resaltado
    const highlightedElements = document.querySelectorAll('.driver-highlighted-element')
    highlightedElements.forEach(element => {
      element.classList.remove('driver-highlighted-element')
    })

    // Remover listener delegado si existe
    try {
      const l = (window as any).__mediart_driver_done_listener as ((e: MouseEvent) => void) | undefined
      if (l) {
        document.removeEventListener('click', l, true)
        delete (window as any).__mediart_driver_done_listener
      }
    } catch (err) {
      /* ignore */
    }
  }

  const resetTutorial = () => {
    stopTutorial()
    setTimeout(() => startTutorial(), 100)
  }

  return {
    isTutorialActive,
    startTutorial,
    stopTutorial,
    resetTutorial,
    forceStopTutorial
  }
}
