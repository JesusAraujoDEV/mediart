<template>
  <section
    aria-labelledby="testimonials-collage-title"
    class="relative w-full min-h-screen overflow-hidden py-16 md:py-24 isolate"
  >
    <div class="absolute inset-0 -z-10">
      <img
        src="../../public/landingImages/backgroundCommunity.png"
        alt=""
        class="h-full w-full object-cover opacity-90"
      />
    </div>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header class="mb-10 md:mb-14" id="comunidad-title">
        <div class="mb-4 flex items-center gap-2">
          <span
            class="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]"
            :style="{
              background: hexA(colors.accent, 0.18),
              color: hexA('#ffffff', 0.9),
              border: `1px solid ${hexA(colors.accent, 0.28)}`,
            }"
          >
            COMUNIDAD
          </span>
        </div>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <!-- Left: Heading -->
        <div>
          <h2
            class="mt-4 text-3xl sm:text-2xl md:text-5xl font-extrabold text-white/95 leading-tight uppercase tracking-tight"
          >
            Lo que la comunidad dice de Mediart
          </h2>
          <p class="mt-3 text-white/75 text-sm sm:text-base max-w-2xl">
            Historias reales de usuarios que descubren nuevas obsesiones artísticas y comparten su
            perspectiva con el mundo.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a
              href="/testimonials"
              class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-white text-sm font-semibold shadow-sm transition hover:shadow-md hover:bg-neutral-800"
            >
              Ver casos de éxito
            </a>
            <a
              href="/testimonials"
              class="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-neutral-900 text-sm font-semibold shadow-sm transition hover:bg-neutral-50"
            >
              Más testimonios
            </a>
          </div>

          <!-- Feature row -->
          <div class="mt-10 grid grid-cols-3 gap-6 text-center">
            <div class="text-sm text-neutral-100">
              <div
                class="mx-auto mb-2 h-9 w-9 rounded-full bg-white/10 ring-1 ring-white/20 text-white/90 flex items-center justify-center"
              >
                <Check class="h-5 w-5" />
              </div>
              Satisfacción 100%
            </div>
            <div class="text-sm text-neutral-100">
              <div
                class="mx-auto mb-2 h-9 w-9 rounded-full bg-white/10 ring-1 ring-white/20 text-white/90 flex items-center justify-center"
              >
                <Telescope class="h-5 w-5" />
              </div>
              Descubrimientos semanales
            </div>
            <div class="text-sm text-neutral-100">
              <div
                class="mx-auto mb-2 h-9 w-9 rounded-full bg-white/10 ring-1 ring-white/20 text-white/90 flex items-center justify-center"
              >
                <Users class="h-5 w-5" />
              </div>
              Comunidad activa
            </div>
          </div>
        </div>

        <!-- Right: Collage -->
        <div
          class="relative mt-10 lg:mt-0 h-[500px] sm:h-[600px] flex items-center justify-center"
        >
          <div class="relative w-full h-full">
            <!-- Image 1 + Chip 1 -->
            <div
              class="absolute z-10 w-[220px] h-[330px] sm:w-[250px] sm:h-[375px] top-0 left-0"
            >
              <div
                class="absolute inset-0 bg-neutral-200 rounded-t-full rounded-b-[4rem] overflow-hidden shadow-lg ring-1 ring-black/5"
              >
                <img
                  src="../../public/landingImages/UserMediart1.jpeg"
                  alt="Testimonio de un usuario de Mediart"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="absolute top-8 left-full -translate-x-1/8">
                <div class="chip">
                  <span class="chip-quote">“</span>
                  Mis expectativas fueron superadas
                  <span class="chip-quote">”</span>
                </div>
              </div>
            </div>

            <!-- Image 2 + Chip 2 -->
            <div
              class="absolute z-20 w-[220px] h-[330px] sm:w-[250px] sm:h-[375px] top-1/4 left-1/2 -translate-x-1/2"
            >
              <div
                class="absolute inset-0 rounded-t-full rounded-b-[4rem] overflow-hidden shadow-xl ring-1 ring-black/5 flex"
              >
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
                  alt="Otro testimonio de un usuario de Mediart"
                  class="h-full object-cover object-center"
                />
              </div>
              <div class="absolute bottom-1/4 -left-1/2 z-30">
                <div class="chip">
                  <span class="chip-quote">“</span>
                  Diseños de Edición Limitada
                  <span class="chip-quote">”</span>
                </div>
              </div>
            </div>

            <!-- Image 3 + Chip 3 -->
            <div
              class="absolute z-30 w-[220px] h-[330px] sm:w-[250px] sm:h-[375px] bottom-0 right-0"
            >
              <div
                class="absolute inset-0 bg-neutral-200 rounded-t-full rounded-b-[4rem] overflow-hidden shadow-lg ring-1 ring-black/5"
              >
                <img
                  src="../../public/landingImages/UserMediart2.jpeg"
                  alt="Tercer testimonio de un usuario de Mediart"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="absolute bottom-0 right-full translate-x-1/2 z-30">
                <div class="chip">
                  <span class="chip-quote">“</span>
                  Guau
                  <span class="chip-quote">”</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, Telescope, Users } from 'lucide-vue-next';

const colors = {
  cardBase: '#022834',
  accent: '#16a696',
  blue: '#1c6abd',
  red: '#e01e2f',
}

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
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #0a0a0a;
  border: 1px solid #e7e7e7;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.chip-quote {
  font-weight: 900;
  color: #2eb2ff;
  line-height: 1;
  font-size: 20px;
}
</style>
