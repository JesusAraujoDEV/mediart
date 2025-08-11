import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showNotification } from '~/utils/notification'; // Assuming you create this file

/**
 * Encapsula la lógica de negocio para el registro de usuarios.
 * Se encarga de la llamada a la API, el manejo de estados (loading, error)
 * y la navegación post-registro.
 *
 * @returns {object} Un objeto con las propiedades reactivas y la función de registro.
 */
export const useAuthRegister = () => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const email = ref<string>('');
  const username = ref<string>('');
  const password = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const handleRegister = async () => {
    loading.value = true;
    error.value = null;

    try {
      const registerUrl = `${config.public.backend}/api/users`;

      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          username: username.value,
          passwordHash: password.value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la cuenta.');
      }

      // Registro exitoso, redirigimos al login o a la página principal.
      // Puedes modificar esta lógica según tu flujo de autenticación.
      showNotification('Registro Exitoso!', 'Tu cuenta ha sido creada. Por favor, inicia sesión.', 'success');
      await router.push('/login');
    } catch (err: any) {
      error.value = err.message || 'Ocurrió un error inesperado durante el registro.';
      showNotification('Error', error.value || 'Ocurrió un error inesperado durante el registro.', 'error');
    } finally {
      loading.value = false;
    }
  };

  return {
    email,
    username,
    password,
    loading,
    error,
    handleRegister,
  };
};