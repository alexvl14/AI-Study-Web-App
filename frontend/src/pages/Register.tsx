import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      // ASP.NET Core Identity register endpoint. 
      // We pass fullName in case you customized the backend to accept it.
      await authApi.post('/register', { 
        email, 
        password,
        fullName: `${firstName} ${lastName}`.trim()
      });
      
      // Auto login after registration
      await authApi.post('/login?useCookies=true', { email, password });
      const userInfo = await authApi.get('/manage/info');
      login(userInfo.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-surface-container-lowest font-body">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10 order-2 lg:order-1">
        <div className="w-full max-w-md bg-white lg:bg-transparent rounded-3xl p-8 lg:p-0 shadow-2xl lg:shadow-none shadow-on-surface/5">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-on-surface">StudyLM</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-on-surface mb-2">Create an account</h2>
            <p className="text-on-surface-variant font-medium">Start accelerating your learning journey today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm font-semibold flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">First name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">person</span>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl py-3 pl-11 pr-4 text-on-surface outline-none transition-all font-medium text-sm"
                    placeholder="Jane"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Last name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl py-3 px-4 text-on-surface outline-none transition-all font-medium text-sm"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Email address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">mail</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl py-3 pl-11 pr-4 text-on-surface outline-none transition-all font-medium text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-lg">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl py-3 pl-11 pr-4 text-on-surface outline-none transition-all font-medium text-sm"
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-2 font-medium">Must be at least 6 characters long.</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-on-surface-variant font-medium text-sm">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:text-primary-container transition-colors ml-1">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative/Brand */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-container overflow-hidden flex-col justify-end p-12 order-1 lg:order-2">
        <div className="absolute top-12 right-12 z-10 flex items-center gap-3">
          <span className="font-extrabold text-2xl tracking-tight text-on-surface">StudyLM</span>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-xl">school</span>
          </div>
        </div>

        {/* Floating cards abstract representation */}
        <div className="relative z-10 w-full max-w-lg mb-20 ml-auto mr-0">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 mb-[-40px] relative z-0 border border-white/50">
            <div className="w-1/3 h-3 bg-surface-container-highest rounded-full mb-4"></div>
            <div className="w-3/4 h-2 bg-surface-container-highest rounded-full mb-2"></div>
            <div className="w-1/2 h-2 bg-surface-container-highest rounded-full"></div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-2xl transform rotate-[2deg] hover:rotate-0 transition-transform duration-500 relative z-10 border border-primary/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface">Smart Syllabus</h3>
                <p className="text-sm text-on-surface-variant">Generated 2 mins ago</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div className="h-2 flex-1 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_unchecked</span>
                <div className="h-2 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract glowing background shapes */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>
    </div>
  );
}
