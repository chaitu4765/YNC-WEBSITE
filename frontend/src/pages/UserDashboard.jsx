import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, AlertCircle, ArrowUpRight, Save, User as UserIcon, Phone, Globe, MessageSquare, Compass, ShieldCheck, Download, Award, Send, Crown, Lock } from 'lucide-react';

export const UserDashboard = () => {
  const { user, updateProfile, notifications, refreshNotifications, markNotificationRead, showToast } = useApp();
  
  const [greeting, setGreeting] = useState('Welcome');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  // Event states
  const [myRegs, setMyRegs] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);

  // Setup greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Pre-fill form when user state loads
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhoneNumber(user.phone_number || '');
      setBio(user.bio || '');
      setSkills(user.skills || '');
      setProfilePicture(user.profile_picture || '');
      
      try {
        const social = user.social_links ? JSON.parse(user.social_links) : {};
        setLinkedin(social.linkedin || '');
        setGithub(social.github || '');
        setTwitter(social.twitter || '');
      } catch (e) {
        setLinkedin('');
        setGithub('');
        setTwitter('');
      }
    }
  }, [user]);

  // Load user registrations history
  const loadRegs = async () => {
    if (user) {
      try {
        const { api } = await import('../services/api');
        const data = await api.getMyRegistrations();
        setMyRegs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRegs(false);
      }
    }
  };

  useEffect(() => {
    loadRegs();
    refreshNotifications();
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      await updateProfile({
        fullName,
        phoneNumber,
        bio,
        skills,
        profilePicture,
        socialLinks: { linkedin, github, twitter }
      });
      setProfileModalOpen(false);
    } catch (err) {
      // Toast handles error
    } finally {
      setEditing(false);
    }
  };

  const registeredEvents = myRegs.filter(r => r.status === 'registered');
  const completedEvents = myRegs.filter(r => r.status === 'attended');
  const certificatesCount = completedEvents.filter(r => r.certificate_url).length;

  const formattedJoinDate = user?.join_date
    ? new Date(user.join_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'July 2026';

  return (
    <div className="min-h-screen py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto relative z-10 text-left">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              {greeting}, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Member ID: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{user?.member_id}</span> • Member since {formattedJoinDate}
            </p>
          </div>
          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Update Profile Credentials
          </button>
        </div>

        {/* Stats Grid Dashboard widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered</span>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{myRegs.length}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400">Upcoming Events</span>
            <p className="text-2xl font-black text-primary dark:text-primary-light mt-1">{registeredEvents.length}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400">Events Completed</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{completedEvents.length}</p>
          </div>
          <div className="glass-card p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400">Certificates Earned</span>
            <p className="text-2xl font-black text-secondary-light mt-1">{certificatesCount}</p>
          </div>
        </div>

        {/* Two Column Layout (Card Column + History Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card & Editor Details Column */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-lg p-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2 mt-2 text-center">Your Digital ID Card</h3>
              <DigitalIdCard user={user} onClick={() => setProfileModalOpen(true)} />
            </div>

            {/* Premium Membership Upgrade Banner */}
            {user?.membership_tier !== 'premium' ? (
              <div className="glass-card rounded-2xl p-4 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-primary/10 border border-amber-500/30 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500 animate-bounce" /> Premium VIP Membership
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    $9.99 / yr
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-snug">
                  Unlock 15% off all event tickets, early access booking, and exclusive access to private events!
                </p>
                <button
                  onClick={async () => {
                    try {
                      const { api } = await import('../services/api');
                      const updatedUser = await api.upgradeMembership();
                      setUser(updatedUser);
                      showToast('🎉 Upgraded to YNC Premium VIP Membership!', 'success');
                    } catch (err) {
                      showToast(err.message || 'Upgrade failed', 'error');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 mt-1"
                >
                  <Crown className="w-4 h-4" /> Upgrade to VIP Membership
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-4 bg-amber-500/10 border border-amber-500/30 text-left flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md">
                  👑
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Premium VIP Active</h4>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">15% Ticket Discounts & Private Events Unlocked</p>
                </div>
              </div>
            )}

            {/* Profile Bio Details */}
            <div className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-lg p-6 text-left space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                User Profile Bio
              </h3>
              
              <div className="space-y-3">
                {user?.bio ? (
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{user.bio}"
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">No biography written yet.</p>
                )}

                {user?.skills && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Skills</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {user.skills.split(',').map((skill, i) => (
                        <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary dark:text-primary-light rounded-full uppercase">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Social Links</span>
                  <div className="flex gap-2">
                    {linkedin ? (
                      <a href={linkedin} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
                        LinkedIn <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : null}
                    {github ? (
                      <a href={github} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-0.5 ml-2">
                        GitHub <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : null}
                    {!linkedin && !github && <p className="text-xs text-slate-400">No social portfolios linked.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History & Notifications Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Participation History */}
            <div className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-lg p-6 text-left">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-200/40 dark:border-slate-800/40 pb-3 mb-4">
                Event Participation History
              </h3>

              <div className="space-y-4">
                {loadingRegs ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                ) : myRegs.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-bold">You haven't registered for any events yet.</p>
                    <Link to="/" className="text-xs font-bold text-primary mt-2 inline-block hover:underline">
                      Explore Upcoming Events
                    </Link>
                  </div>
                ) : (
                  myRegs.map(reg => (
                    <div
                      key={reg.id}
                      className="p-4 rounded-2xl bg-slate-100/50 dark:bg-darkbg-card border border-slate-200/20 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:scale-[1.01] transition-transform"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                          {reg.event?.title || 'Community Event'}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                          {reg.event?.date ? new Date(reg.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date'} • {reg.event?.venue}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {reg.status === 'registered' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary dark:text-primary-light">
                              <Compass className="w-3.5 h-3.5" /> Booked Spot
                            </span>
                          ) : reg.status === 'attended' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Attended Event
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                              <AlertCircle className="w-3.5 h-3.5" /> Cancelled
                            </span>
                          )}

                          {reg.amount_paid !== undefined && reg.amount_paid > 0 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              Paid: ${Number(reg.amount_paid).toFixed(2)}
                            </span>
                          )}

                          {reg.discount_applied > 0 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                              10% Referral Discount
                            </span>
                          )}
                        </div>
                        {reg.payment_id && (
                          <p className="text-[10px] font-mono font-bold text-slate-400 mt-1.5">
                            Ref ID: {reg.payment_id}
                          </p>
                        )}
                      </div>

                      {reg.status === 'attended' && reg.certificate_url && (
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert("Mock download: Digital certificate successfully retrieved!"); }}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 dark:text-emerald-400 transition-colors"
                        >
                          <Award className="w-4 h-4" /> Download Certificate
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifications panel */}
            <div className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-lg p-6 text-left">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-200/40 dark:border-slate-800/40 pb-3 mb-4">
                Notifications Panel
              </h3>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">No recent community logs or updates.</p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        !notif.is_read
                          ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                          : 'bg-transparent border-slate-200/25 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${!notif.is_read ? 'text-primary dark:text-primary-light' : 'text-slate-600 dark:text-slate-300'}`}>
                          {notif.title}
                        </span>
                        {!notif.is_read && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug font-semibold">{notif.content}</p>
                      <span className="text-[9px] text-slate-400 mt-2 block font-medium">
                        {new Date(notif.created_at).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Editor Modal Overlay */}
      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileModalOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto z-10 text-left relative"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" /> Edit Profile Credentials
              </h3>

              <form onSubmit={handleProfileSave} className="space-y-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                </div>

                {/* Profile Picture */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Profile Picture URL</label>
                  <input
                    type="url"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="https://images.com/avatar.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Biography / Quote</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Skills (Comma separated list)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Marketing, Photography"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                </div>

                {/* Socials */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">LinkedIn URL</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-500">GitHub URL</label>
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editing}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {editing ? 'Saving...' : <><Save className="w-4 h-4" /> Save Profile</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
