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
      href="~/assets/mediart/favicon.ico"
      type="image/x-icon"
    />
  </head>
  <div
    id="layout"
    class="w-full h-fit text-white font-[Raleway] overflow-hidden relative"
  >
    <slot />
    <img
      class="absolute -left-30 top-1/7 max-md:w-1/3 w-1/3 rotate-12 floating-object"
      src="~/assets/resources/backgroundHeadset.webp"
      alt="hand"
    />
    <img
      class="absolute right-0 top-1/7 max-md:w-1/3 w-1/4 floating-object"
      src="~/assets/resources/backgroundHand.webp"
      alt="hand"
    />
    <img
      class="absolute right-45 -bottom-30 max-md:w-1/3 w-1/7 -rotate-45 floating-object"
      src="~/assets/resources/backgroundBook.webp"
      alt="Book"
    />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Sail&display=swap");
@import "../styles/float.css";

#layout {
  background: url("~/assets/layout/backgroundNeat.webp") no-repeat center center
    fixed;
  background-size: cover;
}

.glassEffect {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffffff20;
}
</style>
