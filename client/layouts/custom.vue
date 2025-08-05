<template>

  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Mediart - Your Art-ssistant" />
    <meta name="keywords" content="mediart, art, assistant, ai, artificial intelligence" />
    <meta name="author" content="Mediart Team" />
    <meta name="robots" content="index, follow" />
    <meta name="google-site-verification" content="your-google-site-verification-code" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
  </head>
  <div id="layout" class="w-full h-fit text-white font-[Raleway] overflow-hidden relative">
    <div class="animated-bg"></div>
    <div class="floating-particles"></div>
    <slot />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Sail&display=swap");

#layout {
  position: relative;
}

.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/layout/backgroundNeat.webp") no-repeat center center;
  background-size: cover;
  z-index: -2;
  animation: dynamicZoom 12s ease-in-out infinite;
}

@keyframes dynamicZoom {

  0%,
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) contrast(1);
  }

  25% {
    transform: scale(1.05) rotate(0.5deg);
    filter: brightness(1.1) contrast(1.1);
  }

  50% {
    transform: scale(1.1) rotate(0deg);
    filter: brightness(1.05) contrast(1.05);
  }

  75% {
    transform: scale(1.05) rotate(-0.5deg);
    filter: brightness(1.1) contrast(1.1);
  }
}

.floating-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.floating-particles::before,
.floating-particles::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

.floating-particles::before {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-particles::after {
  top: 60%;
  right: 15%;
  animation-delay: 4s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.3;
  }

  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.6;
  }
}

.glassEffect {
  backdrop-filter: blur(30px);
  background-color: rgba(255, 255, 255, 0.127);
  border: 1px solid #ffffff20;
  animation: dynamicBlur 8s ease-in-out infinite;
}

@keyframes dynamicBlur {

  0%,
  100% {
    backdrop-filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.12);
  }

  25% {
    backdrop-filter: blur(35px);
    background-color: rgba(255, 255, 255, 0.15);
  }

  50% {
    backdrop-filter: blur(30px);
    background-color: rgba(255, 255, 255, 0.13);
  }

  75% {
    backdrop-filter: blur(40px);
    background-color: rgba(255, 255, 255, 0.16);
  }
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
