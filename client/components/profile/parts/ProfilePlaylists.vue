<template>
  <div class="w-full flex flex-col gap-3">
    <h3 class="text-base font-semibold">Playlists</h3>

    <div v-if="!createdPlaylists?.length" class="text-sm text-gray-400">
      No playlists yet.
    </div>

    <ul v-else class="flex flex-col gap-2">
      <li
        v-for="pl in createdPlaylists"
        :key="pl.id"
        class="flex items-center justify-between p-2 rounded border border-white/10"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <Icon name="i-ph:playlist" size="18" class="text-gray-300" />
          <span class="truncate">{{ pl.name }}</span>
        </div>

        <button
          class="text-sm px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50"
          :disabled="savingMap[pl.id]"
          @click="$emit('save-playlist', pl.id)"
        >
          {{ savedPlaylistsIds.includes(pl.id) ? 'Saved' : (savingMap[pl.id] ? 'Saving...' : 'Save') }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
type Id = string | number

defineProps<{
  createdPlaylists: { id: Id; name: string }[]
  savedPlaylistsIds: Id[]
  savingMap: Record<Id, boolean>
  isOwner?: boolean
}>()

defineEmits<{
  (e: 'save-playlist', id: Id): void
}>()
</script>