import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default timeout
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 30000, // 30 seconds timeout for all requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    const logibrisk = Cookies.get('logibrisk');
    const subscriptionToken = Cookies.get('subscriptionToken');

    if (subscriptionToken) {
      config.headers.Authorization = `Bearer ${subscriptionToken}`;
    } else if (logibrisk) {
      config.headers.Authorization = `Bearer ${logibrisk}`;
    }
    
    // Add a specific timeout for navigation-related requests if needed
    if (config.url?.includes('/Account/') || config.url?.includes('/GetTenantList')) {
      config.timeout = 20000; // 20 seconds timeout for auth-related requests
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  error => {
    // Check if the error is a timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timed out:', error.config.url);
      // Return a structured error response
      return Promise.reject({
        isTimeout: true,
        message: 'Request timed out. Please check your internet connection.',
        originalError: error
      });
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error:', error.config?.url);
      return Promise.reject({
        isNetworkError: true,
        message: 'Network error. Please check your internet connection.',
        originalError: error
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;