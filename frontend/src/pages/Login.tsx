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
      await authApi.post('/login?useCookies=true', { email, password });
      const userInfo = await authApi.get('/manage/info');
      login(userInfo.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">

      {/* Left — Brand panel */}
      <div className="hidden lg:flex w-1/2 bg-surface-container-low relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 crosshatch-bg opacity-5" />

        <Link to="/">
          <span className="font-serif font-bold text-headline-md text-primary relative z-10">StudyLM</span>
        </Link>

        <div className="relative z-10 max-w-sm">
          <div className="w-10 h-px bg-on-surface mb-8" />
          <h1 className="font-serif text-display-lg-mobile text-on-surface leading-tight mb-6">
            Welcome<br />back, scholar.
          </h1>
          <p className="font-sans text-body-lg text-on-surface-variant leading-relaxed mb-10">
            Your documents, your AI assistant, your personalized study roadmap — all in one place.
          </p>
          <div className="flex flex-col gap-3">
            {['AI-powered document chat', 'Personalized study syllabus', 'Adaptive quiz generation'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-4 h-4 etched-border bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: '10px' }}>check</span>
                </div>
                <span className="font-sans text-sm text-on-surface-variant">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="border-t border-dashed border-outline-variant mb-4" />
          <p className="font-sans text-xs text-outline uppercase tracking-widest">Powered by StudyLM Engine</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <div className="lg:hidden mb-10">
          <Link to="/"><span className="font-serif font-bold text-headline-md text-primary">StudyLM</span></Link>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white etched-border shadow-hard-lg p-10">
            <span className="font-sans font-bold text-xs uppercase tracking-widest text-primary">Account Access</span>
            <h2 className="font-serif text-headline-lg text-on-surface mt-2 mb-8">Sign In</h2>

            {error && (
              <div className="mb-6 p-4 bg-error-container etched-border flex items-start gap-3">
                <span className="material-symbols-outlined text-on-error-container text-lg shrink-0">error</span>
                <p className="font-sans text-sm font-semibold text-on-error-container">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full etched-border bg-surface-container-lowest py-3 px-4 font-sans text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-sans font-bold text-xs uppercase tracking-widest text-on-surface-variant">
                    Password
                  </label>
                  <a href="#" className="font-sans text-xs text-primary hover:underline transition-colors">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full etched-border bg-surface-container-lowest py-3 px-4 font-sans text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-container text-on-primary-container etched-border shadow-hard btn-press py-3.5 font-sans font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant text-center">
              <p className="font-sans text-sm text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-primary hover:underline">
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
