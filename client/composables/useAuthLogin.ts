import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showNotification } from '~/utils/notification'; // Reutilizamos esta utilidad

/**
 * Encapsula la lógica de negocio para el inicio de sesión de usuarios.
 * Se encarga de la llamada a la API, el manejo de estados (loading, error),
 * el almacenamiento de credenciales y la navegación post-login.
 *
 * @returns {object} Un objeto con las propiedades reactivas y la función de login.
 */
export const useAuthLogin = () => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const email = ref<string>('');
  const password = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const handleLogin = async () => {
    loading.value = true;
    error.value = null; // Limpiar errores previos

    try {
      const loginUrl = `${config.public.backend}/api/auth/login`;

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas. Intenta de nuevo.');
      }

      const data = await response.json();

      if (data.user && data.token) {
        // Almacenar el usuario y el token en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        showNotification('Inicio de Sesión Exitoso', 'Bienvenido de nuevo!', 'success');
        await router.push('/studio'); // Redirigir al usuario a la página de estudio
      } else {
        throw new Error('Respuesta del servidor inválida: Faltan datos de usuario o token.');
      }
    } catch (err: any) {
      error.value = err.message || 'Ocurrió un error inesperado durante el inicio de sesión.';
      showNotification('Error de Inicio de Sesión', error.value || 'Ocurrió un error inesperado durante el inicio de sesión.', 'error');
      console.error('Login error:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    email,
    password,
    loading,
    error,
    handleLogin,
  };
};