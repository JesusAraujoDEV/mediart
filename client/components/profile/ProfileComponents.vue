<template>
  <section class="w-full md:w-1/3 h-auto md:h-full rounded-lg p-6 sm:p-8 md:p-12 flex flex-col items-center gap-6 sm:gap-8 md:gap-10 profile-section">
    <ProfileAvatar 
      :avatar-url="userProfile?.profilePictureUrl" 
      :backend-base="runtimeConfig.public.backend"
      :loading="isLoading" 
    />
    
    <ProfileInfo 
      :username="userProfile?.username" 
      :bio="userProfile?.bio" 
      :email="userProfile?.email"
      :created-at="(userProfile as any).createdAt" 
    />
    
    <ProfileCounters 
      :following-count="followersCount.following"
      :followers-count="followersCount.followers" 
      :disabled="isLoading" 
      @go-following="navigateToFollowing"
      @go-followers="navigateToFollowers" 
    />
    
    <ProfileActions 
      :is-owner="isOwner" 
      :is-friend="isFriend" 
      :loading="isFriendActionLoading"
      @add-friend="handleFriendAction('add')" 
      @remove-friend="handleFriendAction('remove')"
      @edit-profile="navigateToEditProfile" 
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfile } from '~/composables/useProfile';

// Recibe username como prop
const props = defineProps<{ username?: string }>();

// Components
import ProfileAvatar from '~/components/profile/parts/ProfileAvatar.vue';
import ProfileInfo from '~/components/profile/parts/ProfileInfo.vue';
import ProfileCounters from '~/components/profile/parts/ProfileCounters.vue';
import ProfileActions from '~/components/profile/parts/ProfileActions.vue';

// Types
interface FollowersCount {
  following: number;
  followers: number;
}

// Composables
const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();

const {
  userProfile,
  isLoading,
  isOwner,
  isFriend,
  isFriendActionLoading,
  refreshProfile,
  sendFriendAction,
} = useProfile();

const followersCount = computed<FollowersCount>(() => ({
  following: userProfile.value.followingUsers?.length || 0,
  followers: userProfile.value.followersUsers?.length || 0,
}));

// Navigation handlers
const navigateToFollowing = () => {
  if (!userProfile.value.username) return;
  router.push(`/profile/${userProfile.value.username}/following`);
};

const navigateToFollowers = () => {
  if (!userProfile.value.username) return;
  router.push(`/profile/${userProfile.value.username}/followers`);
};

const navigateToEditProfile = () => {
  router.push('/profile/edit');
};

// Action handlers
const handleFriendAction = async (action: 'add' | 'remove') => {
  await sendFriendAction(action);
};

// Lifecycle
onMounted(async () => {
  const targetUsername = props.username || getUserFromStorage().username;
  
  if (targetUsername) {
    await refreshProfile(targetUsername);
  }
});

// Utility functions
const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};
</script>

<style scoped>
.profile-section {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffffff20;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

@media (max-height: 740px) {
  .profile-section {
    padding-top: 1rem;
    padding-bottom: 1rem;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .profile-section {
    max-width: 100vw;
  }
}
</style>