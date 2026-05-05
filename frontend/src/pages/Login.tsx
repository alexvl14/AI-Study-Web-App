import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Identity API login endpoint
      await authApi.post('/login?useCookies=true', { email, password });
      
      // Get user info to update context
      const userInfo = await authApi.get('/manage/info');
      login(userInfo.data);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-surface-container-lowest font-body">
      {/* Left side - Decorative/Brand */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-container-lowest overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-xl">school</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-on-surface">StudyLM</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface leading-tight mb-6">
            Synthesize your <br/>
            <span className="text-primary bg-primary/10 px-2 rounded-lg">knowledge</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Upload your documents, interact with the AI, and let it generate a personalized study syllabus for you.
          </p>
        </div>

        {/* Abstract glowing background shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-tertiary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
        <div className="w-full max-w-md bg-white lg:bg-transparent rounded-3xl p-8 lg:p-0 shadow-2xl lg:shadow-none shadow-on-surface/5">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-on-surface">StudyLM</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-on-surface mb-2">Welcome back</h2>
            <p className="text-on-surface-variant font-medium">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm font-semibold flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Email address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface outline-none transition-all font-medium"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-on-surface">Password</label>
                <a href="#" className="text-sm font-bold text-primary hover:text-primary-container transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl py-3.5 pl-12 pr-4 text-on-surface outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-on-surface-variant font-medium text-sm">
            Don't have an account? <Link to="/register" className="font-bold text-primary hover:text-primary-container transition-colors ml-1">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
