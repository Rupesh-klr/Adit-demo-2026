import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowRight, FiLock, FiMail, FiMoon, FiSun, FiUser } from 'react-icons/fi';

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Field({ label, icon, type = 'text', value, onChange, placeholder, required = false, autoComplete }) {
  return (
    <label className="field-group">
      <span className="field-label">
        {icon}
        {label}
        {required ? <span className="field-required">*</span> : null}
      </span>
      <input
        className="field-input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}

export default function AuthPage({ mode, onLogin, onSignup, theme, onToggleTheme }) {
  const location = useLocation();
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const title = useMemo(() => (isSignup ? 'Create your workspace' : 'Welcome back'), [isSignup]);

  const validate = () => {
    if (!form.email.trim()) return 'Email is required.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) return 'Enter a valid email address.';
    if (!form.password.trim()) return 'Password is required.';
    if (form.password.trim().length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      if (isSignup) {
        await onSignup({
          name: form.name.trim() || form.email.split('@')[0],
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await onLogin({
          email: form.email.trim(),
          password: form.password,
        });
      }
    } catch (submitError) {
      setError(submitError.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-background">
        <span className="blob blob-one" />
        <span className="blob blob-two" />
        <span className="grid-overlay" />
      </div>

      <motion.section
        className="auth-card"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="auth-copy">
          <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <p className="eyebrow">Task management</p>
          <h1>{title}</h1>
          <p className="lead">
            Sign in to keep your tasks in sync, or create a fresh workspace in seconds.
          </p>

          <div className="session-pill">
            <FiLock />
            <span>Session refresh is automatic while you stay active.</span>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-switcher">
            <Link className={mode === 'login' ? 'switch-link active' : 'switch-link'} to="/login">
              Login
            </Link>
            <Link className={mode === 'signup' ? 'switch-link active' : 'switch-link'} to="/signup">
              Sign up
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              className="auth-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.25 }}
            >
              {isSignup ? (
                <Field
                  label="Display name"
                  icon={<FiUser />}
                  value={form.name}
                  onChange={(value) => setForm((current) => ({ ...current, name: value }))}
                  placeholder="How people will see you"
                  autoComplete="name"
                />
              ) : null}

              <Field
                label="Email"
                icon={<FiMail />}
                type="email"
                value={form.email}
                onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                placeholder="name@company.com"
                required
                autoComplete="email"
              />

              <Field
                label="Password"
                icon={<FiLock />}
                type="password"
                value={form.password}
                onChange={(value) => setForm((current) => ({ ...current, password: value }))}
                placeholder="••••••••"
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />

              {error ? <div className="form-error">{error}</div> : null}

              <button className="primary-button" type="submit" disabled={loading}>
                <span>{loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}</span>
                <FiArrowRight />
              </button>

              <p className="auth-footer">
                {isSignup ? 'Already have an account?' : 'Need a new workspace?'}{' '}
                <Link to={isSignup ? '/login' : '/signup'} state={{ from: location.pathname }}>
                  {isSignup ? 'Go to login' : 'Create account'}
                </Link>
              </p>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}
