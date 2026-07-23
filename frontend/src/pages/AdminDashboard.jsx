import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MonthlyRegistrationsChart, DomainRecruitmentChart, EventParticipationGrid } from '../components/CustomCharts';
import { 
  Users, Calendar, Sparkles, FolderHeart, CheckSquare, Megaphone, 
  Trash2, Edit, Plus, UserX, UserCheck, Check, X, FileSpreadsheet, Search, Filter,
  ArrowUpRight, Send
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, showToast } = useApp();
  const navigate = useNavigate();

  // Route control
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      showToast('Access denied: Admins only', 'error');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, events, members, registrations, recruitment, announcements

  // Data states
  const [metrics, setMetrics] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [recruitment, setRecruitment] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('');

  // Event modal/editor states
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '', description: '', banner_url: '', venue: '',
    date: '', time: '', capacity: 100, ticket_price: 0.0, registration_deadline: '',
    dress_code: '', status: 'published', is_featured: false, is_private: false, early_access_until: '', agenda: '', rules: '', faqs: '[]'
  });

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const { api } = await import('../services/api');
      const metricsData = await api.getAdminMetrics();
      setMetrics(metricsData);
      
      const eventsData = await api.getEvents();
      setEvents(eventsData);
      
      const regsData = await api.getAdminRegistrations();
      setRegistrations(regsData);
      
      const recruitData = await api.getAdminRecruitment();
      setRecruitment(recruitData);
      
      const membersData = await api.getAdminMembers();
      setMembers(membersData);
    } catch (e) {
      console.error(e);
      showToast('Error syncing admin databases', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // --- ACTIONS ---

  // Event Edit/Create
  const handleOpenEventModal = (ev = null) => {
    if (ev) {
      setEditingEvent(ev);
      setEventForm({
        title: ev.title,
        description: ev.description,
        banner_url: ev.banner_url || '',
        venue: ev.venue,
        date: ev.date,
        time: ev.time,
        capacity: ev.capacity,
        ticket_price: ev.ticket_price || 0.0,
        registration_deadline: ev.registration_deadline,
        dress_code: ev.dress_code || '',
        status: ev.status,
        is_featured: ev.is_featured || false,
        is_private: ev.is_private || false,
        early_access_until: ev.early_access_until || '',
        agenda: ev.agenda || '',
        rules: ev.rules || '',
        faqs: ev.faqs || '[]'
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '', description: '', banner_url: '', venue: '',
        date: '', time: '', capacity: 100, ticket_price: 0.0, registration_deadline: '',
        dress_code: '', status: 'published', is_featured: false, is_private: false, early_access_until: '', agenda: '', rules: '', faqs: '[]'
      });
    }
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      const { api } = await import('../services/api');
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, eventForm);
        showToast('Event updated successfully', 'success');
      } else {
        await api.createEvent(eventForm);
        showToast('New event created and published', 'success');
      }
      setEventModalOpen(false);
      loadAdminData();
    } catch (err) {
      showToast('Failed to save event', 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const { api } = await import('../services/api');
        await api.deleteEvent(id);
        showToast('Event deleted', 'info');
        loadAdminData();
      } catch (e) {
        showToast('Failed to delete event', 'error');
      }
    }
  };

  // Mark Attendance
  const handleAttendance = async (regId, status) => {
    try {
      const { api } = await import('../services/api');
      await api.updateAttendance(regId, status);
      showToast('Attendance logged', 'success');
      loadAdminData();
    } catch (e) {
      showToast('Error updating attendance', 'error');
    }
  };

  // Accept/Reject Recruits
  const handleRecruitment = async (appId, status) => {
    try {
      const { api } = await import('../services/api');
      await api.updateRecruitmentStatus(appId, status);
      showToast(`Application ${status.toUpperCase()} logged`, 'success');
      loadAdminData();
    } catch (e) {
      showToast('Error updating application', 'error');
    }
  };

  // Toggle user active / suspended
  const handleToggleMember = async (memberId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const { api } = await import('../services/api');
      await api.toggleMemberStatus(memberId, nextStatus);
      showToast(`Member account is now ${nextStatus}`, 'info');
      loadAdminData();
    } catch (e) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Deport this member permanently? This deletes all registered histories.')) {
      try {
        const { api } = await import('../services/api');
        await api.deleteMember(memberId);
        showToast('Member removed', 'info');
        loadAdminData();
      } catch (e) {
        showToast('Error deleting account', 'error');
      }
    }
  };

  // Create Announcements
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      const { api } = await import('../services/api');
      await api.createAnnouncement({ title: annTitle, content: annContent });
      showToast('Broadcast published to all members!', 'success');
      setAnnTitle('');
      setAnnContent('');
    } catch (e) {
      showToast('Error publishing broadcast', 'error');
    }
  };

  // CSV Export simulator
  const handleExportCSV = (dataset, filename) => {
    // Generate CSV content string
    let csvContent = "data:text/csv;charset=utf-8,";
    if (dataset.length > 0) {
      const headers = Object.keys(dataset[0]).join(",");
      csvContent += headers + "\r\n";
      dataset.forEach(row => {
        const rowStr = Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
        csvContent += rowStr + "\r\n";
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${filename} downloaded successfully!`, 'success');
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Filters
  const filteredRegs = registrations.filter(r => 
    r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.event_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecruits = recruitment.filter(a => {
    const matchSearch = a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || a.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomain = domainFilter ? a.domain === domainFilter : true;
    return matchSearch && matchDomain;
  });

  const filteredMembers = members.filter(m =>
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.member_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-24 flex text-slate-800 dark:text-slate-200">
      {/* 1. SIDEBAR NAVIGATION */}
      <div className="w-64 border-r border-slate-200/50 dark:border-slate-800/40 hidden md:flex flex-col p-6 space-y-6 text-left sticky top-24 h-[calc(100vh-6rem)]">
        <div>
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Admin Control</h2>
          <p className="text-sm font-bold text-slate-700 dark:text-white mt-1">YCN Operations Board</p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {[
            { id: 'dashboard', label: 'Overview Panel', icon: Users },
            { id: 'events', label: 'Events Editor', icon: Calendar },
            { id: 'registrations', label: 'Registrations / Attendance', icon: CheckSquare },
            { id: 'recruitment', label: 'Applications Hub', icon: FolderHeart },
            { id: 'members', label: 'Member Database', icon: Sparkles },
            { id: 'announcements', label: 'Broadcast System', icon: Megaphone }
          ].map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); setDomainFilter(''); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/10'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <IconComp className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. ADMIN VIEWS CONTAINER */}
      <div className="flex-1 px-4 sm:px-8 overflow-x-hidden text-left space-y-8">
        
        {/* VIEW: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Counters Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Members', val: metrics.total_members },
                { label: 'Active Events', val: metrics.total_events },
                { label: 'Upcoming Slots', val: metrics.upcoming_events },
                { label: 'Booked Registrations', val: metrics.total_registrations },
                { label: 'Recruits Recieved', val: metrics.recruitment_applications }
              ].map((c, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{c.label}</span>
                  <p className="text-xl font-black mt-1 text-slate-800 dark:text-white">{c.val}</p>
                </div>
              ))}
            </div>

            {/* Custom SVG Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MonthlyRegistrationsChart data={metrics.monthly_registrations} />
              <DomainRecruitmentChart data={metrics.domain_recruitment} />
            </div>

            {/* Event Utilization grid */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Event Bookings Utilization</h3>
              <EventParticipationGrid eventsData={metrics.event_participation} />
            </div>
          </div>
        )}

        {/* VIEW: EVENTS CRUD */}
        {activeTab === 'events' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Active Events</h2>
                <p className="text-xs text-slate-400 mt-1">Publish, edit or delete community workshops and nights.</p>
              </div>
              <button
                onClick={() => handleOpenEventModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                <Plus className="w-4 h-4" /> Create Event
              </button>
            </div>

            {/* Event Listing Table */}
            <div className="glass-card rounded-2xl border border-white/20 dark:border-white/5 shadow-md overflow-x-auto">
              <table className="w-full text-xs font-semibold">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-darkbg-card border-b border-slate-200/40 dark:border-slate-800/40 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 text-left">Event Title</th>
                    <th className="py-4 px-6 text-left">Date / Time</th>
                    <th className="py-4 px-6 text-left">Venue</th>
                    <th className="py-4 px-6 text-left">Cap / Booking</th>
                    <th className="py-4 px-6 text-left">Dress Code</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30">
                  {events.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">{ev.title}</td>
                      <td className="py-4 px-6">
                        {ev.date} <span className="text-slate-400 font-medium">at {ev.time.substring(0, 5)}</span>
                      </td>
                      <td className="py-4 px-6 truncate max-w-[120px]">{ev.venue}</td>
                      <td className="py-4 px-6 font-mono font-bold">
                        {ev.capacity - ev.available_seats} / {ev.capacity}
                      </td>
                      <td className="py-4 px-6 truncate max-w-[100px]">{ev.dress_code || 'Smart Casual'}</td>
                      <td className="py-4 px-6 text-center flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenEventModal(ev)}
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 text-blue-500 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-500 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: REGISTRATIONS MANAGEMENT */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Attendance Sheets</h2>
                <p className="text-xs text-slate-400 mt-1">Mark attendance check-in, search members and print data sheets.</p>
              </div>
              <button
                onClick={() => handleExportCSV(registrations, "ycn_event_registrations.csv")}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-darkbg hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-500" /> Export CSV
              </button>
            </div>

            {/* Filter Row */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, email, or event title..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none"
              />
            </div>

            {/* Registrations List Table */}
            <div className="glass-card rounded-2xl border border-white/20 dark:border-white/5 shadow-md overflow-x-auto">
              <table className="w-full text-xs font-semibold">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-darkbg-card border-b border-slate-200/40 dark:border-slate-800/40 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 text-left">Member ID</th>
                    <th className="py-4 px-6 text-left">Full Name</th>
                    <th className="py-4 px-6 text-left">Event Registered</th>
                    <th className="py-4 px-6 text-left">Payment & Discount</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Attendance Logs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30">
                  {filteredRegs.map(reg => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700 dark:text-slate-300">{reg.member_id}</td>
                      <td className="py-4 px-6 text-slate-800 dark:text-white">
                        <div>{reg.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{reg.email}</div>
                      </td>
                      <td className="py-4 px-6 font-bold">{reg.event_title}</td>
                      <td className="py-4 px-6">
                        <div className="font-mono text-[10px] text-slate-500 font-bold">{reg.payment_id || 'FREE'}</div>
                        <div className="text-[11px] font-bold text-slate-800 dark:text-white">
                          ${Number(reg.amount_paid || 0).toFixed(2)}
                          {reg.is_premium_discount && (
                            <span className="text-[9px] text-amber-500 font-semibold ml-1.5">
                              (15% VIP Disc)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {reg.status === 'registered' ? (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase">Booked</span>
                        ) : reg.status === 'attended' ? (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Attended</span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase">Cancelled</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAttendance(reg.id, 'attended')}
                          className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-[10px]"
                        >
                          Check In
                        </button>
                        <button
                          onClick={() => handleAttendance(reg.id, 'cancelled')}
                          className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 rounded-lg font-bold text-[10px]"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: RECRUITMENT MANAGEMENT */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Recruitment Pipeline</h2>
                <p className="text-xs text-slate-400 mt-1">Review candidate applications and approve domain listings.</p>
              </div>
              <button
                onClick={() => handleExportCSV(recruitment, "ycn_recruitment_applications.csv")}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-darkbg hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-500" /> Export CSV
              </button>
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Search className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidates by name, domain, skills..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none"
                />
              </div>
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none text-slate-800 dark:text-white"
              >
                <option value="">All Domains</option>
                <option value="Technical Team">Technical Team</option>
                <option value="Design Team">Design Team</option>
                <option value="Event Management">Event Management</option>
                <option value="Marketing">Marketing</option>
                <option value="Public Relations">Public Relations</option>
              </select>
            </div>

            {/* Recruits Board list cards */}
            <div className="grid grid-cols-1 gap-4">
              {filteredRecruits.map(app => (
                <div
                  key={app.id}
                  className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/5 hover:border-slate-300/30 transition-all text-left flex flex-col justify-between gap-4"
                >
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-850 dark:text-white">{app.full_name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{app.college} • {app.department} ({app.year} Year)</p>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">{app.email} • {app.phone_number}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full uppercase">
                        {app.domain}
                      </span>
                      {app.status === 'pending' ? (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">Pending</span>
                      ) : app.status === 'accepted' ? (
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">Accepted</span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full uppercase">Rejected</span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs bg-slate-550/20 dark:bg-darkbg p-4 rounded-xl space-y-2 border border-slate-200/10">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Previous Experience & Skills:</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium pl-2">{app.previous_experience || 'None listed'} • <span className="italic">{app.skills}</span></p>
                    <p className="font-bold text-slate-700 dark:text-slate-300 mt-2">Why join YCN:</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium pl-2 leading-relaxed italic">"{app.explanation}"</p>
                  </div>

                  <div className="flex justify-between items-center gap-4 flex-wrap">
                    {/* Social Portfolios link indicators */}
                    <div className="flex gap-2.5">
                      {app.portfolio_link && (
                        <a href={app.portfolio_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline">
                          Portfolio <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {app.github_link && (
                        <a href={app.github_link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-0.5 hover:underline">
                          GitHub <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRecruitment(app.id, 'accepted')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-[10px]"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleRecruitment(app.id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 rounded-lg font-bold text-[10px]"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: MEMBERS DATABASE */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Members Directory</h2>
                <p className="text-xs text-slate-400 mt-1">Suspend, view or delete registered youth profiles.</p>
              </div>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members database by ID, full name, email address..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none"
              />
            </div>

            {/* Members Directory Grid */}
            <div className="glass-card rounded-2xl border border-white/20 dark:border-white/5 shadow-md overflow-x-auto">
              <table className="w-full text-xs font-semibold">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-darkbg-card border-b border-slate-200/40 dark:border-slate-800/40 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 text-left">Member ID</th>
                    <th className="py-4 px-6 text-left">Full Name</th>
                    <th className="py-4 px-6 text-left">Email Address</th>
                    <th className="py-4 px-6 text-left">Membership Tier</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Safety Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30">
                  {filteredMembers.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-4 px-6 font-mono font-bold">{m.member_id}</td>
                      <td className="py-4 px-6 font-bold text-slate-850 dark:text-white">{m.full_name}</td>
                      <td className="py-4 px-6">{m.email}</td>
                      <td className="py-4 px-6">
                        {m.membership_tier === 'premium' ? (
                          <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 w-max">
                            👑 Premium VIP
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase">Standard</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {m.membership_status === 'active' ? (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Active</span>
                        ) : (
                          <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase">Suspended</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleToggleMember(m.id, m.membership_status)}
                          className={`p-1.5 rounded-lg border ${
                            m.membership_status === 'active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/25 border-amber-500/20 text-amber-500'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/20 text-emerald-500'
                          }`}
                          title={m.membership_status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        >
                          {m.membership_status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-500 rounded-lg"
                          title="Delete Member permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: ANNOUNCEMENTS CREATION */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 max-w-xl mx-auto text-left animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Broadcast Announcement</h2>
              <p className="text-xs text-slate-400 mt-1">Publish messages. All active community members receive alerts on dashboards.</p>
            </div>

            <div className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-lg p-6 sm:p-8">
              <form onSubmit={handleAnnouncementSubmit} className="space-y-5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Announcement Title</label>
                  <input
                    type="text"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    required
                    placeholder="Event registration updates, PR alerts..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500">Message Content</label>
                  <textarea
                    rows={6}
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    required
                    placeholder="Write details of the alert broadcast..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl border border-transparent text-sm font-bold text-white bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Broadcast to Community
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* EVENT FORM MODAL DIALOG */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEventModalOpen(false)} />
          <div className="glass-card rounded-3xl border border-white/20 dark:border-white/5 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto z-10 text-left relative space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New Event'}
            </h3>

            <form onSubmit={handleSaveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
              
              {/* Title */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label>Event Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Banner URL */}
              <div className="flex flex-col gap-1">
                <label>Banner Image URL</label>
                <input
                  type="url"
                  value={eventForm.banner_url}
                  onChange={(e) => setEventForm({ ...eventForm, banner_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Venue */}
              <div className="flex flex-col gap-1">
                <label>Venue Location</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label>Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Time */}
              <div className="flex flex-col gap-1">
                <label>Time (HH:MM)</label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Capacity */}
              <div className="flex flex-col gap-1">
                <label>Seat Capacity</label>
                <input
                  type="number"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Ticket Price */}
              <div className="flex flex-col gap-1">
                <label>Ticket Price (₹ INR)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={eventForm.ticket_price}
                  onChange={(e) => setEventForm({ ...eventForm, ticket_price: Number(e.target.value) })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Registration Deadline */}
              <div className="flex flex-col gap-1">
                <label>Booking Deadline Date</label>
                <input
                  type="date"
                  value={eventForm.registration_deadline}
                  onChange={(e) => setEventForm({ ...eventForm, registration_deadline: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Dress Code */}
              <div className="flex flex-col gap-1">
                <label>Dress Code</label>
                <input
                  type="text"
                  value={eventForm.dress_code}
                  onChange={(e) => setEventForm({ ...eventForm, dress_code: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label>Status</label>
                <select
                  value={eventForm.status}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Featured Event Checkbox */}
              <div className="flex items-center gap-2 mt-4 select-none">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={eventForm.is_featured}
                  onChange={(e) => setEventForm({ ...eventForm, is_featured: e.target.checked })}
                  className="w-4.5 h-4.5 text-primary border-slate-300 dark:border-slate-850 bg-white dark:bg-darkbg rounded"
                />
                <label htmlFor="is_featured" className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                  Featured Event (Only one active at a time)
                </label>
              </div>

              {/* Private Event Checkbox */}
              <div className="flex items-center gap-2 mt-2 select-none">
                <input
                  type="checkbox"
                  id="is_private"
                  checked={eventForm.is_private}
                  onChange={(e) => setEventForm({ ...eventForm, is_private: e.target.checked })}
                  className="w-4.5 h-4.5 text-amber-500 border-slate-300 dark:border-slate-850 bg-white dark:bg-darkbg rounded"
                />
                <label htmlFor="is_private" className="text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer flex items-center gap-1">
                  👑 Private Event (Exclusive to Premium VIP Members Only)
                </label>
              </div>

              {/* Agenda */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label>Agenda (One item per line, start with "- ")</label>
                <textarea
                  rows={3}
                  value={eventForm.agenda}
                  onChange={(e) => setEventForm({ ...eventForm, agenda: e.target.value })}
                  placeholder="- 10:00 | Welcome speech..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Rules */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label>Rules (One rule per line, start with "- ")</label>
                <textarea
                  rows={3}
                  value={eventForm.rules}
                  onChange={(e) => setEventForm({ ...eventForm, rules: e.target.value })}
                  placeholder="- Bring college ID card..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-semibold text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* FAQS */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label>FAQs JSON String (must be valid JSON array of q and a objects)</label>
                <textarea
                  rows={3}
                  value={eventForm.faqs}
                  onChange={(e) => setEventForm({ ...eventForm, faqs: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-darkbg text-xs font-mono text-slate-850 dark:text-white focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 md:col-span-2 pt-4 border-t border-slate-200/30">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow"
                >
                  Publish / Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
