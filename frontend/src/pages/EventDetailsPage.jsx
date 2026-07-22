import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EventRegistrationModal } from '../components/EventRegistrationModal';
import { Calendar, MapPin, Clock, Shirt, Users, ArrowLeft, Check, Sparkles } from 'lucide-react';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, registerForEvent, showToast } = useApp();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agenda'); // agenda, rules, faqs
  const [myRegs, setMyRegs] = useState([]);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);

  const reloadEventData = async () => {
    try {
      const { api } = await import('../services/api');
      const data = await api.getEvent(id);
      setEvent(data);
      if (user) {
        const regs = await api.getMyRegistrations();
        setMyRegs(regs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    reloadEventData().finally(() => setLoading(false));
  }, [id, user]);

  const handleRegister = () => {
    if (!user) {
      showToast('Please sign in to register for events', 'info');
      navigate('/auth?mode=login');
      return;
    }
    setRegistrationModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!event) return null;

  const isRegistered = myRegs.some(r => r.event_id === event.id && r.status !== 'cancelled');

  // Parse custom structures from seed database
  const parsedAgenda = event.agenda ? event.agenda.split('\n').filter(Boolean) : [];
  const parsedRules = event.rules ? event.rules.split('\n').filter(Boolean) : [];
  
  let parsedFaqs = [];
  try {
    parsedFaqs = event.faqs ? JSON.parse(event.faqs) : [];
  } catch (e) {
    parsedFaqs = [];
  }

  let parsedGallery = [];
  try {
    parsedGallery = event.gallery_images ? JSON.parse(event.gallery_images) : [];
  } catch (e) {
    parsedGallery = [];
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto relative z-10 text-left">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Banner Picture */}
            <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-slate-200/40 dark:border-white/5 shadow-xl">
              <img
                src={event.banner_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className={`font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-md text-white ${
                  event.is_private ? 'bg-amber-500 shadow-md' : 'bg-gradient-to-r from-primary to-secondary'
                }`}>
                  {event.is_private ? '👑 Private VIP Event' : 'Community Gathering'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white mt-3">{event.title}</h1>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">About the Event</h3>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Tab Details Section */}
            <div className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-md overflow-hidden">
              <div className="flex border-b border-slate-200/40 dark:border-slate-800/40 bg-slate-100/50 dark:bg-darkbg-card">
                {['agenda', 'rules', 'faqs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-center transition-all ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary bg-white/40 dark:bg-darkbg/40'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8 text-left">
                {activeTab === 'agenda' && (
                  <div className="space-y-4">
                    {parsedAgenda.length === 0 ? (
                      <p className="text-xs text-slate-400">No agenda details provided.</p>
                    ) : (
                      parsedAgenda.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.replace('- ', '')}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'rules' && (
                  <div className="space-y-4">
                    {parsedRules.length === 0 ? (
                      <p className="text-xs text-slate-400">No specific rules provided for this event.</p>
                    ) : (
                      parsedRules.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.replace('- ', '')}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div className="space-y-6">
                    {parsedFaqs.length === 0 ? (
                      <p className="text-xs text-slate-400">No FAQs uploaded yet.</p>
                    ) : (
                      parsedFaqs.map((faq, idx) => (
                        <div key={idx} className="space-y-2">
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">Q: {faq.q}</h4>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-4 border-l-2 border-primary/30 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            {parsedGallery.length > 0 && (
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-md">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Gallery Preview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {parsedGallery.map((url, idx) => (
                    <div key={idx} className="h-40 rounded-xl overflow-hidden shadow border border-slate-200/20 group relative">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info - Right Column (1/3 width) */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/20 dark:border-white/5 shadow-lg space-y-6 text-left sticky top-28">
              <h3 className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
                Event Logistics
              </h3>

              <div className="space-y-5">
                {/* Date */}
                <div className="flex gap-3 items-start text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Date</span>
                    <span className="mt-1 block font-bold">{formattedDate}</span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex gap-3 items-start text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Time</span>
                    <span className="mt-1 block font-bold">{event.time.substring(0, 5)} PM onwards</span>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex gap-3 items-start text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Venue</span>
                    <span className="mt-1 block font-bold leading-snug">{event.venue}</span>
                  </div>
                </div>

                {/* Dress Code */}
                <div className="flex gap-3 items-start text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Shirt className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Dress Code</span>
                    <span className="mt-1 block font-bold">{event.dress_code || 'Smart Casual'}</span>
                  </div>
                </div>

                {/* Seats Left */}
                <div className="flex gap-3 items-start text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <Users className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Available Seats</span>
                    <span className="mt-1 block font-bold">
                      {event.available_seats} <span className="text-slate-400 font-medium">/ {event.capacity} total slots</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Deadline Warn */}
              <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-[11px] font-bold text-rose-600 dark:text-rose-400">
                Deadline: Registration closes on{' '}
                {new Date(event.registration_deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>

              {/* Registration Trigger CTA */}
              {isRegistered ? (
                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 cursor-default flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Registered ✓
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || event.available_seats <= 0}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-95 shadow-lg shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {registering ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
                  ) : event.available_seats <= 0 ? (
                    'Sold Out / Fully Booked'
                  ) : (
                    'Confirm Spot Reservation'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Registration & Payment Modal */}
      <EventRegistrationModal
        event={event}
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        onSuccess={reloadEventData}
        onUpgradeClick={() => navigate('/dashboard')}
      />
    </div>
  );
};
