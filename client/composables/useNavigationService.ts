import { useRouter } from 'vue-router';

export const useNavigationService = () => {
  const router = useRouter();

  const navigateToProfile = (username: string, section?: 'following' | 'followers') => {
    const path = section ? `/profile/${username}/${section}` : `/profile/${username}`;
    router.push(path);
  };

  const navigateToEdit = () => {
    router.push('/profile/edit');
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToHome = () => {
    router.push('/');
  };

  return {
    navigateToProfile,
    navigateToEdit,
    navigateToLogin,
    navigateToHome,
  };
}; 