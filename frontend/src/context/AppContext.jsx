import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ycn_token'));
  const [isDark, setIsDark] = useState(false);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Initialize theme: Default to Light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('ycn_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('ycn_theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        localStorage.setItem('ycn_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        localStorage.setItem('ycn_theme', 'light');
      }
      return next;
    });
  };

  // Load initial data
  useEffect(() => {
    const loadSession = async () => {
      if (token) {
        try {
          localStorage.setItem('ycn_token', token);
          const userData = await api.getMe();
          setUser(userData);
          refreshNotifications();
        } catch (err) {
          console.error("Session restoration failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    loadSession();
    refreshEvents();
    refreshAnnouncements();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('ycn_token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.full_name}!`, 'success');
      return data.user;
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, phoneNumber, password) => {
    setLoading(true);
    try {
      const data = await api.register(fullName, email, phoneNumber, password);
      showToast('Registration successful! Please login.', 'success');
      return data;
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ycn_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const updated = await api.updateProfile(profileData);
      setUser(updated);
      showToast('Profile updated successfully!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  const refreshEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const refreshAnnouncements = async () => {
    try {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  };

  const refreshNotifications = async () => {
    if (!token) return;
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Failed to read notification:', err);
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      await api.registerEvent(eventId);
      showToast('Successfully registered for the event!', 'success');
      refreshEvents();
      refreshNotifications();
    } catch (err) {
      showToast(err.message || 'Event registration failed', 'error');
      throw err;
    }
  };

  const applyForRecruitment = async (recruitmentData) => {
    try {
      const data = await api.applyRecruitment(recruitmentData);
      showToast('Recruitment application submitted successfully!', 'success');
      refreshNotifications();
      return data;
    } catch (err) {
      showToast(err.message || 'Recruitment application failed', 'error');
      throw err;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppContext.Provider value={{
      user,
      token,
      isDark,
      events,
      announcements,
      notifications,
      unreadCount,
      loading,
      toasts,
      showToast,
      toggleTheme,
      login,
      register,
      logout,
      updateProfile,
      refreshEvents,
      refreshAnnouncements,
      refreshNotifications,
      markNotificationRead,
      registerForEvent,
      applyForRecruitment,
    }}>
      {children}

      {/* Dynamic Toast Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-in border backdrop-blur-md transition-all duration-300 ${
              t.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : t.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
            }`} />
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
