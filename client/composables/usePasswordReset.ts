import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotification } from '~/utils/notification'; // Reutilizamos esta utilidad

/**
 * Encapsula la lógica de restablecimiento de contraseña.
 * Se encarga de extraer el token de la URL, validar las contraseñas,
 * hacer la llamada a la API y manejar los estados.
 *
 * @returns {object} Un objeto con las propiedades reactivas y la función de restablecimiento.
 */
export const usePasswordReset = () => {
  const config = useRuntimeConfig();
  const route = useRoute();
  const router = useRouter();

  const token = ref<string | null>(null);
  const newPassword = ref<string>('');
  const confirmPassword = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const message = ref<string | null>(null);

  onMounted(() => {
    // Extrae el token de los parámetros de la URL cuando el componente se monta.
    token.value = route.query.token as string | null;
  });

  const resetPassword = async () => {
    loading.value = true;
    error.value = null;
    message.value = null;

    // --- Validaciones iniciales ---
    if (!token.value) {
      error.value = 'El token de restablecimiento no es válido.';
      showNotification('Error', error.value, 'error');
      loading.value = false;
      return;
    }

    if (!newPassword.value || !confirmPassword.value) {
      error.value = 'Por favor, ingresa y confirma tu nueva contraseña.';
      showNotification('Error', error.value, 'error');
      loading.value = false;
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden.';
      showNotification('Error', error.value, 'error');
      loading.value = false;
      return;
    }

    if (newPassword.value.length < 8) {
      error.value = 'La contraseña debe tener al menos 8 caracteres.';
      showNotification('Error', error.value, 'error');
      loading.value = false;
      return;
    }

    try {
      const changePasswordUrl = `${config.public.backend}/api/auth/change-password`;

      const response = await fetch(changePasswordUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.value,
          newPassword: newPassword.value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al restablecer la contraseña. El enlace podría ser inválido o haber caducado.');
      }

      // Éxito: notifica al usuario y redirige.
      showNotification('Éxito', '¡Contraseña restablecida exitosamente!', 'success');
      
      // Limpia los campos y redirige después de un breve período.
      newPassword.value = '';
      confirmPassword.value = '';

      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      error.value = err.message || 'Ocurrió un error inesperado al restablecer la contraseña. Intenta de nuevo.';
      showNotification('Error', error.value || 'Ocurrió un error inesperado al restablecer la contraseña. Intenta de nuevo.', 'error');
      console.error('Reset password error:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    token,
    newPassword,
    confirmPassword,
    loading,
    error,
    message,
    resetPassword,
  };
};