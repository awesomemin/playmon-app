import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/services/storage/keys';
import { API_BASE_URL } from '@/constants/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestConfig extends Omit<RequestInit, 'body'> {
  requiresAuth?: boolean;
  body?: any;
}

export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { requiresAuth = false, body, ...fetchConfig } = config;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchConfig.headers,
  };

  if (requiresAuth) {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('[apiClient] Request:', url);

  const response = await fetch(url, {
    ...fetchConfig,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle empty responses
  const text = await response.text();
  console.log('[apiClient] Response status:', response.status, 'body preview:', text.substring(0, 200));

  if (!response.ok) {
    // Try to parse as JSON, otherwise use text
    let errorData: any = {};
    try {
      errorData = JSON.parse(text);
    } catch {
      errorData = { message: text.substring(0, 100) };
    }
    throw new ApiError(
      response.status,
      errorData.message || `HTTP Error ${response.status}`,
      errorData
    );
  }

  if (!text) {
    return {} as T;
  }

  // Check if response is HTML instead of JSON
  if (text.trim().startsWith('<')) {
    console.error('[apiClient] Received HTML instead of JSON:', text.substring(0, 200));
    throw new ApiError(500, 'Server returned HTML instead of JSON');
  }

  return JSON.parse(text);
}
