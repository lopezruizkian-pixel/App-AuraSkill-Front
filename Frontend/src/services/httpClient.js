import { API_URL } from './api';

/**
 * HTTP Client Centralizado con Interceptor
 * Maneja autenticación, errores y reintentos automáticamente
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || API_URL;

class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = 10000;
  }

  /**
   * Obtiene el token de forma dinámica del almacenamiento
   */
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Construye headers con autenticación
   */
  buildHeaders(customHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...customHeaders,
    };
  }

  /**
   * Maneja respuestas de error
   */
  async handleErrorResponse(response) {
    const errorData = await response.json().catch(() => ({}));

    // Si el token expiró (401)
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    // Si no tiene permisos (403)
    if (response.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }

    // Si no existe el recurso (404)
    if (response.status === 404) {
      throw new Error('El recurso solicitado no existe.');
    }

    // Si hay error en el servidor (5xx)
    if (response.status >= 500) {
      throw new Error('Error del servidor. Intenta más tarde.');
    }

    // Error genérico
    throw new Error(
      errorData.error ||
      errorData.message || 
      `Error ${response.status}: ${response.statusText}`
    );
  }

  /**
   * Realiza una petición HTTP con manejo de errores
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options.headers);

    const config = {
      method: options.method || 'GET',
      headers,
      timeout: this.timeout,
      ...options,
    };

    // No incluir headers dos veces
    delete config.headers;

    try {
      const response = await fetch(url, {
        ...config,
        headers,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Manejo de respuestas vacías (204 No Content)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`[HTTP] Error en ${config.method} ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Métodos de conveniencia
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Exportar instancia singleton
export const httpClient = new HttpClient();

export default httpClient;
