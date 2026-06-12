import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SideNavBarProps {
  onNewNotebook?: () => void;
}

export default function SideNavBar({ onNewNotebook }: SideNavBarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: 'folder_open', label: 'Notebooks', href: '/dashboard' },
    { icon: 'history',     label: 'Recent',    href: '#' },
    { icon: 'inventory_2', label: 'Archive',   href: '#' },
    { icon: 'delete',      label: 'Trash',     href: '#' },
  ];

  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-72px)] sticky top-[72px] w-64 shrink-0 bg-surface-container-low border-r border-outline z-40 py-unit px-4 space-y-4">

      {/* Header */}
      <div className="px-2 py-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
          <h2 className="font-serif text-headline-md text-on-surface">Research Desk</h2>
        </div>
      </div>

      {/* New Notebook */}
      <button
        onClick={onNewNotebook}
        className="w-full py-3 px-4 bg-primary-container text-on-primary-container font-sans font-bold text-label-md etched-border shadow-hard btn-press text-left flex items-center justify-between transition-all"
      >
        New Notebook
        <span>→</span>
      </button>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon, label, href }) => {
          const isActive = href !== '#' && location.pathname === href;
          return (
            <Link
              key={label}
              to={href}
              className={`flex items-center gap-3 px-4 py-3 font-sans text-label-md transition-all ${
                isActive
                  ? 'bg-primary-container text-on-primary-container border-l-4 border-primary font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="border-t border-outline-variant pt-4 space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 font-sans text-label-md text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined">help</span>
          Help
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 font-sans text-label-md text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
