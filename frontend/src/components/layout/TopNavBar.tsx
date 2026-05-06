import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopNavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-xl font-bold tracking-tighter text-blue-700 dark:text-blue-400">
          StudyLM
        </Link>
        <div className="hidden md:flex gap-6">
          <Link
            to="/dashboard"
            className={`font-manrope tracking-tight text-sm font-medium pb-1 ${
              location.pathname === '/dashboard'
                ? 'text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
            }`}
          >
            Dashboard
          </Link>
          <a href="#" className="font-manrope tracking-tight text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Library
          </a>
          <a href="#" className="font-manrope tracking-tight text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Research
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20" placeholder="Search knowledge..." type="text"/>
        </div>
        <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
        </button>
        <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant">settings</span>
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-8 w-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant/30 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUVo-i_rk9FrUm-ae7IIi4RaPGECsbFzQxrhs0TF5UJ7rS55GuJ_lWaghhufxNkTYduDSDyd6r_Golws6Ks7ClpCEsM7Xfq9YrekqmWdsBXAPW0z2lDLsBdQLCF11E6Q8rzo5Lav3Rm8BAtRiESF_V0-NFc9vZs2ae3u5DWahGSco1J7GED__G_bT3ZOpEr7Jw_JH4V2bYEKyUsvz7hKkCbeQd3wzVKjDj0UZ8a_-ypwqLs4RL2PPgNeHmjN3wEEKt6WvTyNWAMzkP"
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                <p className="text-sm font-bold text-on-surface truncate">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'My Account'}</p>
                <p className="text-xs text-on-surface-variant font-medium truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">person</span> Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">settings</span> Preferences
                </button>
              </div>
              <div className="py-1 border-t border-slate-100 dark:border-slate-800/50">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-error hover:bg-error/10 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
