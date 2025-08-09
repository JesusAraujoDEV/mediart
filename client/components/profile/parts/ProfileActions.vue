<template>
  <div class="w-full flex flex-col gap-3 sm:gap-4 items-center">
    <button 
      v-if="isOwner" 
      class="w-auto max-w-full px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm sm:text-base hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
      :disabled="loading" 
      @click="$emit('edit-profile')"
    >
      <Icon name="material-symbols:edit" size="24" class="mr-3" />
      Edit Profile
    </button>

    <template v-else>
      <button 
        v-if="!isFriend"
        class="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-sm sm:text-base hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
        :disabled="loading"
        @click="$emit('add-friend')"
      >
        <Icon name="material-symbols:person-add" size="24" class="mr-3" />
        Add Friend
      </button>
      <button 
        v-else 
        class="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-sm sm:text-base hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
        :disabled="loading" 
        @click="$emit('remove-friend')"
      >
        <Icon name="material-symbols:person-remove" size="24" class="mr-3" />
        Remove Friend
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