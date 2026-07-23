const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper to get auth headers
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('ycn_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// Handle response
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
    throw new Error(errorData.detail || 'API request failed');
  }
  return response.json();
};

export const api = {
  // --- AUTHENTICATION ---
  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('API connection failed, falling back to mock auth.', err);
      return mockApi.login(email, password);
    }
  },

  async register(fullName, email, phoneNumber, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone_number: phoneNumber, password }),
      });
      return await handleResponse(response);
    } catch (err) {
      console.warn('API connection failed, falling back to mock register.', err);
      return mockApi.register(fullName, email, phoneNumber, password);
    }
  },

  async getMe() {
    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getMe();
    }
  },

  // --- USER PROFILE ---
  async updateProfile(data) {
    try {
      const response = await fetch(`${BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          bio: data.bio,
          skills: data.skills,
          social_links: data.socialLinks ? JSON.stringify(data.socialLinks) : undefined,
          profile_picture: data.profilePicture,
        }),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.updateProfile(data);
    }
  },

  // --- EVENTS ---
  async getEvents() {
    try {
      const response = await fetch(`${BASE_URL}/events`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getEvents();
    }
  },

  async getEvent(id) {
    try {
      const response = await fetch(`${BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getEvent(id);
    }
  },

  async upgradeMembership() {
    try {
      const response = await fetch(`${BASE_URL}/users/upgrade-membership`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.upgradeMembership();
    }
  },

  async registerEvent(id, data = {}) {
    try {
      const response = await fetch(`${BASE_URL}/events/register/${id}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          event_id: id,
          payment_method: data.paymentMethod || 'card',
          full_name: data.fullName,
          phone_number: data.phoneNumber,
        }),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.registerEvent(id, data);
    }
  },

  async getMyRegistrations() {
    try {
      const response = await fetch(`${BASE_URL}/events/my-registrations`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getMyRegistrations();
    }
  },

  // --- RECRUITMENT ---
  async applyRecruitment(data) {
    try {
      const response = await fetch(`${BASE_URL}/recruitment/apply`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          phone_number: data.phoneNumber,
          college: data.college,
          department: data.department,
          year: data.year,
          domain: data.domain,
          previous_experience: data.previousExperience,
          skills: data.skills,
          portfolio_link: data.portfolioLink,
          github_link: data.githubLink,
          linkedin_link: data.linkedinLink,
          explanation: data.explanation,
        }),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.applyRecruitment(data);
    }
  },

  // --- ANNOUNCEMENTS & NOTIFICATIONS ---
  async getAnnouncements() {
    try {
      const response = await fetch(`${BASE_URL}/announcements`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getAnnouncements();
    }
  },

  async getNotifications() {
    try {
      const response = await fetch(`${BASE_URL}/notifications`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getNotifications();
    }
  },

  async markNotificationRead(id) {
    try {
      const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.markNotificationRead(id);
    }
  },

  // --- ADMIN PANEL ---
  async getAdminMetrics() {
    try {
      const response = await fetch(`${BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getAdminMetrics();
    }
  },

  async createEvent(data) {
    try {
      const response = await fetch(`${BASE_URL}/admin/events`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.createEvent(data);
    }
  },

  async updateEvent(id, data) {
    try {
      const response = await fetch(`${BASE_URL}/admin/events/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.updateEvent(id, data);
    }
  },

  async deleteEvent(id) {
    try {
      const response = await fetch(`${BASE_URL}/admin/events/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.deleteEvent(id);
    }
  },

  async getAdminRegistrations() {
    try {
      const response = await fetch(`${BASE_URL}/admin/registrations`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getAdminRegistrations();
    }
  },

  async updateAttendance(id, status) {
    try {
      const response = await fetch(`${BASE_URL}/admin/registrations/${id}/attendance`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.updateAttendance(id, status);
    }
  },

  async getAdminRecruitment() {
    try {
      const response = await fetch(`${BASE_URL}/admin/recruitment`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getAdminRecruitment();
    }
  },

  async updateRecruitmentStatus(id, status) {
    try {
      const response = await fetch(`${BASE_URL}/admin/recruitment/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.updateRecruitmentStatus(id, status);
    }
  },

  async getAdminMembers() {
    try {
      const response = await fetch(`${BASE_URL}/admin/members`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.getAdminMembers();
    }
  },

  async toggleMemberStatus(id, status) {
    try {
      const response = await fetch(`${BASE_URL}/admin/members/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.toggleMemberStatus(id, status);
    }
  },

  async deleteMember(id) {
    try {
      const response = await fetch(`${BASE_URL}/admin/members/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.deleteMember(id);
    }
  },

  async createAnnouncement(data) {
    try {
      const response = await fetch(`${BASE_URL}/admin/announcements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (err) {
      return mockApi.createAnnouncement(data);
    }
  },
};

// --- MOCK LOCALSTORAGE DATABASE FOR STANDALONE OR OFFLINE MODE ---
// Initialize mock database in localStorage if empty
const initMockDb = () => {
  if (!localStorage.getItem('ycn_mock_users')) {
    localStorage.setItem('ycn_mock_users', JSON.stringify([
      {
        id: 1,
        full_name: 'YCN Administrator',
        email: 'admin@ycn.com',
        phone_number: '+1234567890',
        role: 'admin',
        member_id: 'YCN-2026-0001',
        membership_status: 'active',
        join_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        full_name: 'Chaitanya Kumar',
        email: 'user@ycn.com',
        phone_number: '+919876543210',
        role: 'user',
        member_id: 'YCN-2026-1234',
        membership_status: 'active',
        bio: 'Passionate tech student, explorer, and community enthusiast.',
        skills: 'Python, Javascript, Event Management, Designing',
        social_links: JSON.stringify({
          linkedin: 'https://linkedin.com/in/chaitanya',
          github: 'https://github.com/chaitanya',
          twitter: 'https://twitter.com/chaitanya'
        }),
        join_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ]));
  }

  if (!localStorage.getItem('ycn_mock_events')) {
    localStorage.setItem('ycn_mock_events', JSON.stringify([
      {
        id: 1,
        title: 'PROM NIGHT 2026',
        description: "Welcome to the highlight event of the year! Experience a magical evening filled with dance, networking, and glamour. YCN's annual Prom Night offers an unmatched atmosphere for students and young professionals to connect, build relationships, dance, and celebrate the future together. Join us for a formal night to remember!",
        banner_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
        venue: 'Grand Ballroom, Ritz-Carlton',
        date: '2026-10-24',
        time: '19:00:00',
        capacity: 150,
        registration_deadline: '2026-10-20',
        dress_code: 'Formal Black Tie / Elegant Evening Gowns',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400'
        ]),
        status: 'published',
        agenda: '- 19:00 | Guest Arrival & Red Carpet Photo Session\n- 19:45 | Welcome Address by YCN Team Leaders\n- 20:00 | Icebreaker & Buffet Dinner Opens\n- 21:00 | Dance Floor Unleashed (Live DJ Set)\n- 22:30 | Prom Coronation Ceremony\n- 23:00 | Late-Night Activities & Dessert Bar\n- 00:00 | Event Conclusion',
        rules: '- Attendees must adhere to formal dress code.\n- Bring Digital ID card for verification.\n- Respectful conduct is required at all times.',
        faqs: JSON.stringify([
          { q: 'Who is eligible to participate?', a: 'All registered members of YCN are welcome.' },
          { q: 'Is dinner included?', a: 'Yes! A full gourmet buffet is included in your registration.' }
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'AI & Innovation Summit 2026',
        description: 'Unleash your potential with the YCN AI & Innovation Summit. Learn the latest AI advancements, participate in hands-on building workshops, and meet founders, developers, and tech lead mentors from top companies. Perfect for anyone wanting to break into tech or start their AI builder journey.',
        banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
        venue: 'YCN Tech Hub, Innovation Center',
        date: '2026-08-15',
        time: '10:00:00',
        capacity: 100,
        registration_deadline: '2026-08-12',
        dress_code: 'Smart Casual / Business Casual',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1591115413009-d63653457b3f?auto=format&fit=crop&q=80&w=400'
        ]),
        status: 'published',
        agenda: '- 10:00 | Registration & Welcome Coffee\n- 10:30 | Keynote: AI Future\n- 11:30 | API Workshop\n- 13:00 | Networking Lunch\n- 14:30 | Ideathon Sprint\n- 17:30 | Closing & High Tea',
        rules: '- Bring a laptop for the lab.\n- Prior registration is mandatory.',
        faqs: JSON.stringify([
          { q: 'Do I need coding experience?', a: 'No, we have both product-design and development tracks.' }
        ]),
        created_at: new Date().toISOString()
      }
    ]));
  }

  if (!localStorage.getItem('ycn_mock_registrations')) {
    localStorage.setItem('ycn_mock_registrations', JSON.stringify([]));
  }

  if (!localStorage.getItem('ycn_mock_recruitment')) {
    localStorage.setItem('ycn_mock_recruitment', JSON.stringify([]));
  }

  if (!localStorage.getItem('ycn_mock_announcements')) {
    localStorage.setItem('ycn_mock_announcements', JSON.stringify([
      {
        id: 1,
        title: 'YCN Portal Launched!',
        content: 'Welcome to our brand new Community Management System. Log in, design your customized glassmorphism digital ID card, sign up for events, and apply to join our event management, technical, or marketing sub-teams.',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Prom Night 2026 Registrations Open',
        content: 'Registrations are now officially live for YCN Prom Night 2026 at the Ritz-Carlton. Space is limited to 150 members due to capacity rules. Reserve your spot today!',
        created_at: new Date().toISOString()
      }
    ]));
  }

  if (!localStorage.getItem('ycn_mock_notifications')) {
    localStorage.setItem('ycn_mock_notifications', JSON.stringify([]));
  }
};

initMockDb();

// Helper to get records
const getRecords = (key) => JSON.parse(localStorage.getItem(key));
const saveRecords = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Get current session email/user from token
const getCurrentUserEmail = () => {
  const token = localStorage.getItem('ycn_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email;
  } catch (e) {
    return null;
  }
};

const mockApi = {
  login(email, password) {
    initMockDb();
    const users = getRecords('ycn_mock_users');
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Incorrect email or password');
    
    // Simulate JWT token by base64 encoding a payload
    const tokenPayload = btoa(JSON.stringify({ sub: user.email, email: user.email, role: user.role }));
    const mockToken = `header.${tokenPayload}.signature`;
    
    return {
      access_token: mockToken,
      token_type: 'bearer',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        member_id: user.member_id
      }
    };
  },

  register(fullName, email, phoneNumber, password) {
    initMockDb();
    const users = getRecords('ycn_mock_users');
    if (users.find(u => u.email === email)) {
      throw new Error('Email is already registered');
    }
    
    const newId = users.length + 1;
    const memberId = `YCN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser = {
      id: newId,
      full_name: fullName,
      email,
      phone_number: phoneNumber,
      role: 'user',
      member_id: memberId,
      membership_status: 'active',
      join_date: new Date().toISOString()
    };
    
    users.push(newUser);
    saveRecords('ycn_mock_users', users);
    
    // Welcome notification
    const notifications = getRecords('ycn_mock_notifications');
    notifications.push({
      id: notifications.length + 1,
      user_id: newUser.id,
      title: 'Welcome to YCN!',
      content: `Hello ${fullName}, welcome! Your member ID is ${memberId}.`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    saveRecords('ycn_mock_notifications', notifications);
    
    return newUser;
  },

  getMe() {
    const email = getCurrentUserEmail();
    if (!email) throw new Error('Unauthorized');
    const users = getRecords('ycn_mock_users');
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  },

  updateProfile(data) {
    const email = getCurrentUserEmail();
    if (!email) throw new Error('Unauthorized');
    const users = getRecords('ycn_mock_users');
    const index = users.findIndex(u => u.email === email);
    if (index === -1) throw new Error('User not found');
    
    users[index] = {
      ...users[index],
      full_name: data.fullName || users[index].full_name,
      phone_number: data.phoneNumber || users[index].phone_number,
      bio: data.bio || users[index].bio,
      skills: data.skills || users[index].skills,
      social_links: data.socialLinks ? JSON.stringify(data.socialLinks) : users[index].social_links,
      profile_picture: data.profilePicture || users[index].profile_picture,
    };
    
    saveRecords('ycn_mock_users', users);
    return users[index];
  },

  getEvents() {
    initMockDb();
    const events = getRecords('ycn_mock_events');
    const registrations = getRecords('ycn_mock_registrations');
    
    return events.map(e => {
      const activeRegs = registrations.filter(r => r.event_id === e.id && r.status !== 'cancelled').length;
      return {
        ...e,
        available_seats: Math.max(0, e.capacity - activeRegs)
      };
    });
  },

  getEvent(id) {
    initMockDb();
    const events = getRecords('ycn_mock_events');
    const event = events.find(e => e.id === Number(id));
    if (!event) throw new Error('Event not found');
    
    const registrations = getRecords('ycn_mock_registrations');
    const activeRegs = registrations.filter(r => r.event_id === event.id && r.status !== 'cancelled').length;
    
    return {
      ...event,
      available_seats: Math.max(0, event.capacity - activeRegs)
    };
  },

  upgradeMembership() {
    const user = this.getMe();
    user.membership_tier = 'premium';
    const users = getRecords('ycn_mock_users');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx].membership_tier = 'premium';
      saveRecords('ycn_mock_users', users);
    }
    setCurrentUser(user);

    const notifications = getRecords('ycn_mock_notifications');
    notifications.push({
      id: notifications.length + 1,
      user_id: user.id,
      title: '👑 Premium VIP Activated!',
      content: 'Welcome to YNC Premium VIP! You now have 15% ticket discounts, early access registration, and exclusive access to private events.',
      is_read: false,
      created_at: new Date().toISOString()
    });
    saveRecords('ycn_mock_notifications', notifications);

    return user;
  },

  registerEvent(id, data = {}) {
    const user = this.getMe();
    const event = this.getEvent(id);
    
    if (event.is_private && user.membership_tier !== 'premium') {
      throw new Error('This is a Private Event exclusive to Premium VIP Members. Upgrade to Premium to join!');
    }

    if (event.early_access_until && new Date() <= new Date(event.early_access_until) && user.membership_tier !== 'premium') {
      throw new Error(`This event is currently in Early Access for Premium VIP Members only until ${event.early_access_until}.`);
    }

    if (new Date() > new Date(event.registration_deadline)) {
      throw new Error('Registration deadline has passed');
    }
    
    const registrations = getRecords('ycn_mock_registrations');
    const existing = registrations.find(r => r.user_id === user.id && r.event_id === Number(id) && r.status !== 'cancelled');
    if (existing) throw new Error('You are already registered for this event');
    
    const activeRegs = registrations.filter(r => r.event_id === event.id && r.status !== 'cancelled').length;
    if (activeRegs >= event.capacity) throw new Error('Event is at full capacity');
    
    const basePrice = Number(event.ticket_price || 0);
    let discount = 0;
    let isPremDisc = false;
    if (user.membership_tier === 'premium' && basePrice > 0) {
      discount = Number((basePrice * 0.15).toFixed(2));
      isPremDisc = true;
    }

    const amountPaid = Math.max(0, Number((basePrice - discount).toFixed(2)));
    const paymentId = `PAY-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg = {
      id: registrations.length + 1,
      user_id: user.id,
      event_id: Number(id),
      status: 'registered',
      certificate_url: null,
      ticket_price: basePrice,
      amount_paid: amountPaid,
      discount_applied: discount,
      is_premium_discount: isPremDisc,
      payment_status: 'completed',
      payment_id: paymentId,
      created_at: new Date().toISOString()
    };
    
    registrations.push(newReg);
    saveRecords('ycn_mock_registrations', registrations);
    
    // Add Notification
    const notifications = getRecords('ycn_mock_notifications');
    notifications.push({
      id: notifications.length + 1,
      user_id: user.id,
      title: 'Event Registered Successfully',
      content: `You registered for '${event.title}'. Paid: $${amountPaid.toFixed(2)}${isPremDisc ? ' (15% Premium VIP Disc Applied!)' : ''}. Ref: ${paymentId}. See you at ${event.venue}!`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    saveRecords('ycn_mock_notifications', notifications);
    
    return { ...newReg, event };
  },

  getMyRegistrations() {
    const user = this.getMe();
    const registrations = getRecords('ycn_mock_registrations');
    const events = getRecords('ycn_mock_events');
    
    const myRegs = registrations.filter(r => r.user_id === user.id);
    return myRegs.map(r => {
      const event = events.find(e => e.id === r.event_id);
      return {
        ...r,
        event
      };
    });
  },

  applyRecruitment(data) {
    const user = this.getMe();
    const apps = getRecords('ycn_mock_recruitment');
    
    const existing = apps.find(a => a.user_id === user.id && a.domain === data.domain);
    if (existing) throw new Error(`You have already applied for the ${data.domain} team.`);
    
    const newApp = {
      id: apps.length + 1,
      user_id: user.id,
      full_name: data.fullName,
      email: data.email,
      phone_number: data.phoneNumber,
      college: data.college,
      department: data.department,
      year: data.year,
      domain: data.domain,
      previous_experience: data.previousExperience,
      skills: data.skills,
      portfolio_link: data.portfolioLink,
      github_link: data.githubLink,
      linkedin_link: data.linkedinLink,
      explanation: data.explanation,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    apps.push(newApp);
    saveRecords('ycn_mock_recruitment', apps);
    
    const notifications = getRecords('ycn_mock_notifications');
    notifications.push({
      id: notifications.length + 1,
      user_id: user.id,
      title: 'Recruitment Application Received',
      content: `Your application for ${data.domain} is pending review.`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    saveRecords('ycn_mock_notifications', notifications);
    
    return newApp;
  },

  getAnnouncements() {
    initMockDb();
    return getRecords('ycn_mock_announcements');
  },

  getNotifications() {
    const user = this.getMe();
    const notifications = getRecords('ycn_mock_notifications');
    return notifications.filter(n => n.user_id === user.id).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  },

  markNotificationRead(id) {
    const user = this.getMe();
    const notifications = getRecords('ycn_mock_notifications');
    const index = notifications.findIndex(n => n.id === Number(id) && n.user_id === user.id);
    if (index !== -1) {
      notifications[index].is_read = true;
      saveRecords('ycn_mock_notifications', notifications);
    }
    return { status: 'success' };
  },

  // --- ADMIN PANEL ---
  getAdminMetrics() {
    initMockDb();
    const users = getRecords('ycn_mock_users');
    const events = getRecords('ycn_mock_events');
    const regs = getRecords('ycn_mock_registrations');
    const apps = getRecords('ycn_mock_recruitment');
    
    const totalMembers = users.filter(u => u.role === 'user').length;
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
    const totalRegistrations = regs.filter(r => r.status !== 'cancelled').length;
    const recruitmentApplications = apps.length;
    
    // Domain calculations
    const domains = ["Technical Team", "Design Team", "Event Management", "Public Relations", "Marketing", "Photography", "Videography", "Social Media", "Sponsorship", "Content Writing"];
    const domainRecruitment = {};
    domains.forEach(d => {
      domainRecruitment[d] = apps.filter(a => a.domain === d).length;
    });
    
    // Monthly registrations (mock)
    const monthlyRegistrations = {
      Jan: 2, Feb: 3, Mar: 5, Apr: 8, May: 12, Jun: 18, Jul: 25, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };
    
    // Event participation calculations
    const eventParticipation = events.map(e => {
      const eventRegs = regs.filter(r => r.event_id === e.id && r.status !== 'cancelled').length;
      const attendedRegs = regs.filter(r => r.event_id === e.id && r.status === 'attended').length;
      return {
        event_name: e.title,
        registrations_count: eventRegs,
        capacity: e.capacity,
        attendance_count: attendedRegs
      };
    });
    
    return {
      total_members: totalMembers,
      total_events: totalEvents,
      upcoming_events: upcomingEvents,
      total_registrations: totalRegistrations,
      recruitment_applications: recruitmentApplications,
      domain_recruitment: domainRecruitment,
      monthly_registrations: monthlyRegistrations,
      event_participation: eventParticipation
    };
  },

  createEvent(data) {
    const events = getRecords('ycn_mock_events');
    const newEvent = {
      ...data,
      id: events.length + 1,
      created_at: new Date().toISOString()
    };
    events.push(newEvent);
    saveRecords('ycn_mock_events', events);
    return newEvent;
  },

  updateEvent(id, data) {
    const events = getRecords('ycn_mock_events');
    const index = events.findIndex(e => e.id === Number(id));
    if (index === -1) throw new Error('Event not found');
    events[index] = {
      ...events[index],
      ...data
    };
    saveRecords('ycn_mock_events', events);
    return events[index];
  },

  deleteEvent(id) {
    let events = getRecords('ycn_mock_events');
    events = events.filter(e => e.id !== Number(id));
    saveRecords('ycn_mock_events', events);
    return { status: 'success' };
  },

  getAdminRegistrations() {
    const regs = getRecords('ycn_mock_registrations');
    const users = getRecords('ycn_mock_users');
    const events = getRecords('ycn_mock_events');
    
    return regs.map(r => {
      const user = users.find(u => u.id === r.user_id) || {};
      const event = events.find(e => e.id === r.event_id) || {};
      return {
        id: r.id,
        user_id: r.user_id,
        full_name: user.full_name || 'Deleted User',
        email: user.email || 'deleted@ycn.com',
        member_id: user.member_id || 'YCN-XXXX',
        event_id: r.event_id,
        event_title: event.title || 'Deleted Event',
        status: r.status,
        certificate_url: r.certificate_url,
        created_at: r.created_at
      };
    });
  },

  updateAttendance(id, status) {
    const regs = getRecords('ycn_mock_registrations');
    const index = regs.findIndex(r => r.id === Number(id));
    if (index === -1) throw new Error('Registration not found');
    regs[index].status = status;
    
    if (status === 'attended' && !regs[index].certificate_url) {
      regs[index].certificate_url = `/certificates/cert-${regs[index].id}-${Math.floor(1000 + Math.random() * 9000)}.pdf`;
    }
    
    saveRecords('ycn_mock_registrations', regs);
    return { status: 'success' };
  },

  getAdminRecruitment() {
    return getRecords('ycn_mock_recruitment');
  },

  updateRecruitmentStatus(id, status) {
    const apps = getRecords('ycn_mock_recruitment');
    const index = apps.findIndex(a => a.id === Number(id));
    if (index === -1) throw new Error('Application not found');
    apps[index].status = status;
    saveRecords('ycn_mock_recruitment', apps);
    
    // Add Notification for applicant
    const notifications = getRecords('ycn_mock_notifications');
    notifications.push({
      id: notifications.length + 1,
      user_id: apps[index].user_id,
      title: 'Recruitment Status Update',
      content: `Your application for ${apps[index].domain} has been ${status.toUpperCase()}.`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    saveRecords('ycn_mock_notifications', notifications);
    
    return { status: 'success' };
  },

  getAdminMembers() {
    const users = getRecords('ycn_mock_users');
    return users.filter(u => u.role === 'user');
  },

  toggleMemberStatus(id, status) {
    const users = getRecords('ycn_mock_users');
    const index = users.findIndex(u => u.id === Number(id));
    if (index === -1) throw new Error('Member not found');
    users[index].membership_status = status;
    saveRecords('ycn_mock_users', users);
    return { status: 'success' };
  },

  deleteMember(id) {
    let users = getRecords('ycn_mock_users');
    users = users.filter(u => u.id !== Number(id));
    saveRecords('ycn_mock_users', users);
    return { status: 'success' };
  },

  createAnnouncement(data) {
    const anns = getRecords('ycn_mock_announcements');
    const newAnn = {
      id: anns.length + 1,
      title: data.title,
      content: data.content,
      created_at: new Date().toISOString()
    };
    anns.push(newAnn);
    saveRecords('ycn_mock_announcements', anns);
    
    // Notify everyone
    const users = getRecords('ycn_mock_users');
    const notifications = getRecords('ycn_mock_notifications');
    users.forEach(u => {
      notifications.push({
        id: notifications.length + 1,
        user_id: u.id,
        title: 'New Announcement',
        content: `An announcement was posted: ${data.title}`,
        is_read: false,
        created_at: new Date().toISOString()
      });
    });
    saveRecords('ycn_mock_notifications', notifications);
    
    return newAnn;
  }
};
