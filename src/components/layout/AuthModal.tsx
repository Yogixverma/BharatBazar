import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Lock, Mail, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await loginWithEmail(email, password);
      } else if (authModalMode === 'register') {
        if (!name.trim()) {
          setError('Please provide your full name');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, name);
      } else if (authModalMode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset link sent to your email address!');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Authentication error';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        msg = 'Invalid email or password. Please try again.';
      } else if (msg.includes('email-already-in-use')) {
        msg = 'An account with this email already exists. Please log in.';
      } else if (msg.includes('weak-password')) {
        msg = 'Password should be at least 6 characters long.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border border-gray-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 font-bold text-2xl tracking-tight text-gray-900">
            <span className="text-amber-500">Bharat</span>
            <span className="text-slate-900">Bazaar</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full border border-amber-200">
              .in
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {authModalMode === 'login' && 'Sign in to access your orders, cart & wishlist'}
            {authModalMode === 'register' && 'Create your free BharatBazaar account'}
            {authModalMode === 'forgot' && 'Reset your account password'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First and last name"
                  className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-xs text-amber-700 hover:text-amber-800 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-amber-400 hover:bg-amber-500 active:bg-amber-600 py-2.5 px-4 text-sm font-semibold text-gray-900 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Please wait...' : authModalMode === 'login' ? 'Sign In' : authModalMode === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Divider */}
        {authModalMode !== 'forgot' && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-400 uppercase tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-2xs hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Account</span>
            </button>
          </>
        )}

        {/* Footer switch */}
        <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
          {authModalMode === 'login' ? (
            <p>
              New to BharatBazaar?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="text-amber-700 hover:text-amber-800 font-semibold underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-amber-700 hover:text-amber-800 font-semibold underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
