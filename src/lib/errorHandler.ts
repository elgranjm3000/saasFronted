/**
 * Extrae el mensaje de error de una respuesta de error de la API
 * Maneja diferentes formatos de error comunes en FastAPI/Pydantic
 */
export const extractErrorMessage = (error: any): string => {
  // Error por defecto
  const defaultErrorMessage = 'Error al procesar la solicitud. Inténtalo de nuevo.';

  // Si no hay error, retornar mensaje por defecto
  if (!error) {
    return defaultErrorMessage;
  }

  // Si el error tiene un mensaje directo
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }

  // Si el error viene de una respuesta HTTP (axios)
  if (error.response?.data) {
    const data = error.response.data;

    // Caso 1: El error es un string directo en 'detail'
    if (typeof data.detail === 'string') {
      return data.detail;
    }

    // Caso 2: El error es un array de errores de validación de FastAPI/Pydantic
    // Formato: [{type: 'value_error', loc: ['field_name'], msg: 'error message', input: 'value'}]
    if (Array.isArray(data.detail)) {
      const firstError = data.detail[0];
      if (firstError?.msg) {
        const field = firstError.loc?.join('.') || 'campo';
        return `Error en ${field}: ${firstError.msg}`;
      }
      return 'Error de validación en los datos enviados';
    }

    // Caso 3: El error es un objeto con 'msg'
    if (typeof data.detail === 'object' && data.detail?.msg) {
      return data.detail.msg;
    }

    // Caso 4: El error tiene 'message'
    if (data.message) {
      return data.message;
    }

    // Caso 5: El error tiene 'error'
    if (data.error) {
      return typeof data.error === 'string' ? data.error : defaultErrorMessage;
    }

    // Caso 6: Respuesta genérica de FastAPI
    if (typeof data.detail === 'object') {
      return JSON.stringify(data.detail);
    }
  }

  // Si el error es una cadena directa
  if (typeof error === 'string') {
    return error;
  }

  // Log para debugging
  console.error('Error no manejado:', error);

  return defaultErrorMessage;
};
