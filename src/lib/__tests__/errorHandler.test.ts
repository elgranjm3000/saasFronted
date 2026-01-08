import { extractErrorMessage } from '../errorHandler';

describe('extractErrorMessage', () => {
  it('debería extraer mensaje de error string simple', () => {
    const error = {
      response: {
        data: {
          detail: 'Producto no encontrado'
        }
      }
    };
    expect(extractErrorMessage(error)).toBe('Producto no encontrado');
  });

  it('debería extraer mensaje de error de validación FastAPI/Pydantic', () => {
    const error = {
      response: {
        data: {
          detail: [
            {
              type: 'value_error',
              loc: ['body', 'price'],
              msg: 'El precio debe ser mayor que 0',
              input: -10
            }
          ]
        }
      }
    };
    expect(extractErrorMessage(error)).toBe('Error en body.price: El precio debe ser mayor que 0');
  });

  it('debería manejar el caso específico del error 422 de producto (missing field)', () => {
    const error = {
      response: {
        data: {
          detail: [
            {
              type: 'missing',
              loc: ['body', 'quantity'],
              msg: 'Field required',
              input: {
                name: 'producto nuevo',
                description: 'sss',
                sku: 'PROD-975266-759',
                price: 60,
                cost: 30
              }
            }
          }
        ]
      }
    };
    expect(extractErrorMessage(error)).toBe('Error en body.quantity: Field required');
  });

  it('debería manejar múltiples errores de validación', () => {
    const error = {
      response: {
        data: {
          detail: [
            {
              type: 'missing',
              loc: ['body', 'quantity'],
              msg: 'Field required',
              input: {}
            },
            {
              type: 'missing',
              loc: ['body', 'price'],
              msg: 'Field required',
              input: {}
            }
          ]
        }
      }
    };
    const result = extractErrorMessage(error);
    expect(result).toBe('Error en body.quantity: Field required');
  });

  it('debería extraer mensaje de error con msg property', () => {
    const error = {
      response: {
        data: {
          detail: {
            msg: 'Error de validación personalizado'
          }
        }
      }
    };
    expect(extractErrorMessage(error)).toBe('Error de validación personalizado');
  });

  it('debería extraer mensaje de error con message property', () => {
    const error = {
      response: {
        data: {
          message: 'Error al procesar la solicitud'
        }
      }
    };
    expect(extractErrorMessage(error)).toBe('Error al procesar la solicitud');
  });

  it('debería extraer mensaje de error con error property', () => {
    const error = {
      response: {
        data: {
          error: 'Credenciales inválidas'
        }
      }
    };
    expect(extractErrorMessage(error)).toBe('Credenciales inválidas');
  });

  it('debería manejar error.message directo', () => {
    const error = {
      message: 'Error de red'
    };
    expect(extractErrorMessage(error)).toBe('Error de red');
  });

  it('debería retornar mensaje por defecto para error no reconocido', () => {
    const error = {
      response: {
        data: {}
      }
    };
    expect(extractErrorMessage(error)).toBe('Error al procesar la solicitud. Inténtalo de nuevo.');
  });

  it('debería manejar null o undefined', () => {
    expect(extractErrorMessage(null)).toBe('Error al procesar la solicitud. Inténtalo de nuevo.');
    expect(extractErrorMessage(undefined)).toBe('Error al procesar la solicitud. Inténtalo de nuevo.');
  });

  it('debería convertir objeto de error a string', () => {
    const error = {
      response: {
        data: {
          detail: {
            field: 'name',
            issue: 'required'
          }
        }
      }
    };
    const result = extractErrorMessage(error);
    expect(result).toContain('{"field":"name","issue":"required"}');
  });

  it('debería manejar array de errores de validación sin msg', () => {
    const error = {
      response: {
        data: {
          detail: [{}]
        }
      }
    };
    expect(extractErrorMessage(error)).toBe('Error de validación en los datos enviados');
  });
});
