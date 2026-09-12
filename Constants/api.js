/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

import config from '../config/env';

export const API_URL = config.API_URL;
export const API_TIMEOUT = 60000;

// API Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VERIFY: '/api/auth/verify',
  LOGOUT: '/api/auth/logout',
};

export const TRANSACTION_ENDPOINTS = {
  GET_SUMMARY: '/api/tran/summary',
  ADD_TRANSACTION: '/api/tran/addtransaction',
  DELETE_TRANSACTION: '/api/tran/delete',
  UPDATE_TRANSACTION: '/api/tran/update',
};