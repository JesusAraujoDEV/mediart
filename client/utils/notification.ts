import Swal from "sweetalert2";

// Define la interfaz para los tipos de notificación que puedes usar.
type NotificationType = "success" | "error" | "warning" | "info";

/**
 * Muestra una notificación con SweetAlert2.
 * @param {string} title El título de la notificación.
 * @param {string} text El texto del cuerpo de la notificación.
 * @param {NotificationType} icon El ícono de la notificación.
 */
export const showNotification = (
  title: string,
  text: string,
  icon: NotificationType
) => {
  Swal.fire({
    title,
    text,
    icon,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};
