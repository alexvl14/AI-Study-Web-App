import { Link, useLocation } from 'react-router-dom';

export default function TopNavBar() {
  const location = useLocation();

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
        <div className="h-8 w-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant/30 shrink-0">
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUVo-i_rk9FrUm-ae7IIi4RaPGECsbFzQxrhs0TF5UJ7rS55GuJ_lWaghhufxNkTYduDSDyd6r_Golws6Ks7ClpCEsM7Xfq9YrekqmWdsBXAPW0z2lDLsBdQLCF11E6Q8rzo5Lav3Rm8BAtRiESF_V0-NFc9vZs2ae3u5DWahGSco1J7GED__G_bT3ZOpEr7Jw_JH4V2bYEKyUsvz7hKkCbeQd3wzVKjDj0UZ8a_-ypwqLs4RL2PPgNeHmjN3wEEKt6WvTyNWAMzkP"
          />
        </div>
      </div>
    </nav>
  );
}
