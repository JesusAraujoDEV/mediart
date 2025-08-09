<template>
  <div class="flex items-center gap-2 bg-white/7.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs text-white/85">
    <component :is="icon" class="h-4 w-4 opacity-80" />
    <span class="uppercase tracking-[0.15em]">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  icon: Object,
  label: String
});
</script>