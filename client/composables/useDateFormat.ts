export function useDateFormat() {
  const formatDateTime = (dateString: string): string => {
    if (!dateString) return 'Fecha desconocida';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Fecha desconocida';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return { formatDate, formatDateTime };
}