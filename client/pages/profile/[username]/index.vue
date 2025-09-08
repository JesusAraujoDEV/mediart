<template>
  <title>{{ pageTitle }}</title>
  <NuxtLayout>
    <main
      class="w-screen h-fit md:h-dvh flex gap-4 justify-center md:items-stretch items-center p-10 max-md:my-20 max-md:p-5 max-md:flex-col">
      <NavigationStudio />
      <div class="flex flex-col md:flex-row w-full max-w-6xl gap-4 items-stretch">
        <ProfileComponents :username="usernameFromUrl" />
        <Library />
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import Library from "~/components/sections/Library.vue";
import ProfileComponents from "~/components/profile/ProfileComponents.vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import { useProfile } from '~/composables/useProfile';

const route = useRoute();
const pathSegments = route.path.split('/').filter(Boolean);
let usernameFromUrl = pathSegments[pathSegments.length - 1];
if (usernameFromUrl === 'profile' || !usernameFromUrl) {
  usernameFromUrl = '';
}

// Usar el composable useProfile para obtener la información del usuario
const { userProfile, fetchProfileByUsername, isLoading } = useProfile();

// Título de página reactivo
const pageTitle = computed(() => {
  if (isLoading.value) {
    return 'MediartStudio | Cargando...';
  }
  const username = userProfile.value?.username || usernameFromUrl || 'Perfil';
  return `MediartStudio | ${username}`;
});

// Cargar el perfil cuando se monte el componente
onMounted(async () => {
  if (usernameFromUrl) {
    await fetchProfileByUsername(usernameFromUrl);
  }
});

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});
</script>
