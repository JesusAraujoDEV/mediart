<template>
  <title>MediartStudio | Profile</title>
  <NuxtLayout>
    <NuxtPage />
    <main
      class="w-screen h-fit md:h-dvh flex gap-4 justify-center items-center p-10 max-md:my-20 max-md:p-5 max-md:flex-col"
    >
      <NavigationStudio />
      <Profile />
      <Library />
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">


definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

import Library from "~/components/sections/Library.vue";
import Profile from "~/components/sections/Profile.vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
</script>
