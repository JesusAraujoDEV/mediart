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
  <div id="layout" class="w-full h-fit">
    <slot />
  </div>
</template>

<style>
#layout {
  background: url("~/assets/layout/backgroundNeat.webp") no-repeat center center
    fixed;
  background-size: cover;
}
</style>
