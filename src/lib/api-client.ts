import { appConfig } from '@/src/config/app-config';

type ApiClientOptions = {
  token?: string | null;
};

type RequestOptions = RequestInit & {
  token?: string | null;
};

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...fetchOptions } = options;
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError('API request failed', response.status, data);
  }

  return data as T;
}

export function createApiClient({ token }: ApiClientOptions = {}) {
  return {
    get: <T>(path: string) => request<T>(path, { method: 'GET', token }),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: 'POST',
        token,
        body: body ? JSON.stringify(body) : undefined,
      }),
    put: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: 'PUT',
        token,
        body: body ? JSON.stringify(body) : undefined,
      }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE', token }),
  };
}

export { ApiError };
