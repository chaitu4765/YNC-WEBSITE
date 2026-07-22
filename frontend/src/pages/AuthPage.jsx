import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, Phone, CheckCircle, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const { login, register, user, loading } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Reset form on mode change
  useEffect(() => {
    reset();
  }, [mode, reset]);

  const onSubmit = async (data) => {
    if (mode === 'login') {
      try {
        await login(data.email, data.password);
        navigate('/dashboard');
      } catch (err) {
        // Handled in Context Toast
      }
    } else {
      if (data.password !== data.confirmPassword) {
        return;
      }
      try {
        await register(data.fullName, data.email, data.phoneNumber, data.password);
        // Switch to login
        navigate('/auth?mode=login');
      } catch (err) {
        // Handled in Context Toast
      }
    }
  };

  const passwordVal = watch('password');

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src="/logo.svg"
              alt="YNC Logo"
              className="w-12 h-12 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-extrabold tracking-widest text-slate-800 dark:text-white">
              YNC
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-4">
            {mode === 'login' ? 'Sign in to your account' : 'Create your community account'}
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1.5">
            Youth Networking Community Management System
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-3xl p-8 border border-white/30 dark:border-white/5 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'register' ? (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-1">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...registerField('fullName', { required: 'Full Name is required' })}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-darkbg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-white"
                      />
                    </div>
                    {errors.fullName && <p className="text-[10px] text-rose-500 pl-1 font-bold">{errors.fullName.message}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-1">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        placeholder="+919876543210"
                        {...registerField('phoneNumber', {
                          required: 'Phone Number is required',
                          pattern: {
                            value: /^[0-9\s+-.()]{10,15}$/,
                            message: 'Invalid phone number format',
                          },
                        })}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-darkbg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-white"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-[10px] text-rose-500 pl-1 font-bold">{errors.phoneNumber.message}</p>}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Email (Always visible) */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  {...registerField('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-darkbg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-white"
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 pl-1 font-bold">{errors.email.message}</p>}
            </div>

            {/* Password (Always visible) */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerField('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-darkbg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-white"
                />
              </div>
              {errors.password && <p className="text-[10px] text-rose-500 pl-1 font-bold">{errors.password.message}</p>}
            </div>

            {/* Confirm Password (Register mode only) */}
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="confirm-password"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1 text-left overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-1">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerField('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === passwordVal || 'Passwords do not match',
                      })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-darkbg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 dark:text-white"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-rose-500 pl-1 font-bold">{errors.confirmPassword.message}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Remember Me / Forgot Password (Login mode only) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center text-slate-500 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-1.5 h-4 w-4 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-darkbg rounded-md"
                  />
                  Remember Me
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Feature coming soon! Contact support."); }} className="text-primary dark:text-primary-light hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-transparent text-sm font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-95 transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <Link to="/auth?mode=register" className="text-primary dark:text-primary-light hover:underline font-bold">
                  Register here
                </Link>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <Link to="/auth?mode=login" className="text-primary dark:text-primary-light hover:underline font-bold">
                  Sign in here
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
