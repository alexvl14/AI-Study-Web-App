import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopNavBar() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-outline shadow-hard">
      <div className="flex justify-between items-center px-6 md:px-margin-desktop py-4 max-w-max-width mx-auto">

        {/* Left: logo + nav */}
        <div className="flex items-center gap-10">
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <span className="font-serif font-bold text-headline-md text-primary">
              StudyLM
            </span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex gap-6">
              <Link
                to="/dashboard"
                className={`font-sans text-label-md transition-colors pb-1 ${
                  location.pathname === '/dashboard'
                    ? 'text-primary border-b-2 border-primary translate-y-0.5'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
              <a className="font-sans text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
                Library
              </a>
              <a className="font-sans text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
                Flashcards
              </a>
              <a className="font-sans text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">
                Community
              </a>
            </nav>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="font-sans text-label-md text-on-surface hover:text-primary transition-colors px-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary-container text-on-primary-container etched-border shadow-hard btn-press transition-all font-sans font-semibold text-label-md px-6 py-2"
              >
                Get Started →
              </Link>
            </>
          ) : (
            <>
              <button
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all"
                aria-label="Settings"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full etched-border bg-primary-container text-on-primary-container font-bold text-sm flex items-center justify-center focus:outline-none"
                  aria-label="Profile menu"
                >
                  {initials}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white etched-border shadow-hard py-2 z-50">
                    <div className="px-4 py-3 border-b border-outline-variant">
                      <p className="font-sans font-bold text-sm text-on-surface truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}` : 'My Account'}
                      </p>
                      <p className="font-sans text-xs text-on-surface-variant truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2.5 font-sans text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-lg">person</span>
                        Profile
                      </button>
                      <button className="w-full text-left px-4 py-2.5 font-sans text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-lg">settings</span>
                        Preferences
                      </button>
                    </div>
                    <div className="py-1 border-t border-outline-variant">
                      <button
                        onClick={() => { setIsDropdownOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2.5 font-sans text-sm font-bold text-error hover:bg-error-container flex items-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
