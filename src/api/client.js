export const apiFetch = async (endpoint, options = {}) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    
    // Agregamos un timeout de 45 segundos para infra gratuita
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
  
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
  
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
  
      const text = await response.text();
      
      return text ? JSON.parse(text) : {}; 
  
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('El servidor tardó demasiado. Reintenta por favor.');
      }
      throw error;
    }
  };