<template>
  <button 
    class="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-full backdrop-blur-sm hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-all duration-300"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits(['click']);
</script>