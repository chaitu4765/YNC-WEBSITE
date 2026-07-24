import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from '../components/CountdownTimer';
import { EventRegistrationModal } from '../components/EventRegistrationModal';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Shirt, Check, ArrowRight, Sparkles, Award, Users, Lightbulb, Compass, Heart } from 'lucide-react';

export const LandingPage = () => {
  const { events, user, registerForEvent, showToast, refreshEvents } = useApp();
  const navigate = useNavigate();

  const [selectedEventForModal, setSelectedEventForModal] = useState(null);

  // Find Featured Event
  const featuredEvent = events.find(e => e.is_featured) || events.find(e => e.title === 'PROM NIGHT 2026') || events[0];
  // Remaining events
  const otherEvents = events.filter(e => e.id !== featuredEvent?.id);

  const [myRegs, setMyRegs] = useState([]);

  const refreshMyRegs = async () => {
    try {
      const { api } = await import('../services/api');
      const data = await api.getMyRegistrations();
      setMyRegs(data);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    refreshEvents();
  }, []);

  React.useEffect(() => {
    if (user) {
      refreshMyRegs();
    }
  }, [user, events]);

  const userRegisteredEventIds = myRegs.map(r => r.event_id);

  const handleRegisterClick = (eventId) => {
    if (!user) {
      showToast('Please sign in to register for events', 'info');
      navigate('/auth?mode=login');
      return;
    }
    const ev = events.find(e => e.id === eventId);
    if (ev) {
      setSelectedEventForModal(ev);
    }
  };

  const handleJoinCommunityClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?mode=register');
    }
  };

  const whatsIncluded = [
    { text: 'Live DJ Set (DJ Pulse)', desc: 'Pumping the latest billboard hits and dance tracks.' },
    { text: 'Gourmet Food & Drinks', desc: 'Delicious multi-cuisine dinner buffet and mocktails.' },
    { text: 'Red Carpet Photo Booth', desc: 'Get formal high-resolution pictures clicked.' },
    { text: 'Interactive Stage Games', desc: 'Exciting team icebreakers with gifts.' },
    { text: 'Decorated Dance Floor', desc: 'Professional strobe lights and balloons.' },
    { text: 'King & Queen Coronation', desc: 'Crown voting based on entries.' },
  ];

  const aboutCards = [
    { title: 'Networking', icon: Users, color: 'from-blue-500 to-indigo-500', desc: 'Establish life-long connections with peer students, professionals, and recruiters.' },
    { title: 'Leadership', icon: Award, color: 'from-purple-500 to-pink-500', desc: 'Hone administrative capabilities by spearheading large-scale regional event operations.' },
    { title: 'Innovation', icon: Lightbulb, color: 'from-cyan-500 to-teal-500', desc: 'Collaborate on technology hackathons, AI workshops, and research blueprints.' },
    { title: 'Collaboration', icon: Compass, color: 'from-amber-500 to-orange-500', desc: 'Bridge different campus domains together, cultivating a diverse project ecosystem.' },
    { title: 'Community Building', icon: Heart, color: 'from-emerald-500 to-teal-500', desc: 'Form tight-knit social bonds, promoting inclusive growth, mental health, and mentorship.' }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div id="home" className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary dark:text-primary-light mb-6 uppercase tracking-widest animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Empowering Tomorrow's Leaders
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
              Welcome to{' '}
              <span className="text-red-500 dark:text-red-400 font-black">
                YNC
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-slate-600 dark:text-slate-300 mt-3 tracking-wide">
              Youth Networking Community
            </p>
            <p className="max-w-2xl text-slate-500 dark:text-slate-400 mt-6 text-base sm:text-lg font-medium leading-relaxed">
              A premium, interactive platform where students and young professionals connect, learn, collaborate, and grow through exciting events, workshops, networking opportunities, and leadership initiatives.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
              <button
                onClick={handleJoinCommunityClick}
                className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-500 shadow-lg shadow-red-500/25 hover:shadow-red-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Join Community
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#events"
                className="px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-white/60 dark:bg-darkbg-card border border-slate-200/50 dark:border-white/5 shadow-md hover:bg-slate-100 dark:hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Explore Events
              </a>
            </div>
          </motion.div>
        </div>

        {/* Diagonal Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-slate-50 dark:fill-slate-950 transition-colors duration-300">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.05,115.65,183.15,118.52,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. FEATURED EVENT: PROM NIGHT 2026 */}
      {featuredEvent && (
        <section id="events" className="py-20 bg-slate-50 dark:bg-slate-950 relative z-10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary dark:text-primary-light">Featured Event</span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mt-2">PROM NIGHT 2026</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
            </div>

            {/* Prom Layout Card */}
            <div className="glass-card rounded-3xl border border-white/30 dark:border-white/5 shadow-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative overflow-hidden glass-shine">
              {/* Event Poster Banner */}
              <div className="relative group overflow-hidden rounded-2xl border border-slate-200/40 dark:border-white/5 shadow-lg h-72 sm:h-96">
                <img
                  src={featuredEvent.banner_url || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600"}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="bg-rose-500 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md">
                    Limited Seats Left
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">{featuredEvent.title}</h3>
                  <p className="text-xs font-semibold text-slate-300 mt-1">{featuredEvent.venue}</p>
                </div>
              </div>

              {/* Event Content info */}
              <div className="text-left flex flex-col justify-between h-full space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    {featuredEvent.description}
                  </p>

                  {/* Metadata Row Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-6 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(featuredEvent.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>{featuredEvent.time.substring(0, 5)} PM onwards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="truncate">{featuredEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-rose-400" />
                      <span className="truncate">{featuredEvent.dress_code || 'Formal'}</span>
                    </div>
                  </div>
                </div>

                {/* Countdown display */}
                <div className="py-4 border-y border-slate-200/50 dark:border-slate-800/40">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-center text-slate-400 mb-2">Countdown to Glamour</p>
                  <CountdownTimer targetDate={`${featuredEvent.date}T${featuredEvent.time}`} />
                </div>

                {/* Register Button */}
                <div className="flex items-center justify-end gap-4 flex-wrap w-full">
                  {userRegisteredEventIds.includes(featuredEvent.id) ? (
                    <button
                      disabled
                      className="px-6 py-3.5 rounded-xl text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 cursor-default flex items-center gap-2"
                    >
                      <Check className="w-4.5 h-4.5" />
                      Registered ✓
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        to={`/events/${featuredEvent.id}`}
                        className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-darkbg dark:hover:bg-slate-800 transition-colors flex items-center"
                      >
                        View Details
                      </Link>
                      <button
                        disabled
                        className="px-6 py-3 rounded-xl text-xs font-bold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 cursor-not-allowed flex items-center gap-1.5"
                      >
                        <Clock className="w-4 h-4 text-secondary" /> Registrations Opening Soon
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Whats Included sub-section */}
            <div className="mt-16 text-left">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6">What's Included in Your Ticket</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {whatsIncluded.map((item, idx) => (
                  <div key={idx} className="glass-card p-5 rounded-2xl border border-white/20 dark:border-white/5 hover:border-primary/20 transition-all flex items-start gap-4 shadow-sm group hover:scale-[1.01]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.text}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. ABOUT YCN MISSION */}
      <section id="about" className="py-20 border-t border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary dark:text-primary-light">Our Foundations</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mt-2">Why Join YCN?</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
            <p className="max-w-2xl text-slate-500 dark:text-slate-400 mt-4 mx-auto text-sm font-semibold leading-relaxed">
              We empower youth by cultivating networking relationships, developing leadership instincts, encouraging tech projects, and supporting community bonding.
            </p>
          </div>

          {/* Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {aboutCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="glass-card p-6 rounded-3xl border border-white/20 dark:border-white/5 relative overflow-hidden flex flex-col justify-between hover:scale-[1.03] transition-transform shadow-lg hover:shadow-xl group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md group-hover:scale-115 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="text-left mt-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{card.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 4. OTHER COMMUNITY EVENTS LIST */}
      {otherEvents.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/40 relative z-10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary dark:text-primary-light font-semibold">More Activities</span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mt-2">Upcoming Events</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherEvents.map(event => (
                <div
                  key={event.id}
                  className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-xl hover:shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] text-left group"
                >
                  {/* Banner */}
                  <div className="h-48 overflow-hidden relative border-b border-slate-200/20">
                    <img
                      src={event.banner_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {event.is_private && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
                        👑 VIP Private
                      </div>
                    )}

                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex flex-col gap-2 mt-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span>{event.time.substring(0, 5)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/40 pt-4">
                      <Link
                        to={`/events/${event.id}`}
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light"
                      >
                        View Details
                      </Link>

                      {userRegisteredEventIds.includes(event.id) ? (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                        >
                          Registered ✓
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 cursor-not-allowed flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5 text-secondary" /> Opening Soon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Registration & Payment Modal */}
      <EventRegistrationModal
        event={selectedEventForModal}
        isOpen={!!selectedEventForModal}
        onClose={() => setSelectedEventForModal(null)}
        onSuccess={() => refreshMyRegs()}
        onUpgradeClick={() => navigate('/dashboard')}
      />
    </div>
  );
};
