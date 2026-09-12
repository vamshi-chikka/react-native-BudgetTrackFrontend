/**
 * Common Utilities and Helpers
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import config from '../../config/env';


/**
 * Create an axios instance with default configurations
 */
export const apiClient = axios.create({
  baseURL: config.API_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add request interceptor to attach auth token
 */
apiClient.interceptors.request.use(
  async (requestConfig) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Add response interceptor to handle common errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and navigate to login
      AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

/**
 * Generic error handler for API calls
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Format amount for display
 */
export const formatCurrency = (amount: number): string => {
  return `₹${Math.abs(amount).toFixed(2)}`;
};

/**
 * Parse amount from string input
 */
export const parseAmount = (amountString: string): number => {
  const parsed = parseFloat(amountString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Debounce function for input validation
 */
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
