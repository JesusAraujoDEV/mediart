import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useReducedMotion() {
  const reduced = ref(false)
  let mql: MediaQueryList | null = null

  const update = () => {
    reduced.value = !!mql?.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mql.addEventListener?.('change', update)
  })

  onBeforeUnmount(() => {
    try { mql?.removeEventListener?.('change', update) } catch {}
  })

  return { reduced }
}
