<template>
  <section class="relative w-full py-13 md:py-5">
    <div class="mx-1 md:mx-1 lg:mx-6">
      <div class="relative overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl lg:mr-5">
        <div class="absolute inset-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yOtoUWoBJy2l66eG0FF748BQWPLKEz.png"
            alt="Fondo degradado CTA"
            class="w-full h-full object-cover"
          />
        </div>

        <div
          class="pointer-events-none absolute -top-24 -left-20 h-[340px] w-[120%] rotate-6 rounded-[999px]"
          :style="{
            background: 'radial-gradient(70% 120% at 50% 0%, rgba(255,180,72,0.45) 0%, rgba(255,140,0,0.25) 55%, rgba(255,140,0,0) 70%)',
            boxShadow: '0 0 80px rgba(255,170,60,0.25)',
          }"
        ></div>
        <div
          class="pointer-events-none absolute -top-10 -right-10 h-[260px] w-[60%] -rotate-6 rounded-[999px]"
          :style="{
            background: 'radial-gradient(70% 120% at 50% 0%, rgba(255,210,120,0.35) 0%, rgba(255,160,64,0.2) 60%, rgba(255,160,64,0) 75%)',
          }"
        ></div>

        <div class="absolute inset-0 bg-black/10"></div>

        <!-- Content -->
        <div class="relative z-10 text-center px-6 py-14 sm:py-20">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white/95">
            ¿Listo para descubrir tu próxima obra favorita?
          </h2>
          <p class="mt-4 text-white/85 max-w-2xl mx-auto text-sm sm:text-base">
            Mediart te recomienda música, películas, juegos y libros a tu medida. Empieza gratis y crea colecciones únicas.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/register" class="w-full sm:w-auto rounded-full bg-white text-black hover:bg-white/90 px-6 py-3 font-medium transition-colors">
              Crear cuenta
            </a>
            <a href="/about-us" class="w-full sm:w-auto rounded-full bg-white/15 text-white border border-white/30 hover:bg-white/25 px-6 py-3 font-medium transition-colors">
              Saber más
            </a>
          </div>
        </div>

        <div class="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/20"></div>
      </div>
    </div>
  </section>
</template>