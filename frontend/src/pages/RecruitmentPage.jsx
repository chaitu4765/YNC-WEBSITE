import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ChevronRight, User, Mail, Phone, BookOpen, Layers, Award, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export const RecruitmentPage = () => {
  const { applyForRecruitment, user, showToast } = useApp();
  const [success, setSuccess] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.full_name || '',
      email: user?.email || '',
      phoneNumber: user?.phone_number || '',
    }
  });

  const domains = [
    "Technical Team",
    "Design Team",
    "Event Management",
    "Public Relations",
    "Marketing",
    "Photography",
    "Videography",
    "Social Media",
    "Sponsorship",
    "Content Writing"
  ];

  const onSubmit = async (data) => {
    if (!user) {
      showToast('Please login to apply for YCN Teams.', 'error');
      return;
    }
    
    setLoadingLocal(true);
    try {
      await applyForRecruitment(data);
      setSuccess(true);
      reset();
    } catch (err) {
      // Error handled in Context Toast
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen relative py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary dark:text-primary-light">Join the Core Team</span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mt-2">Join the YCN Team</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
          <p className="max-w-xl text-slate-500 dark:text-slate-400 mt-4 mx-auto text-sm font-semibold leading-relaxed">
            Help us organize amazing events, manage active student workstreams, and build an incredible youth networking community.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl p-8 border border-emerald-500/20 text-center shadow-2xl flex flex-col items-center justify-center py-16"
            >
              {/* Success Checkmark Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>

              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-6">Application Submitted!</h3>
              <p className="max-w-md text-slate-500 dark:text-slate-400 text-sm font-semibold mt-2.5 leading-relaxed">
                Thank you for applying. Our operations team will screen your response. We will update you via the notifications panel on your user dashboard.
              </p>

              <button
                onClick={() => setSuccess(false)}
                className="mt-8 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-md"
              >
                Apply for another domain
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-white/5 shadow-2xl text-left"
            >
              {!user && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>You must be signed in to submit this form. Your response will be mapped to your user profile.</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 1. PERSONAL INFORMATION */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Full Name</label>
                      <input
                        type="text"
                        {...register('fullName', { required: 'Full Name is required' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                      {errors.fullName && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.fullName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Email Address</label>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                      {errors.email && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.email.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Phone Number</label>
                      <input
                        type="tel"
                        {...register('phoneNumber', { required: 'Phone Number is required' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                      {errors.phoneNumber && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.phoneNumber.message}</p>}
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200/50 dark:border-slate-800/40" />

                {/* 2. ACADEMICS & DEPARTMENT */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Academic Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* College */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">College Name</label>
                      <input
                        type="text"
                        placeholder="Harvard University"
                        {...register('college', { required: 'College Name is required' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                      {errors.college && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.college.message}</p>}
                    </div>

                    {/* Department */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Department / Major</label>
                      <input
                        type="text"
                        placeholder="Computer Science"
                        {...register('department', { required: 'Department is required' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                      {errors.department && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.department.message}</p>}
                    </div>

                    {/* Year */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Current Study Year</label>
                      <select
                        {...register('year', { required: 'Please select your study year' })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      >
                        <option value="">Select Year</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="Graduated">PostGrad / Graduated</option>
                      </select>
                      {errors.year && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.year.message}</p>}
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200/50 dark:border-slate-800/40" />

                {/* 3. CORE DOMAIN INTEREST */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-4 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Domain Allocation
                  </h3>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500 pl-0.5">Interested Domain</label>
                    <select
                      {...register('domain', { required: 'Interested Domain is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                    >
                      <option value="">Select Domain Option</option>
                      {domains.map((dom, i) => (
                        <option key={i} value={dom}>{dom}</option>
                      ))}
                    </select>
                    {errors.domain && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.domain.message}</p>}
                  </div>
                </div>

                <hr className="border-slate-200/50 dark:border-slate-800/40" />

                {/* 4. DETAILS & PORTFOLIOS */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-4 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Portfolios & Skills
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Portfolio */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Portfolio Link</label>
                      <input
                        type="url"
                        placeholder="https://portfolio.com"
                        {...register('portfolioLink')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                    </div>

                    {/* GitHub */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">GitHub URL</label>
                      <input
                        type="url"
                        placeholder="https://github.com/profile"
                        {...register('githubLink')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">LinkedIn Profile</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/profile"
                        {...register('linkedinLink')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Skills */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Core Skills (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="React, CSS, Photoshop, Logistics"
                        {...register('skills')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                    </div>

                    {/* Experience */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-500 pl-0.5">Previous Experience Summary</label>
                      <input
                        type="text"
                        placeholder="Organized College Fest 2025, Freelance Designer"
                        {...register('previousExperience')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200/50 dark:border-slate-800/40" />

                {/* 5. MOTIVATION QUESTION */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 pl-0.5">Why do you want to join YCN?</label>
                  <textarea
                    rows={4}
                    placeholder="Write a brief explanation of how you want to contribute and what you hope to learn..."
                    {...register('explanation', { required: 'Please explain why you want to join' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                  {errors.explanation && <p className="text-[10px] text-rose-500 pl-0.5 font-bold">{errors.explanation.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loadingLocal || !user}
                  className="w-full py-3.5 px-4 rounded-xl border border-transparent text-sm font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loadingLocal ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Core Application <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
