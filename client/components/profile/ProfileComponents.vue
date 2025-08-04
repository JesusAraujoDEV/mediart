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
    <!-- Playlists removed from profile card -->
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
// Removed ProfilePlaylists import because playlists were removed from the card

const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();

// Helper used by ProfileAvatar to build absolute/placeholder src
function resolveProfileSrc(url?: string | null) {
  if (!url) return '/resources/studio/previewProfile.webp'
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

onMounted(async () => {
  const usernameFromUrl = route.params.username as string;
  const targetUsername = usernameFromUrl || JSON.parse(localStorage.getItem('user') || '{}').username;
  if (targetUsername) {
    await refreshProfile(targetUsername);
  }
  await fetchSavedPlaylistsIds();
});
</script>