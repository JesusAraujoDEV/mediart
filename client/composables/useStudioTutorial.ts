import { ref, nextTick } from 'vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { Driver, DriveStep } from 'driver.js'

export function useStudioTutorial() {
  const isTutorialActive = ref(false)
  const driverInstance = ref<Driver | null>(null)
  let popoverObserver: MutationObserver | null = null

  const startTutorial = async () => {
    await nextTick()

    const steps: DriveStep[] = [
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
        // - button has attribute data-driver-action="done" (defensive)
        const hasDoneAttr = btn.getAttribute('data-driver-action') === 'done'
        if (txt.includes('entendido') || isLast || hasDoneAttr) {
          try { e.preventDefault() } catch {}
          try { e.stopPropagation() } catch {}
          console.log('Delegated listener: detected final action — closing tutorial', { txt, isLast, hasDoneAttr })
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
              if ((txt.includes('entendido') || txt.includes('entender')) && !(b as any).__mediart_listener) {
                ;(b as any).__mediart_listener = true
                b.addEventListener('click', (ev) => {
                  try { ev.preventDefault() } catch {}
                  try { ev.stopPropagation() } catch {}
                  console.log('Popover observer: Entendido clicked — closing tutorial')
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

    const popovers = document.querySelectorAll('.driver-popover')
    popovers.forEach(popover => popover.remove())
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
