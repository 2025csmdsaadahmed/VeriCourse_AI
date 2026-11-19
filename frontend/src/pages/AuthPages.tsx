import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as any)?.message;
  const redirectDestination = (location.state as any)?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
      navigate(redirectDestination, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMockLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const testEmail = prompt('Enter Google Account email for sandbox sign-in:', 'student@university.edu');
      if (!testEmail) {
        setLoading(false);
        return;
      }
      const res = await api.post('/auth/google', {
        credential: 'google_token_sample',
        email: testEmail,
        full_name: 'Verified Student'
      });
      login(res.data.access_token, res.data.user);
      navigate(redirectDestination, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Google sign-in requires GOOGLE_CLIENT_ID configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-warm-bg">
      <div className="max-w-md w-full organic-card p-8 sm:p-10 shadow-soft-lg relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 group">
            <img
              src="/assets/vericourse-logo.png"
              alt="VeriCourse AI"
              className="h-20 w-auto mx-auto object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h2 className="text-3xl font-extrabold text-forest-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-warm-muted mt-1.5 font-medium">Sign in to your student intelligence workspace</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-sm font-medium flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-forest-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-terracotta-light border border-terracotta/20 text-terracotta-dark text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Form First */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-forest-900 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-warm-muted absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-sm font-medium focus:border-forest-600 focus:bg-white focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-forest-900">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-warm-muted absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-sm font-medium focus:border-forest-600 focus:bg-white focus:outline-none transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-warm-muted hover:text-forest-900 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-forest-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 hover:scale-[1.01]"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-warm-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
            <span className="px-3 bg-white text-warm-muted">or continue with</span>
          </div>
        </div>

        {/* Google OAuth Option (Positioned below standard form) */}
        <button
          type="button"
          onClick={handleGoogleMockLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-warm-bg hover:bg-warm-cream border border-warm-border text-warm-charcoal text-sm font-bold flex items-center justify-center gap-3 transition-colors shadow-sm hover:border-warm-muted"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17.4C3.7 21.1 7.5 24 12 24z" />
          </svg>
          Google Workspace Sign-In
        </button>
        <p className="text-[11px] text-center text-warm-muted mt-2">
          Note: Production Google OAuth requires GOOGLE_CLIENT_ID configuration.
        </p>

        <p className="text-center text-sm text-warm-muted mt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-forest-700 font-extrabold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/register', { full_name: fullName, email, password });
      // Redirect cleanly to login page with success notification
      navigate('/login', { state: { message: 'Account created successfully! Please sign in with your credentials.' } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-warm-bg">
      <div className="max-w-md w-full organic-card p-8 sm:p-10 shadow-soft-lg relative">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4 group">
            <img
              src="/assets/vericourse-logo.png"
              alt="VeriCourse AI"
              className="h-20 w-auto mx-auto object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h2 className="text-3xl font-extrabold text-forest-900 tracking-tight">Create an Account</h2>
          <p className="text-sm text-warm-muted mt-1.5 font-medium">Start investigating educational promises with real evidence</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-terracotta-light border border-terracotta/20 text-terracotta-dark text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-forest-900 mb-2">Full Name</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-warm-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-sm font-medium focus:border-forest-600 focus:bg-white focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-forest-900 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-warm-muted absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-sm font-medium focus:border-forest-600 focus:bg-white focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-forest-900 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-warm-muted absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-warm-bg border border-warm-border text-warm-charcoal placeholder-warm-muted text-sm font-medium focus:border-forest-600 focus:bg-white focus:outline-none transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-warm-muted hover:text-forest-900 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-sm shadow-forest-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 hover:scale-[1.01]"
          >
            {loading ? 'Creating Account...' : 'Register'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-warm-muted mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-forest-700 font-extrabold hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};
