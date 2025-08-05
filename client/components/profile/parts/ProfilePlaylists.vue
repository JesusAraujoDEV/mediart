<template>
  <div class="w-full flex flex-col gap-3">
    <!-- Encabezado de la sección de playlists guardadas -->
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold">Mis playlists guardadas</h3>
      <!-- Botón dentro del propio encabezado de playlists guardadas (sólo dueño) -->
      <button v-if="isOwner" id="createPlaylistBtn"
        class="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full bg-purple-600 hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
        :aria-label="'Crear playlist desde cero'" :title="'Crear playlist desde cero'" @click="openCreateModal">
        <Icon name="material-symbols:queue-music" size="18" />
        <span>Crear playlist</span>
      </button>
    </div>

    <p class="text-xs text-gray-400" aria-live="polite">
      Crea una playlist vacía y añade ítems con el buscador.
    </p>

    <div v-if="!createdPlaylists?.length" class="text-sm text-gray-400">
      No playlists yet.
    </div>

    <ul v-else class="flex flex-col gap-2">
      <li v-for="pl in createdPlaylists" :key="pl.id"
        class="flex items-center justify-between p-2 rounded border border-white/10">
        <div class="flex items-center gap-3 overflow-hidden">
          <Icon name="i-ph:playlist" size="18" class="text-gray-300" />
          <span class="truncate">{{ pl.name }}</span>
        </div>

        <button class="text-sm px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50"
          :disabled="savingMap[pl.id]" @click="$emit('save-playlist', pl.id)">
          {{ savedPlaylistsIds.includes(pl.id) ? 'Saved' : (savingMap[pl.id] ? 'Saving...' : 'Save') }}
        </button>
      </li>
    </ul>

    <!-- Modal de creación + buscador de ítems, permanece DENTRO de la sección de playlists guardadas -->
    <Teleport to="body">
      <transition name="fade" appear>
        <div v-if="showCreate" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true"
          role="dialog" aria-labelledby="createPlaylistTitle">
          <div class="absolute inset-0 bg-black/70" @click="onCancel"></div>

          <div
            class="relative w-full max-w-3xl rounded-lg border border-gray-700 bg-gray-800/90 p-6 shadow-2xl glassEffect">
            <h3 id="createPlaylistTitle" class="mb-2 text-center text-2xl font-bold text-white">
              Crear playlist desde cero
            </h3>
            <p class="mb-4 text-center text-gray-300 text-sm">
              Completa los datos, busca ítems y crea tu playlist.
            </p>

            <!-- Formulario metadatos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="plName" class="block text-sm font-semibold text-gray-200">Nombre*</label>
                <input id="plName" type="text" v-model.trim="form.name" :aria-invalid="!!nameError"
                  :aria-describedby="nameError ? 'nameErr' : undefined"
                  class="mt-1 w-full rounded border border-gray-600 bg-gray-700/70 py-2 px-3 text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej. Mis Favoritos" />
                <p v-if="nameError" id="nameErr" class="mt-1 text-xs text-red-400">{{ nameError }}</p>
              </div>

              <div>
                <label for="plVisibility" class="block text-sm font-semibold text-gray-200">Visibilidad</label>
                <div id="plVisibility" role="radiogroup" class="mt-1 flex items-center gap-3">
                  <label class="inline-flex items-center gap-2">
                    <input type="radio" class="accent-purple-500" value="PUBLIC" v-model="form.visibility" />
                    <span class="text-sm text-gray-200">Pública</span>
                  </label>
                  <label class="inline-flex items-center gap-2">
                    <input type="radio" class="accent-purple-500" value="PRIVATE" v-model="form.visibility" />
                    <span class="text-sm text-gray-200">Privada</span>
                  </label>
                </div>
              </div>

              <div class="md:col-span-2">
                <label for="plDesc" class="block text-sm font-semibold text-gray-200">Descripción</label>
                <textarea id="plDesc" rows="2" v-model="form.description"
                  class="mt-1 w-full rounded border border-gray-600 bg-gray-700/70 py-2 px-3 text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe tu playlist (opcional)" />
              </div>
            </div>

            <!-- Buscador y filtros -->
            <div class="mb-3">
              <div class="flex flex-col md:flex-row md:items-center gap-3">
                <div class="relative flex-1">
                  <input id="searchInput" type="text" v-model.trim="searchQuery" @input="onSearchInput"
                    class="w-full rounded border border-gray-600 bg-gray-700/70 py-2 pl-10 pr-3 text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Buscar ítems (canciones, álbumes, artistas, podcasts)" aria-label="Buscar ítems" />
                  <Icon name="material-symbols:search" size="18" class="absolute left-3 top-2.5 text-gray-400" />
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <select v-model="filters.type"
                    class="rounded bg-gray-700/70 border border-gray-600 px-2 py-2 text-sm">
                    <option value="">Todos</option>
                    <option value="track">Canciones</option>
                    <option value="album">Álbumes</option>
                    <option value="artist">Artistas</option>
                    <option value="podcast">Podcasts</option>
                    <option value="episode">Episodios</option>
                  </select>

                  <select v-model="filters.genre"
                    class="rounded bg-gray-700/70 border border-gray-600 px-2 py-2 text-sm">
                    <option value="">Género</option>
                    <option value="rock">Rock</option>
                    <option value="pop">Pop</option>
                    <option value="hiphop">Hip-Hop</option>
                    <option value="jazz">Jazz</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Resultados + pendientes -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="rounded border border-white/10 p-2">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-semibold">Resultados</h4>
                  <span class="text-xs text-gray-400">{{ results.length }} ítems</span>
                </div>
                <div class="h-64 overflow-auto space-y-2">
                  <div v-for="it in results" :key="it.id"
                    class="flex items-center justify-between rounded bg-gray-700/40 px-2 py-2">
                    <div class="flex items-center gap-2 overflow-hidden">
                      <div class="size-8 rounded bg-gray-600/50"></div>
                      <div class="truncate">
                        <div class="text-sm font-medium truncate">{{ it.title }}</div>
                        <div class="text-xs text-gray-400 truncate">{{ it.author }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="text-xs rounded bg-purple-600 hover:bg-purple-700 px-2 py-1"
                        @click="addPending(it)">
                        Agregar
                      </button>
                      <button class="text-xs rounded bg-gray-600 hover:bg-gray-700 px-2 py-1">Preview</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded border border-white/10 p-2">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-semibold">Pendientes ({{ pending.length }})</h4>
                  <div class="flex items-center gap-2">
                    <button class="text-xs rounded bg-gray-600 hover:bg-gray-700 px-2 py-1" @click="clearPendingList"
                      :disabled="!pending.length">
                      Limpiar
                    </button>
                  </div>
                </div>
                <div class="h-64 overflow-auto space-y-2">
                  <div v-for="(it, idx) in pending" :key="it.id + '-' + idx"
                    class="flex items-center justify-between rounded bg-gray-700/40 px-2 py-2 cursor-grab"
                    draggable="true" @dragstart="onDragStart($event, idx)" @dragover.prevent
                    @drop="onDrop($event, idx)">
                    <div class="flex items-center gap-2 overflow-hidden">
                      <div class="size-8 rounded bg-gray-600/50"></div>
                      <div class="truncate">
                        <div class="text-sm font-medium truncate">{{ it.title }}</div>
                        <div class="text-xs text-gray-400 truncate">{{ it.author }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="text-xs rounded bg-gray-600 hover:bg-gray-700 px-2 py-1"
                        @click="removePending(idx)">
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-4 flex justify-end gap-3">
              <button class="rounded-full bg-gray-600 px-4 py-2 text-white hover:bg-gray-700" @click="onCancel">
                Cancelar
              </button>
              <button class="rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
                :disabled="!isValid || isSaving" @click="onSave">
                Guardar
              </button>
            </div>

            <button type="button"
              class="absolute right-2 top-2 rounded-full bg-white/10 p-1 text-white hover:bg.white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
              aria-label="Cerrar modal" @click="onCancel">
              ✕
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Id = string | number

const props = defineProps<{
  createdPlaylists: { id: Id; name: string }[]
  savedPlaylistsIds: Id[]
  savingMap: Record<Id, boolean>
  isOwner?: boolean
}>()

const emit = defineEmits<{
  (e: 'save-playlist', id: Id): void
  (e: 'create-playlist', payload: { name: string; description?: string; visibility: 'PUBLIC' | 'PRIVATE'; items: any[] }): void
}>()

// Existing list save action remains
// UI state for creation flow
const showCreate = ref(false)
const isSaving = ref(false)

const form = ref({
  name: '',
  description: '',
  visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
})

const nameError = computed(() => {
  const v = form.value.name.trim()
  if (v.length === 0) return 'El nombre es requerido'
  if (v.length < 3) return 'Debe tener al menos 3 caracteres'
  if (v.length > 80) return 'Debe tener máximo 80 caracteres'
  return ''
})
const isValid = computed(() => !nameError.value)

// Simple local search + pending mock (to be wired to real API)
const searchQuery = ref('')
const filters = ref<{ type: string; genre: string }>({ type: '', genre: '' })
const results = ref<{ id: string; title: string; author: string }[]>([])
const pending = ref<{ id: string; title: string; author: string }[]>([])
let debounceHandle: any = null

function openCreateModal() {
  showCreate.value = true
  // prime results empty
  results.value = []
  pending.value = []
  searchQuery.value = ''
  form.value = { name: '', description: '', visibility: 'PUBLIC' }
}

function onCancel() {
  showCreate.value = false
}

function clearPendingList() {
  pending.value = []
}

function onSearchInput() {
  if (debounceHandle) clearTimeout(debounceHandle)
  debounceHandle = setTimeout(() => {
    // Mock results for now; integrate with backend search later
    const q = searchQuery.value.toLowerCase()
    results.value = q
      ? Array.from({ length: 8 }).map((_, i) => ({
        id: `${q}-${filters.value.type || 'any'}-${i}`,
        title: `Resultado ${i + 1} para "${searchQuery.value}"`,
        author: 'Autor desconocido',
      }))
      : []
  }, 350)
}

function addPending(item: { id: string; title: string; author: string }) {
  pending.value.push(item)
}

function removePending(idx: number) {
  pending.value.splice(idx, 1)
}

let draggedIndex = -1
function onDragStart(e: DragEvent, idx: number) {
  draggedIndex = idx
  e.dataTransfer?.setData('text/plain', String(idx))
}
function onDrop(_e: DragEvent, dropIndex: number) {
  if (draggedIndex === -1 || draggedIndex === dropIndex) return
  const [moved] = pending.value.splice(draggedIndex, 1)
  pending.value.splice(dropIndex, 0, moved)
  draggedIndex = -1
}

async function onSave() {
  if (!isValid.value) return
  isSaving.value = true
  try {
    // Notify parent to actually create playlist and associate items
    emit('create-playlist', {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      visibility: form.value.visibility as 'PUBLIC' | 'PRIVATE',
      items: pending.value.slice(),
    })
    showCreate.value = false
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>