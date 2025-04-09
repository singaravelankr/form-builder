// Get API base URL from environment variables
const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (!baseUrl) {
    console.warn('VITE_API_BASE_URL is not set in environment variables');
    return 'http://localhost:8000/api';
  }

  return baseUrl;
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    USER: '/user',
  },
  FORMS: {
    LIST: '/forms',
    CREATE: '/forms',
    GET: (id: string) => `/forms/${id}`,
    UPDATE: (id: string) => `/forms/${id}`,
    DELETE: (id: string) => `/forms/${id}`,
  },
}; 