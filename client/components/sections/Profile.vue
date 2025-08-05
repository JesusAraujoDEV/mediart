<template>
  <section
    class="w-1/3 glassEffect h-full rounded-lg max-md:h-fit p-4 max-md:w-full flex justify-center items-center flex-col gap-4"
  >
    <img
      v-if="isLoading"
      class="size-36 animate-pulse rounded-full object-cover"
      :src="(userProfile.profilePictureUrl ? (userProfile.profilePictureUrl.startsWith('http') ? userProfile.profilePictureUrl : config.public.backend + userProfile.profilePictureUrl) : '/resources/studio/previewProfile.webp')"
      @error="handleImageError"
      alt="Cargando perfil..."
    />
    <img
      v-else
      :src="(userProfile.profilePictureUrl ? (userProfile.profilePictureUrl.startsWith('http') ? userProfile.profilePictureUrl : config.public.backend + userProfile.profilePictureUrl) : '/resources/studio/previewProfile.webp')"
      @error="handleImageError"
      alt="Profile"
      class="size-36 rounded-full object-cover"
    />

    <h1 class="text-2xl font-bold">{{ userProfile.username }}</h1>
    <p class="text-center w-2/3">{{ userProfile.bio }}</p>
    <p class="text-center text-sm text-gray-500">{{ userProfile.email }}</p>

    <div class="flex gap-6 my-2">
      <button
        class="flex flex-col items-center focus:outline-none hover:text-purple-500 transition-colors cursor-pointer"
        @click="goToFollowing"
        :disabled="isLoading"
        style="background: none; border: none;"
      >
        <span class="text-lg font-bold">{{ userProfile.followingUsers?.length || 0 }}</span>
        <span class="text-xs text-gray-400">Amigos</span>
      </button>
      <button
        class="flex flex-col items-center focus:outline-none hover:text-purple-500 transition-colors cursor-pointer"
        @click="goToFollowers"
        :disabled="isLoading"
        style="background: none; border: none;"
      >
        <span class="text-lg font-bold">{{ userProfile.followersUsers?.length || 0 }}</span>
        <span class="text-xs text-gray-400">Seguidores</span>
      </button>
    </div>

    <div v-if="!isOwner">
      <button
        v-if="!isFriend"
        @click="addFriend"
        :disabled="isFriendActionLoading"
        class="glassEffect text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 cursor-pointer"
      >
        {{ isFriendActionLoading ? 'Agregando...' : 'Agregar amigo' }}
      </button>
      <button
        v-else
        @click="removeFriend"
        :disabled="isFriendActionLoading"
        class="glassEffect text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 cursor-pointer"
      >
        {{ isFriendActionLoading ? 'Eliminando...' : 'Eliminar de amigos' }}
      </button>
    </div>

    <NuxtLink 
      v-else 
      to="/profile/edit" 
      class="glassEffect text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 transform cursor-pointer"
    >
      Editar Perfil
    </NuxtLink>

    <div v-if="createdPlaylists.length > 0" class="w-full mt-8">
      <h2 class="text-xl font-bold mb-2 text-center">Playlists creadas</h2>
      <div class="flex flex-col gap-4">
        <div v-for="playlist in createdPlaylists" :key="playlist.id" class="bg-gray-800/70 rounded-lg p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-lg">{{ playlist.name }}</div>
              <div class="text-sm text-gray-400">{{ playlist.description }}</div>
            </div>
            <button
              v-if="!isOwner && !savedPlaylistsIds.includes(playlist.id)"
              :disabled="isSavingPlaylist[playlist.id]"
              @click="savePlaylist(playlist.id)"
              class="glassEffect text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 hover:scale-105 transform cursor-pointer"
            >
              <span v-if="!isSavingPlaylist[playlist.id]">Guardar en mi biblioteca</span>
              <span v-else>Guardando...</span>
            </button>
            <span v-else-if="!isOwner && savedPlaylistsIds.includes(playlist.id)" class="text-green-400 font-semibold">Guardada</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No es necesario importar ProfileComponents ya que hemos incorporado su contenido.
// Si esta lógica está en un archivo de composable o similar, el script debería reflejarlo.
// Aquí se asume que las variables y funciones (como isLoading, userProfile, addFriend, etc.)
// están definidas en el script del componente padre o a través de un composable.
</script>