<template>
  <section
    aria-labelledby="why-mediart-title"
    class="relative w-full py-16 md:py-24 overflow-hidden"
    :style="animatedBackgroundStyle"
  >
    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-10 md:mb-14">
        <div class="mb-4 flex items-center gap-2">
          <span
            class="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]"
            :style="{
              background: hexA(colors.accent, 0.18),
              color: hexA('#ffffff', 0.9),
              border: `1px solid ${hexA(colors.accent, 0.28)}`,
            }"
          >
            ¿POR QUÉ ELEGIRNOS?
          </span>
        </div>
        <h2
          id="why-mediart-title"
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] text-white"
        >
          ¿Por qué Mediart es la elección perfecta para ti?
        </h2>
        <p class="mt-4 max-w-2xl text-sm sm:text-base text-white/80">
          Descubre lo que nos hace únicos y eleva tu experiencia creativa.
        </p>
      </header>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <!-- Card 2 -->
        <article class="feature-card" :style="cardStyle">
          <div class="feature-card-inner">
            <div class="icon">
              <SparklesIcon class="h-5 w-5" :style="{ color: hexA('#ffffff', 0.85) }" />
            </div>
            <h3 class="feature-title">Recomendaciones a tu medida</h3>
            <p class="feature-desc">
              Genera listas de recomendaciones personalizadas. Introduce un gusto (película, canción o libro) y elige en base a qué quieres que se genere esa lista.
            </p>
          </div>
        </article>
        <!-- Card 3 -->
        <article class="feature-card" :style="cardStyle">
          <div class="feature-card-inner">
            <div class="icon">
              <ListMusicIcon class="h-5 w-5" :style="{ color: hexA('#ffffff', 0.85) }" />
            </div>
            <h3 class="feature-title">Playlists Colaborativas y Privadas</h3>
            <p class="feature-desc">
              Crea playlists privadas para guardar tus favoritos o únete a playlists colaborativas para explorar nuevos horizontes de gusto junto a otros usuarios.
            </p>
          </div>
        </article>
        <!-- CTA Card (destacada) -->
        <!-- La clase 'order-last' lo mueve al final en móvil, 'md:order-none' revierte el orden en desktop -->
        <aside class="cta-card lg:row-span-2 lg:col-start-3 order-last md:order-none">
          <div class="cta-surface" :style="ctaSurfaceStyle" />
          <div class="cta-content">
            <div class="icon-cta">
              <LibraryIcon class="h-5 w-5" :style="{ color: '#ffffff' }" />
            </div>
            <h3 class="cta-title">Crea sin límites, sin costo.</h3>
            <p class="cta-desc">
              Mediart es una plataforma completamente gratuita, diseñada para que tu creatividad y conexión con la comunidad artística sean tu única prioridad.
            </p>
            <a
              href="/register"
              class="cta-button"
              :style="{
                background: `linear-gradient(90deg, ${hexA(colors.accent,0.85)}, ${hexA(colors.accent,0.75)})`,
                boxShadow: `0 10px 24px ${hexA(colors.accent,0.35)}`,
              }"
            >
              Empieza ahora gratis
              <ArrowRightIcon class="h-4 w-4 ml-2" />
            </a>
          </div>
        </aside>

        <!-- Card 1 -->
        <article class="feature-card" :style="cardStyle">
          <div class="feature-card-inner">
            <div class="icon">
              <UsersIcon class="h-5 w-5" :style="{ color: hexA('#ffffff', 0.85) }" />
            </div>
            <h3 class="feature-title">Comunidad inspiradora</h3>
            <p class="feature-desc">
              Conéctate con una red de creadores apasionados. Puedes seguir a otros usuarios para descubrir nuevos gustos y ser seguido para compartir tu perspectiva única.
            </p>
          </div>
        </article>

        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Users as UsersIcon,
  Sparkles as SparklesIcon,
  ListMusic as ListMusicIcon,
  Library as LibraryIcon,
  ArrowRight as ArrowRightIcon,
} from 'lucide-vue-next'

/**
 * Paleta Mediart (adaptada a la sección)
 * - cardBase: único color para todas las tarjetas
 * - accent: para acentos (badge, botón CTA)
 * - blue/red: para el gradiente del panel CTA
 */
const colors = {
  cardBase: '#022834',
  accent: '#16a696',
  blue: '#1c6abd',
  red: '#e01e2f',
}

// rgba helper
function hexA(hex: string, alpha = 1) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// --- Dynamic Styles ---
const animatedBackgroundStyle = computed(() => ({
  '--bg-color-1': hexA(colors.blue, 0.6),
  '--bg-color-2': hexA(colors.red, 0.6),
  '--bg-color-3': hexA(colors.accent, 0.65),
}));

// Feature card surface (mismo color en todas)
const cardStyle = {
  background: colors.cardBase,
  border: `1px solid ${hexA(colors.accent, 0.18)}`,
}
const ctaSurfaceStyle = {
  backgroundImage: `
    radial-gradient(120% 100% at 20% 20%, ${hexA('#ffffff',0.16)}, transparent 60%),
    linear-gradient(135deg, ${hexA(colors.blue,0.92)} 0%, ${hexA(colors.red,0.9)} 100%)
  `,
}
</script>

<style scoped>
section {
  background-color: #02070d;
  background-image:
    radial-gradient(at 20% 10%, var(--bg-color-1) 0px, transparent 50%),
    radial-gradient(at 80% 15%, var(--bg-color-2) 0px, transparent 50%),
    radial-gradient(at 50% 90%, var(--bg-color-3) 0px, transparent 50%);
  background-size: 200% 200%;
  animation: moveGradient 15s ease infinite;
}

@keyframes moveGradient {
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
}

/* Cards base */
.feature-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid transparent;
  transition: transform .2s ease, box-shadow .2s ease;
  box-shadow: 0 10px 30px -20px rgba(0, 0, 0, .6);
}
.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px -20px rgba(0, 0, 0, .7);
}
.feature-card-inner {
  padding: 22px;
  color: #e8f1f2;
}
.icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 12px;
}
.feature-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 8px;
}
.feature-desc {
  font-size: .95rem;
  line-height: 1.5;
  color: rgba(255,255,255,.78);
}

/* CTA */
.cta-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  grid-column: span 1 / span 1;
  display: grid;
}
@media (min-width: 1024px) {
  .cta-card {
    grid-column: span 1 / span 1;
  }
}
.cta-surface {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.cta-content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 24px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.22));
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 16px;
  backdrop-filter: blur(4px);
}
.icon-cta {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.16);
}
.cta-title {
  font-weight: 800;
  font-size: 1.25rem;
}
.cta-desc {
  color: rgba(255,255,255,.86);
  line-height: 1.55;
  font-size: .98rem;
}
.cta-button {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  font-weight: 700;
  color: #ffffff;
  padding: .75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.14);
  transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
}
.cta-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px -12px rgba(22,166,150,.4);
}
</style>
