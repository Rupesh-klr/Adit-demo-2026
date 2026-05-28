
import { useMemo } from 'react';
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

function AppRouter() {
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
        element={session.isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage mode="login" onLogin={authActions.login} onSignup={authActions.signup} />}
      />
      <Route
        path="/signup"
        element={session.isAuthenticated ? <Navigate to="/app" replace /> : <AuthPage mode="signup" onLogin={authActions.login} onSignup={authActions.signup} />}
      />
      <Route
        path="/app"
        element={session.isAuthenticated ? <TaskDashboard user={session.user} onLogout={authActions.logout} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
