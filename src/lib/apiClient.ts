import { useAuthStore } from '../store/useAuthStore';

export interface ApiError extends Error {
  status?: number;
  info?: any;
}

export interface ApiResponseEnvelope<T> {
  data: T;
  status: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

// Configurable API base URL with fallback
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://api.elevate-edu.com/v1';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Setup default headers
    const headers = new Headers(options.headers || {});
    
    // Automatically attach JWT token if available in local storage or zustand auth state
    const authStore = useAuthStore.getState();
    const token = localStorage.getItem('elevate_jwt_token') || (authStore.user?.email ? 'simulated-jwt-token-xyz' : null);

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Centralized error handling / Interceptor simulation
      if (!response.ok) {
        const error: ApiError = new Error('An error occurred while fetching the data.');
        error.status = response.status;
        
        try {
          error.info = await response.json();
        } catch {
          error.info = await response.text();
        }

        // Automatic session eviction on 401 Unauthorized
        if (response.status === 401) {
          console.error('[API Client] Unauthorized - Evicting user session.');
          localStorage.removeItem('elevate_jwt_token');
          useAuthStore.getState().logout();
        }

        throw error;
      }

      // Return parsed JSON data
      return (await response.json()) as T;
    } catch (err: any) {
      // Network or parse errors
      console.warn('[API Client Connection Info] Expected offline/fallback mode:', err.message || err);
      throw err;
    }
  }

  public async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  public async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  public async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
