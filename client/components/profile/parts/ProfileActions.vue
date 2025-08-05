<template>
  <div class="w-full flex gap-2 justify-center">
    <button v-if="isOwner" class="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
      :disabled="loading" @click="$emit('edit-profile')">
      Edit profile
    </button>

    <template v-else>
      <button v-if="!isFriend"
        class="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50" :disabled="loading"
        @click="$emit('add-friend')">
        Add friend
      </button>
      <button v-else class="px-3 py-2 rounded bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-50"
        :disabled="loading" @click="$emit('remove-friend')">
        Remove friend
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOwner?: boolean
  isFriend?: boolean
  loading?: boolean
}>()

defineEmits<{
  (e: 'add-friend'): void
  (e: 'remove-friend'): void
  (e: 'edit-profile'): void
}>()
</script>