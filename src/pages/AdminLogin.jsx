import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate brief loading
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="blueprint-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[150px]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="S-FIT Logo" className="h-16 w-auto object-contain mb-3" />
          <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-8 space-y-6 shadow-xl shadow-slate-100">
          <div>
            <h2 className="font-sans font-bold tracking-tight text-2xl text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to manage your product catalog.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
              </svg>
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label htmlFor="admin-username" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" className="block text-slate-600 text-xs font-mono uppercase tracking-wider mb-2">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-slate-400 text-xs font-mono">SFIT Internal Management System</p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
