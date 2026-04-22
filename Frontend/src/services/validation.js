/**
 * Validación de inputs y formularios
 * Siguiendo estándares HTML5 y buenas prácticas
 */

/**
 * Valida formato de email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida contraseña
 * Requisitos: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return {
      valid: false,
      error: 'La contraseña debe tener mínimo 8 caracteres',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'La contraseña debe contener al menos 1 mayúscula',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'La contraseña debe contener al menos 1 minúscula',
    };
  }

  if (!/\d/.test(password)) {
    return {
      valid: false,
      error: 'La contraseña debe contener al menos 1 número',
    };
  }

  return { valid: true };
};

/**
 * Valida nombre
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'El nombre es requerido' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'El nombre debe tener mínimo 2 caracteres' };
  }

  if (name.trim().length > 50) {
    return { valid: false, error: 'El nombre debe tener máximo 50 caracteres' };
  }

  return { valid: true };
};

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value, fieldName = 'Este campo') => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: `${fieldName} es requerido` };
  }
  return { valid: true };
};

/**
 * Valida longitud mínima
 */
export const validateMinLength = (value, minLength, fieldName = 'Este campo') => {
  if (value.length < minLength) {
    return { 
      valid: false, 
      error: `${fieldName} debe tener mínimo ${minLength} caracteres` 
    };
  }
  return { valid: true };
};

/**
 * Valida longitud máxima
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Este campo') => {
  if (value.length > maxLength) {
    return { 
      valid: false, 
      error: `${fieldName} debe tener máximo ${maxLength} caracteres` 
    };
  }
  return { valid: true };
};

/**
 * Valida número dentro de rango
 */
export const validateRange = (value, min, max, fieldName = 'Este valor') => {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} debe ser un número` };
  }

  if (num < min || num > max) {
    return { 
      valid: false, 
      error: `${fieldName} debe estar entre ${min} y ${max}` 
    };
  }

  return { valid: true };
};

/**
 * Valida un formulario completo
 */
export const validateForm = (formData, schema) => {
  const errors = {};

  Object.entries(schema).forEach(([field, validator]) => {
    const result = validator(formData[field]);
    if (!result.valid) {
      errors[field] = result.error;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitiza strings para prevenir XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validadores preconstruidos para formularios comunes
 */
export const validators = {
  loginForm: {
    correo: (value) => validateEmail(value) 
      ? { valid: true }
      : { valid: false, error: 'Email inválido' },
    password: (value) => 
      validateRequired(value, 'Contraseña').valid
        ? { valid: true }
        : { valid: false, error: 'Contraseña requerida' },
  },

  registerForm: {
    nombre: validateName,
    correo: (value) => validateEmail(value)
      ? { valid: true }
      : { valid: false, error: 'Email inválido' },
    password: validatePassword,
    confirmPassword: (value) => 
      validateRequired(value, 'Confirmación de contraseña').valid
        ? { valid: true }
        : { valid: false, error: 'Debe confirmar la contraseña' },
  },

  crearSalaForm: {
    nombre: (value) => {
      const required = validateRequired(value, 'Nombre de la sala');
      if (!required.valid) return required;
      return validateMinLength(value, 3, 'El nombre de la sala');
    },
    habilidad: (value) => 
      validateRequired(value, 'Habilidad').valid
        ? { valid: true }
        : { valid: false, error: 'Debes seleccionar una habilidad' },

    limiteEstudiantes: (value) => 
      validateRange(value, 1, 50, 'Límite de estudiantes'),
    descripcion: (value) => 
      value.length > 500
        ? { valid: false, error: 'La descripción no debe exceder 500 caracteres' }
        : { valid: true },
  },
};
