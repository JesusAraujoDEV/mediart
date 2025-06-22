<template>
  <nav
    class="absolute top-0 left-0 w-fit z-40 glassEffect p-2 m-3 rounded-lg flex items-center gap-4"
  >
    <NuxtLink class="flex items-center justify-center" to="/studio">
      <img
        id="logoNavbar"
        class="icon"
        src="/mediart/mediartLogo.webp"
        alt="Logo"
      />
    </NuxtLink>
    <NuxtLink class="flex items-center justify-center" :to="`/profile/${actualUser ? actualUser : 'anonymous'}`">
      <img
        class="icon rounded-full"
        src="/resources/studio/previewProfile.webp"
        alt="Profile Preview"
      />
    </NuxtLink>
    <NuxtLink class="flex items-center cursor-pointer" :to="`/studio/help`">
      <Icon name="material-symbols:help" size="2em" />
    </NuxtLink>
    <NuxtLink class="flex items-center cursor-pointer" :to="`/studio/search`">
      <Icon name="material-symbols:search" size="2em" />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const userString = localStorage.getItem("user");
const actualUser = userString ? JSON.parse(userString).username : null;
</script>

<style scoped>
#logoNavbar {
  filter: brightness(0) invert(1);
}
</style>
