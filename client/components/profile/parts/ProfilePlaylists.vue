<template>
  <div class="w-full flex flex-col gap-3 sm:gap-4">
    <!-- Encabezado de la sección de playlists -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm sm:text-base font-bold text-white">My Playlists</h3>
    </div>

    <p class="text-xs text-gray-400 text-center px-3" aria-live="polite">
      Your saved playlists will appear here.
    </p>

    <!-- Lista de playlists -->
    <div v-if="createdPlaylists?.length" class="space-y-3">
      <div 
        v-for="pl in createdPlaylists" 
        :key="pl.id"
        class="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group"
      >
        <div class="flex items-center gap-3 overflow-hidden flex-1">
          <Icon name="i-ph:playlist" size="20" class="text-purple-400 flex-shrink-0" />
          <span class="truncate text-white font-medium text-sm sm:text-base">{{ pl.name }}</span>
        </div>

        <button 
          class="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="savedPlaylistsIds.includes(pl.id) 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'"
          :disabled="savingMap[pl.id]" 
          @click="$emit('save-playlist', pl.id)"
        >
          {{ savedPlaylistsIds.includes(pl.id) ? 'Saved' : (savingMap[pl.id] ? 'Saving...' : 'Save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

type Id = string | number

const props = defineProps<{
  createdPlaylists: { id: Id; name: string }[]
  savedPlaylistsIds: Id[]
  savingMap: Record<Id, boolean>
  isOwner?: boolean
}>()

const emit = defineEmits<{
  (e: 'save-playlist', id: Id): void
}>()
</script>

<style scoped>
/* Estilos mínimos necesarios */
</style>