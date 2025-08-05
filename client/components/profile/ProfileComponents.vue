<template>
  <section class="w-1/3 glassEffect h-full rounded-lg max-md:h-fit p-4 max-md:w-full flex justify-center items-center flex-col gap-4">
    <!-- Avatar -->
    <ProfileAvatar
      :avatar-url="userProfile.profilePictureUrl"
      :backend-base="runtimeConfig.public.backend"
      :loading="isLoading"
    />
    <!-- Info -->
    <ProfileInfo
      :username="userProfile.username"
      :bio="userProfile.bio"
      :email="userProfile.email"
      :created-at="(userProfile as any).createdAt"
    />
    <!-- Counters -->
    <ProfileCounters
      :following-count="userProfile.followingUsers?.length || 0"
      :followers-count="userProfile.followersUsers?.length || 0"
      :disabled="isLoading"
      @go-following="goToFollowing"
      @go-followers="goToFollowers"
    />
    <!-- Actions -->
    <ProfileActions
      :is-owner="isOwner"
      :is-friend="isFriend"
      :loading="isFriendActionLoading"
      @add-friend="() => sendFriendAction('add')"
      @remove-friend="() => sendFriendAction('remove')"
      @edit-profile="() => router.push('/profile/edit')"
    />

    <!-- Mis playlists guardadas + botón Crear (solo dueño) -->
    <div class="w-full mt-2">
      <ProfilePlaylists
        :created-playlists="createdPlaylists?.map(p => ({ id: p.id, name: p.name })) || []"
        :saved-playlists-ids="savedPlaylistsIds"
        :saving-map="isSavingPlaylist"
        :is-owner="isOwner"
        @save-playlist="(id) => savePlaylist(Number(id))"
        @create-playlist="handleCreatePlaylist"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfile } from '~/composables/useProfile';

import ProfileAvatar from '~/components/profile/parts/ProfileAvatar.vue';
import ProfileInfo from '~/components/profile/parts/ProfileInfo.vue';
import ProfileCounters from '~/components/profile/parts/ProfileCounters.vue';
import ProfileActions from '~/components/profile/parts/ProfileActions.vue';
import ProfilePlaylists from '~/components/profile/parts/ProfilePlaylists.vue';

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();

// Helper used by ProfileAvatar to build absolute/placeholder src
function resolveProfileSrc(url?: string | null) {
  if (!url) return '/avatar-default.svg'
  return url.startsWith('http') ? url : `${runtimeConfig.public.backend}${url}`
}

const {
  userProfile,
  isLoading,
  isOwner,
  isFriend,
  isFriendActionLoading,
  createdPlaylists,
  savedPlaylistsIds,
  isSavingPlaylist,
  refreshProfile,
  fetchSavedPlaylistsIds,
  sendFriendAction,
  savePlaylist,
} = useProfile();

function goToFollowing() {
  if (!userProfile.value.username) return;
  router.push(`/profile/${userProfile.value.username}/following`);
}
function goToFollowers() {
  if (!userProfile.value.username) return;
  router.push(`/profile/${userProfile.value.username}/followers`);
}

async function handleCreatePlaylist(payload: { name: string; description?: string; visibility: 'PUBLIC'|'PRIVATE'; items: any[] }) {
  // Guard: only owner can create
  if (!isOwner.value) return;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    // Create playlist (basic JSON body; adapt if backend expects multipart for cover)
    const resp = await fetch(`${runtimeConfig.public.backend}/api/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: payload.name,
        description: payload.description || '',
        privacy: payload.visibility
      })
    });
    if (!resp.ok) {
      throw new Error('No se pudo crear la playlist');
    }
    const created = await resp.json();
    const playlistId = created.id;

    // Optionally add items if your backend supports it and items contain IDs
    if (payload.items?.length) {
      await fetch(`${runtimeConfig.public.backend}/api/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackIds: payload.items.map((it: any) => it.id),
        })
      }).catch(() => {});
    }

    // Navigate to playlist editor/management view
    router.push(`/studio/playlists/${playlistId}`);
  } catch (e) {
    console.error(e);
    // Optionally show a toast if you have a global notifier
  }
}

onMounted(async () => {
  const usernameFromUrl = route.params.username as string;
  const targetUsername = usernameFromUrl || JSON.parse(localStorage.getItem('user') || '{}').username;
  if (targetUsername) {
    await refreshProfile(targetUsername);
  }
  await fetchSavedPlaylistsIds();
});
</script>