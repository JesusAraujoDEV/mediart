<template>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Mediart - Your Art-ssistant" />
    <meta
      name="keywords"
      content="mediart, art, assistant, ai, artificial intelligence"
    />
    <meta name="author" content="Mediart Team" />
    <meta name="robots" content="index, follow" />
    <meta
      name="google-site-verification"
      content="your-google-site-verification-code"
    />
    <link
      rel="shortcut icon"
      href="/favicon.ico"
      type="image/x-icon"
    />
  </head>
  <div
    id="layout"
    class="w-full h-fit text-white font-[Raleway] overflow-hidden relative"
  >
    <slot />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Sail&display=swap");

#layout {
  background: url("/layout/backgroundNeat.webp") no-repeat center center
    fixed;
  background-size: cover;
}

.glassEffect {
  backdrop-filter: blur(30px);
  background-color: rgba(255, 255, 255, 0.127);
  border: 1px solid #ffffff20;
}

.icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.icon:active {
  transform: scale(0.95);
}

/* Mejorar la experiencia en móvil */
@media (max-width: 768px) {
  #layout {
    min-height: 100vh;
  }
}

</style>
