
import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthPage from './components/AuthPage';
import TaskDashboard from './components/TaskDashboard';
import { useSessionManager } from './hooks/useSessionManager';
import './App.css';

function LoadingScreen() {
  return (
    <div className="app-loading">
      <motion.div
        className="loading-orb"
        animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div>
        <h1>Task studio</h1>
        <p>Restoring your session...</p>
      </div>
    </div>
  );
}

function NotFoundRedirect() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      navigate('/', { replace: true });
    }, 10000);

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <div className="not-found-shell">
      <motion.section
        className="not-found-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="lead">
          The route you opened does not exist in this app. You will be redirected to the home page automatically.
        </p>

        <div className="countdown-pill" aria-live="polite">
          Redirecting in <strong>{secondsLeft}</strong> seconds
        </div>

        <button className="primary-button" type="button" onClick={() => navigate('/', { replace: true })}>
          Go home now
        </button>
      </motion.section>
    </div>
  );
}

function AppRouter({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const session = useSessionManager();

  const authActions = useMemo(() => ({
    login: async (credentials) => {
      await session.login(credentials);
      navigate('/app', { replace: true });
    },
    signup: async (payload) => {
      await session.signup(payload);
      navigate('/app', { replace: true });
    },
    logout: async () => {
      await session.logout();
      navigate('/login', { replace: true });
    },
  }), [navigate, session]);

  if (session.bootstrapping) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={session.isAuthenticated ? '/app' : '/login'} replace />}
      />
      <Route
        path="/login"
        element={session.isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage mode="login" onLogin={authActions.login} onSignup={authActions.signup} theme={theme} onToggleTheme={onToggleTheme} />}
      />
      <Route
        path="/signup"
        element={session.isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage mode="signup" onLogin={authActions.login} onSignup={authActions.signup} theme={theme} onToggleTheme={onToggleTheme} />}
      />
      <Route
        path="/app"
        element={session.isAuthenticated ? <TaskDashboard user={session.user} onLogout={authActions.logout} theme={theme} onToggleTheme={onToggleTheme} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem('adit-theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('adit-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <AppRouter theme={theme} onToggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

export default App;
