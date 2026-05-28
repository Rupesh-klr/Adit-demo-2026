import { useEffect, useRef, useState } from 'react';
import {
  clearAccessToken,
  decodeJwtPayload,
  getStoredAccessToken,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
  signupRequest,
  storeAccessToken,
} from '../services/api';

function scheduleDelay(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;

  const expiresAt = payload.exp * 1000;
  const nextRefresh = expiresAt - Date.now() - 45_000;
  return Math.max(10_000, nextRefresh);
}

export function useSessionManager() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const logout = async () => {
    clearTimer();
    clearAccessToken();
    setUser(null);
    setAccessToken(null);

    try {
      await logoutRequest();
    } catch {
      // Session cleanup is best-effort.
    }
  };

  const refreshSession = async () => {
    const refreshed = await refreshRequest();
    if (!refreshed?.accessToken) {
      throw new Error('Session expired');
    }

    storeAccessToken(refreshed.accessToken);
    setAccessToken(refreshed.accessToken);
    if (refreshed.user) {
      setUser(refreshed.user);
    }

    return refreshed;
  };

  const scheduleRefresh = (token) => {
    clearTimer();
    const delay = scheduleDelay(token);
    if (!delay) return;

    timerRef.current = window.setTimeout(async () => {
      try {
        await refreshSession();
        scheduleRefresh(getStoredAccessToken());
      } catch {
        await logout();
      }
    }, delay);
  };

  const applySession = ({ accessToken: nextToken, user: nextUser }) => {
    if (!nextToken) return;

    storeAccessToken(nextToken);
    setAccessToken(nextToken);
    setUser(nextUser || null);
    scheduleRefresh(nextToken);
  };

  const login = async ({ email, password }) => {
    const result = await loginRequest({ email, password });
    applySession(result);
    return result;
  };

  const signup = async ({ name, email, password }) => {
    const result = await signupRequest({ name, email, password });
    applySession(result);
    return result;
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const storedToken = getStoredAccessToken();
      if (!storedToken) {
        if (isMounted) setBootstrapping(false);
        return;
      }

      try {
        const profile = await meRequest();
        if (!isMounted) return;

        const currentToken = getStoredAccessToken();
        setUser(profile.user || null);
        setAccessToken(currentToken);
        if (currentToken) {
          scheduleRefresh(currentToken);
        }
      } catch {
        clearAccessToken();
        if (isMounted) {
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (isMounted) setBootstrapping(false);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
      clearTimer();
    };
  }, []);

  return {
    user,
    accessToken,
    bootstrapping,
    isAuthenticated: Boolean(user && accessToken),
    login,
    signup,
    logout,
    refreshSession,
  };
}
