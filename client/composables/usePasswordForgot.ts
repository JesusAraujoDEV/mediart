import { ref } from 'vue';
import { showNotification } from '~/utils/notification'; // Reutilizamos esta utilidad

/**
 * Encapsula la lógica de negocio para la solicitud de restablecimiento de contraseña.
 * Se encarga de la llamada a la API, el manejo de estados (loading, error, message)
 * y la validación del correo electrónico.
 *
 * @returns {object} Un objeto con las propiedades reactivas y la función para solicitar el restablecimiento.
 */
export const usePasswordForgot = () => {
  const config = useRuntimeConfig();

  const email = ref<string>('');
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const message = ref<string | null>(null);

  const requestPasswordReset = async () => {
    loading.value = true;
    error.value = null;
    message.value = null;

    if (!email.value) {
      error.value = 'Por favor, ingresa tu correo electrónico.';
      showNotification('Error', error.value, 'error');
      loading.value = false;
      return;
    }

    try {
      const requestResetUrl = `${config.public.backend}/api/auth/recovery`;

      const response = await fetch(requestResetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al solicitar el restablecimiento de contraseña.');
      }

      // Mostrar un mensaje genérico por seguridad, para evitar enumerar correos electrónicos.
      const successMessage = 'Si tu correo electrónico está registrado, te hemos enviado un enlace para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y la carpeta de spam.';
      message.value = successMessage;
      showNotification('Éxito', successMessage, 'success');
      
      email.value = ''; // Limpiar el campo del correo después del envío.

    } catch (err: any) {
      // Mostrar un mensaje de error genérico para el usuario
      const genericErrorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
      error.value = genericErrorMessage;
      showNotification('Error', genericErrorMessage, 'error');
      console.error('Request password reset error:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    email,
    loading,
    error,
    message,
    requestPasswordReset,
  };
};