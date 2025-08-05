<template>
  <title>MediartStudio - {{ currentContent.pageTitle }}</title>
  <main class="w-screen h-dvh flex flex-col items-center justify-start p-4 text-white">
    <NavigationStudio />

    <div class="w-full flex justify-end p-4 z-10">
      <button @click="toggleLanguage"
        class="glassEffect px-4 cursor-pointer py-2 rounded-full text-sm font-semibold transition-colors duration-200"
        :class="{
          'bg-blue-600 hover:bg-blue-700': currentLanguage === 'en',
          'bg-purple-600 hover:bg-purple-700': currentLanguage === 'es',
        }">
        {{ currentLanguage === "en" ? "Español" : "English" }}
      </button>
    </div>

    <div
      class="glassEffect w-3/4 max-md:w-full max-h-[90vh] overflow-y-auto bg-gray-800 bg-opacity-50 rounded-lg p-8 shadow-xl">
      <h1 class="text-3xl font-bold mb-6 text-center">
        {{ currentContent.title }}
      </h1>
      <p class="text-lg mb-8 text-center">{{ currentContent.intro }}</p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        {{ currentContent.step1.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step1.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step1.strong1 }}</strong>. {{ currentContent.step1.paragraph2 }}
        <strong class="text-blue-300">{{ currentContent.step1.strong2 }}</strong>. {{ currentContent.step1.paragraph3 }}
        <strong class="text-blue-300">{{
          currentContent.step1.strong3
          }}</strong>
        {{ currentContent.step1.paragraph4 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        {{ currentContent.step2.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step2.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step2.strong1 }}</strong>. {{ currentContent.step2.paragraph2 }}
        <strong class="text-blue-300">{{ currentContent.step2.strong2 }}</strong>. {{ currentContent.step2.paragraph3 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        {{ currentContent.step3.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step3.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step3.strong1 }}</strong>. {{ currentContent.step3.paragraph2 }}
      </p>
      <ul class="list-disc list-inside ml-4 mb-6">
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list1Strong }}:</strong>
          {{ currentContent.step3.listItem1 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list2Strong }}:</strong>
          {{ currentContent.step3.listItem2 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list3Strong }}:</strong>
          {{ currentContent.step3.listItem3 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list4Strong }}:</strong>
          {{ currentContent.step3.listItem4 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list5Strong }}:</strong>
          {{ currentContent.step3.listItem5 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list6Strong }}:</strong>
          {{ currentContent.step3.listItem6 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list7Strong }}:</strong>
          {{ currentContent.step3.listItem7 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list8Strong }}:</strong>
          {{ currentContent.step3.listItem8 }}
        </li>
      </ul>
      <p class="mb-6">
        {{ currentContent.step3.paragraph3 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        {{ currentContent.step4.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step4.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step4.strong1 }}</strong>. {{ currentContent.step4.paragraph2 }}
        <strong class="text-blue-300">{{
          currentContent.step4.strong2
          }}</strong>
        {{ currentContent.step4.paragraph3 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        {{ currentContent.step5.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step5.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step5.strong1 }}</strong>.
      </p>
      <ul class="list-disc list-inside ml-4 mb-6">
        <li>
          {{ currentContent.step5.listItem1 }}
          <strong class="text-blue-300">{{
            currentContent.step5.listStrong1
            }}</strong>.
        </li>
        <li>
          {{ currentContent.step5.listItem2 }}
          <strong class="text-blue-300">{{
            currentContent.step5.listStrong2
            }}</strong>
          {{ currentContent.step5.listItem3 }}
        </li>
      </ul>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        {{ currentContent.step6.heading }}
      </h2>
      <p class="mb-8">
        {{ currentContent.step6.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step6.strong1 }}</strong>. {{ currentContent.step6.paragraph2 }}
        <strong class="text-blue-300">{{
          currentContent.step6.strong2
          }}</strong>
        {{ currentContent.step6.paragraph3 }}
      </p>

      <p class="text-lg font-bold text-center">
        {{ currentContent.outro }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import { useHelpContent } from "~/composables/studio/useHelpContent";

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

// Consumimos el composable para obtener el estado y las funciones
const { currentLanguage, toggleLanguage, currentContent } = useHelpContent();
</script>

<style scoped>
/* Estilos del scrollbar */
.glassEffect::-webkit-scrollbar {
  width: 8px;
}

.glassEffect::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.glassEffect::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.glassEffect::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>