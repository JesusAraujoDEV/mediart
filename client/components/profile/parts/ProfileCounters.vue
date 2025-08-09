<template>
  <div class="w-full flex items-center justify-center gap-6 sm:gap-10 py-6 sm:py-8">
    <button 
      class="flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group" 
      :disabled="disabled"
      @click="$emit('go-following')"
    >
      <span class="text-3xl sm:text-4xl font-bold text-white group-hover:text-purple-300 transition-colors">{{ followingCount }}</span>
      <span class="text-xs sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">Following</span>
    </button>
    <div class="w-px h-12 sm:h-16 bg-gray-600"></div>
    <button 
      class="flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group" 
      :disabled="disabled"
      @click="$emit('go-followers')"
    >
      <span class="text-3xl sm:text-4xl font-bold text-white group-hover:text-purple-300 transition-colors">{{ followersCount }}</span>
      <span class="text-xs sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">Followers</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  followingCount: number
  followersCount: number
  disabled?: boolean
}>()

defineEmits<{
  (e: 'go-following'): void
  (e: 'go-followers'): void
}>()
</script>