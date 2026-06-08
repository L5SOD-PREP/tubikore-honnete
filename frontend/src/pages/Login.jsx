import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-12 items-center justify-center">
        <div className="max-w-md">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/30 rounded-full text-xs font-medium text-gray-200 mb-6">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              SwiftWheels Enterprises
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Promotion & Marketing<br />
              <span className="text-gray-300">Subsystem</span>
            </h2>
            <p className="text-gray-200 text-base leading-relaxed mb-8">
              Streamline your vehicle promotions, manage customer relationships, 
              and track campaign performance with ease.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                Vehicle & Customer Management
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                Promotion Campaigns & Discounts
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                Performance Reports & Analytics
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Login panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl shadow-lg shadow-gray-900/20 mb-4">
              <span className="text-white text-xl font-bold">P</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-400 mt-1">Sign in to your PMS account</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your username"
                    autoFocus
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your password"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} SwiftWheels Enterprises
          </p>
        </div>
      </div>
    </div>
  );
}
