import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type RequestHeaders = Record<string, string>;

type RNRestClientOptions = {
  endpoint: string;
  method?: HttpMethod;
  body?: unknown;
  headers?: RequestHeaders;
  requireAuth?: boolean;
};

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const parseBody = async <T = any>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!text) {
    return null as T;
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(text) as T;
  }

  return text as unknown as T;
};

const normalizeErrorMessage = async (response: Response): Promise<string> => {
  const text = await response.text();

  try {
    const payload = JSON.parse(text);
    return payload?.message || payload?.error || payload?.data || `Request failed (${response.status})`;
  } catch {
    return text || `Request failed (${response.status})`;
  }
};

/**
 * Fetch-first transport layer for the BudgetT app.
 */
export const rnRestClient = async <T = any>({
  endpoint,
  method = 'GET',
  body,
  headers = {},
  requireAuth = true,
}: RNRestClientOptions): Promise<T> => {
  const token = requireAuth ? await AsyncStorage.getItem('token') : null;
  const requestHeaders = {
    ...jsonHeaders,
    ...headers,
  } as RequestHeaders;

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body !== undefined && method !== 'GET' && method !== 'DELETE') {
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(`${config.API_URL}${endpoint}`, requestInit);

  if (response.status === 401) {
    await AsyncStorage.removeItem('token');
  }

  if (!response.ok) {
    throw new Error(await normalizeErrorMessage(response));
  }

  return parseBody<T>(response);
};

export const CALLAPI = {
  get: <T = any>(endpoint: string, headers: RequestHeaders = {}) =>
    rnRestClient<T>({ endpoint, method: 'GET', headers }),
  post: <T = any>(endpoint: string, body?: unknown, headers: RequestHeaders = {}) =>
    rnRestClient<T>({ endpoint, method: 'POST', body, headers }),
  put: <T = any>(endpoint: string, body?: unknown, headers: RequestHeaders = {}) =>
    rnRestClient<T>({ endpoint, method: 'PUT', body, headers }),
  delete: <T = any>(endpoint: string, headers: RequestHeaders = {}) =>
    rnRestClient<T>({ endpoint, method: 'DELETE', headers }),
  patch: <T = any>(endpoint: string, body?: unknown, headers: RequestHeaders = {}) =>
    rnRestClient<T>({ endpoint, method: 'PATCH', body, headers }),
};
