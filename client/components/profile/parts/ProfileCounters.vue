<template>
  <div class="w-full flex items-center justify-around gap-4">
    <button class="flex flex-col items-center hover:opacity-80 transition disabled:opacity-50" :disabled="disabled"
      @click="$emit('go-following')">
      <span class="text-lg font-semibold">{{ followingCount }}</span>
      <span class="text-xs text-gray-400">Following</span>
    </button>
    <button class="flex flex-col items-center hover:opacity-80 transition disabled:opacity-50" :disabled="disabled"
      @click="$emit('go-followers')">
      <span class="text-lg font-semibold">{{ followersCount }}</span>
      <span class="text-xs text-gray-400">Followers</span>
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