<template>
  <title>MediartStudio | Profile</title>
  <NuxtLayout>
    <main
      class="w-screen h-fit md:h-dvh flex gap-4 justify-center items-center p-10 max-md:my-20 max-md:p-5 max-md:flex-col">
      <NavigationStudio />
      <ProfileComponents :username="usernameFromUrl" />
      <Library />
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Library from "~/components/sections/Library.vue";
import ProfileComponents from "~/components/profile/ProfileComponents.vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

const route = useRoute();
const pathSegments = route.path.split('/').filter(Boolean);
let usernameFromUrl = pathSegments[pathSegments.length - 1];
if (usernameFromUrl === 'profile' || !usernameFromUrl) {
  usernameFromUrl = '';
}

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});
</script>
