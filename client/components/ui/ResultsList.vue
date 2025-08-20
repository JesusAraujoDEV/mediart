<template>
    <div v-if="results.length > 0" class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex-grow overflow-y-auto custom-scroll">
      <h2 class="text-2xl font-bold mb-5 text-gray-200">
        Resultados de Búsqueda ({{ results.length }})
      </h2>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="item in results" :key="item.id || item.externalId || item.title">
       <a v-if="!isUser(item) && item.externalUrl && typeof item.externalUrl === 'string' && item.externalUrl.startsWith('http')"
         :href="item.externalUrl"
         target="_blank"
         rel="noopener noreferrer"
         @click.prevent.stop="openExternal(item.externalUrl)"
             class="bg-gray-700/60 rounded-lg p-3 flex items-center shadow-md transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-600/70 border border-gray-600 no-underline text-white block">
            <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.title" loading="lazy" referrerpolicy="no-referrer"
              class="w-16 h-16 object-cover rounded-lg flex-shrink-0 mr-4 shadow-sm border border-gray-500" />
            <div v-else
              class="w-16 h-16 bg-gray-600 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center text-gray-400 text-xs border border-gray-500">
              Sin portada
            </div>
            <div class="flex-grow">
              <h3 class="font-bold text-xl text-white">{{ item.title }}</h3>
              <p class="text-sm text-gray-300 capitalize line-clamp-1">{{ item.type }}</p>
              <p v-if="item.description" class="text-xs text-gray-400 line-clamp-1">{{ item.description }}</p>
            </div>
            <div class="ml-2 text-blue-400">
              <Icon name="material-symbols:open-in-new" size="1.2em" />
            </div>
          </a>

          <NuxtLink v-else
            :to="getItemRedirectUrl(item)"
            @click="handleLinkClick(item, $event)"
            class="bg-gray-700/60 rounded-lg p-3 flex items-center shadow-md transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-600/70 border border-gray-600 no-underline text-white block">
            <template v-if="isUser(item)">
              <img :src="getProfilePictureUrl(item)" alt="Profile Picture" @error="handleImageError"
                class="w-16 h-16 object-cover rounded-full flex-shrink-0 mr-4 shadow-sm border border-gray-500" />
              <div class="flex-grow">
                <h3 class="font-bold text-xl text-white">{{ item.username }}</h3>
                <p class="text-sm text-gray-300 truncate">{{ item.bio || 'Sin biografía' }}</p>
                <p class="text-xs text-gray-400">{{ item.email }}</p>
              </div>
            </template>
            <template v-else>
              <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.title" loading="lazy" referrerpolicy="no-referrer"
                class="w-16 h-16 object-cover rounded-lg flex-shrink-0 mr-4 shadow-sm border border-gray-500" />
              <div v-else
                class="w-16 h-16 bg-gray-600 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center text-gray-400 text-xs border border-gray-500">
                Sin portada
              </div>
              <div class="flex-grow">
                <h3 class="font-bold text-xl text-white">{{ item.title }}</h3>
                <p class="text-sm text-gray-300 capitalize line-clamp-1">{{ item.type }}</p>
                <p v-if="item.description" class="text-xs text-gray-400 line-clamp-1">{{ item.description }}</p>
              </div>
            </template>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { UserProfile } from '~/types/User';
  
  const props = defineProps({
    results: {
      type: Array as () => any[],
      required: true,
    },
    searchType: {
      type: String,
      required: true,
    }
  });
  
  const config = useRuntimeConfig();
  
  const isUser = (item: any): item is UserProfile => {
    // Prefer shape-based detection: item with username looks like a user.
    if (!item) return false;
    if (item.username) return true;
    // Fall back to searchType flag for legacy behavior
    return props.searchType === 'users';
  };
  
  function getProfilePictureUrl(user: any) {
    if (!user.profilePictureUrl || user.profilePictureUrl === '/resources/studio/previewProfile.webp') {
      return '/resources/studio/previewProfile.webp';
    }
    if (user.profilePictureUrl.startsWith('http')) {
      return user.profilePictureUrl;
    }
    return config.public.backend + user.profilePictureUrl;
  }
  
  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/resources/studio/previewProfile.webp';
  }

  function openExternal(url: string | undefined) {
    if (!url) return;
    // Use window.open to ensure external navigation isn't intercepted by SPA router
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
  
  function getItemRedirectUrl(item: any) {
    if (isUser(item)) return `/profile/${item.username}`;
    if (!item.externalId) return `/studio/search?q=${encodeURIComponent(item.title)}&type=${item.type}`;
    switch (item.type) {
      case "song": return `/studio/item/${item.externalId}?type=song`;
      case "movie": return `/studio/item/${item.externalId}?type=movie`;
      case "tvshow": return `/studio/item/${item.externalId}?type=tvshow`;
      case "artist": return `/studio/item/${item.externalId}?type=artist`;
      case "album": return `/studio/item/${item.externalId}?type=album`;
      case "book": return `/studio/item/${item.externalId}?type=book`;
      case "videogame": return `/studio/item/${item.externalId}?type=videogame`;
      default: return `/studio/item/${item.externalId}`;
    }
  }

  function handleLinkClick(item: any, event: Event) {
    // Only open external URLs when the current search mode isn't 'users'.
    // If the user intentionally searched users, always keep local navigation.
    if (props.searchType !== 'users' && item?.externalUrl && typeof item.externalUrl === 'string' && item.externalUrl.startsWith('http')) {
      event.preventDefault();
      openExternal(item.externalUrl);
    }
  }
  </script>
  