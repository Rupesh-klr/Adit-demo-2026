const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ACCESS_TOKEN_KEY = 'task-manager-access-token';

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function storeAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function decodeJwtPayload(token) {
  if (!token) return null;
  const parts = String(token).split('.');
  if (parts.length < 2) return null;

  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);

  try {
    return safeJsonParse(atob(paddedPayload));
  } catch {
    return null;
  }
}

async function parseResponse(res) {
  const text = await res.text();
  if (!text) return null;
  return safeJsonParse(text) ?? { message: text };
}

async function refreshSession() {
  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Session refresh failed');
  }

  if (data?.accessToken) {
    storeAccessToken(data.accessToken);
  }

  return data;
}

export async function requestJson(path, options = {}) {
  const {
    method = 'GET',
    body,
    retryOnUnauthorized = true,
    skipAuth = false,
    headers = {},
  } = options;

  const requestHeaders = { ...headers };
  const token = skipAuth ? null : getStoredAccessToken();

  if (!skipAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let requestBody = body;
  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    requestHeaders['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: 'include',
  });

  const data = await parseResponse(response);

  if (response.status === 401 && retryOnUnauthorized && !skipAuth) {
    const refreshed = await refreshSession();
    if (refreshed?.accessToken) {
      return requestJson(path, { ...options, retryOnUnauthorized: false });
    }
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || 'Request failed';
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function loginRequest(credentials) {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: credentials,
    skipAuth: true,
    retryOnUnauthorized: false,
  });
}

export async function signupRequest(payload) {
  return requestJson('/api/auth/signup', {
    method: 'POST',
    body: payload,
    skipAuth: true,
    retryOnUnauthorized: false,
  });
}

export async function logoutRequest() {
  return requestJson('/api/auth/logout', {
    method: 'POST',
    skipAuth: true,
    retryOnUnauthorized: false,
  });
}

export async function refreshRequest() {
  return refreshSession();
}

export async function meRequest() {
  return requestJson('/api/auth/me');
}
