<template>
  <nav
    class="absolute top-0 left-0 w-fit glassEffect p-2 m-3 rounded-lg flex items-center gap-4"
  >
    <NuxtLink to="/">
      <img
        id="logoNavbar"
        class="icon"
        src="~/assets/mediart/mediartLogo.webp"
        alt="Logo"
      />
    </NuxtLink>
    <NuxtLink to="/studio/profile">
      <img
        class="icon rounded-full"
        src="~/assets/resources/studio/previewProfile.webp"
        alt="Profile Preview"
      />
    </NuxtLink>
  </nav>
</template>

<style scoped>
#logoNavbar {
  filter: brightness(0) invert(1);
}
</style>
