import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { UserDashboard } from './pages/UserDashboard';
import { RecruitmentPage } from './pages/RecruitmentPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const { loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const isDashboardOrAdmin = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/recruitment" element={<RecruitmentPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isDashboardOrAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
