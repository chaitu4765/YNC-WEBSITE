import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Bell, Menu, X, User as UserIcon, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isDark, toggleTheme, unreadCount, notifications, markNotificationRead } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [location]);

  const handleNavClick = (sectionId, path = '/') => {
    if (location.pathname !== '/') {
      navigate(path);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeNotifs = notifications.slice(0, 5);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 glass-navbar ${
        isScrolled
          ? 'py-3 shadow-md'
          : 'py-4 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.svg"
                alt="YNC Logo"
                className="w-9 h-9 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-extrabold tracking-widest text-slate-800 dark:text-white transition-opacity">
                YNC
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Events
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              About
            </button>
            <Link
              to="/recruitment"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Team Recruitment
            </Link>
            <button
              onClick={() => handleNavClick('footer')}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Utility / User section - Desktop */}
          <div className="hidden md:flex items-center gap-4">


            {user ? (
              <>
                {/* Notifications Icon & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                    title="Notifications"
                    className="p-2 rounded-xl bg-slate-200/40 hover:bg-slate-200/70 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/5 backdrop-blur-md relative transition-all hover:scale-105 hover:shadow-sm"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <>
                        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold text-white z-10 animate-pulse-subtle">
                          {unreadCount}
                        </span>
                        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full animate-ping opacity-75" />
                      </>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl border border-white/20 dark:border-white/5 shadow-2xl p-4 z-50 text-slate-800 dark:text-slate-200 animate-slide-in">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                        <h4 className="font-bold text-sm">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-primary/10 text-primary dark:text-primary-light px-2 py-0.5 rounded-full font-semibold">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                        {activeNotifs.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4">No notifications yet.</p>
                        ) : (
                          activeNotifs.map(n => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all text-xs ${
                                !n.is_read
                                  ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                                  : 'bg-transparent border-slate-100 dark:border-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-900/50'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`font-bold ${!n.is_read ? 'text-primary dark:text-primary-light' : 'text-slate-600 dark:text-slate-300'}`}>
                                  {n.title}
                                </span>
                                {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 mt-1 leading-snug">{n.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="text-center mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                        <Link to="/dashboard" className="text-xs font-bold text-primary dark:text-primary-light hover:underline">
                          View Dashboard
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    title="User Profile"
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-200/40 hover:bg-slate-200/70 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 transition-all border border-slate-200/50 dark:border-white/5 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                      {user.full_name ? user.full_name[0] : 'U'}
                    </div>
                    <span className="text-sm font-bold max-w-[100px] truncate">{user.full_name.split(' ')[0]}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl border border-white/20 dark:border-white/5 shadow-2xl p-3 z-50 animate-slide-in">
                      <div className="px-3 py-2 mb-2 border-b border-slate-200/50 dark:border-slate-800/50 text-left">
                        <p className="text-xs text-slate-400 leading-none">Logged in as</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate mt-1">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary dark:hover:bg-slate-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        User Dashboard
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-secondary hover:bg-secondary/5 dark:text-secondary-light dark:hover:bg-slate-900 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-550/10 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth?mode=login"
                  className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-95 transition-all shadow-md px-5 py-2 rounded-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="flex md:hidden items-center gap-3">


            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-200/40 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/5 backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card mx-4 mt-2 rounded-2xl border border-white/20 dark:border-white/5 shadow-2xl p-4 z-50 text-left flex flex-col gap-4 animate-slide-in">
          <button
            onClick={() => { setMobileMenuOpen(false); handleNavClick('home'); }}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 py-1"
          >
            Home
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); handleNavClick('events'); }}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 py-1"
          >
            Events
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); handleNavClick('about'); }}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 py-1"
          >
            About
          </button>
          <Link
            to="/recruitment"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 py-1"
          >
            Team Recruitment
          </Link>
          <button
            onClick={() => { setMobileMenuOpen(false); handleNavClick('footer'); }}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 py-1"
          >
            Contact
          </button>

          <hr className="border-slate-200/50 dark:border-slate-800/50" />

          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 py-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                  {user.full_name ? user.full_name[0] : 'U'}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Logged in as</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.email}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                User Dashboard
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-secondary dark:text-secondary-light"
                >
                  <ShieldAlert className="w-4.5 h-4.5" />
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 py-2 text-sm font-semibold text-rose-600"
              >
                <LogOut className="w-4.5 h-4.5" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/auth?mode=login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 py-2.5 rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary py-2.5 rounded-xl shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
