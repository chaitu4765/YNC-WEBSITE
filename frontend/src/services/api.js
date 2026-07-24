let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
if (rawBaseUrl && !rawBaseUrl.endsWith('/api') && !rawBaseUrl.endsWith('/api/')) {
  rawBaseUrl = rawBaseUrl.endsWith('/') ? `${rawBaseUrl}api` : `${rawBaseUrl}/api`;
}
const BASE_URL = rawBaseUrl;

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
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(response);
  },

  async register(fullName, email, phoneNumber, password) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, phone_number: phoneNumber, password }),
    });
    return await handleResponse(response);
  },

  async getMe() {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // --- USER PROFILE ---
  async updateProfile(data) {
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
  },

  // --- EVENTS ---
  async getEvents() {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async getEvent(id) {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async upgradeMembership() {
    const response = await fetch(`${BASE_URL}/users/upgrade-membership`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async registerEvent(id, data = {}) {
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
  },

  async getMyRegistrations() {
    const response = await fetch(`${BASE_URL}/events/my-registrations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // --- RECRUITMENT ---
  async applyRecruitment(data) {
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
  },

  // --- ANNOUNCEMENTS & NOTIFICATIONS ---
  async getAnnouncements() {
    const response = await fetch(`${BASE_URL}/announcements`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async getNotifications() {
    const response = await fetch(`${BASE_URL}/notifications`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async markNotificationRead(id) {
    const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  // --- ADMIN PANEL ---
  async getAdminMetrics() {
    const response = await fetch(`${BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async createEvent(data) {
    const response = await fetch(`${BASE_URL}/admin/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  },

  async updateEvent(id, data) {
    const response = await fetch(`${BASE_URL}/admin/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  },

  async deleteEvent(id) {
    const response = await fetch(`${BASE_URL}/admin/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async getAdminRegistrations() {
    const response = await fetch(`${BASE_URL}/admin/registrations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async updateAttendance(id, status) {
    const response = await fetch(`${BASE_URL}/admin/registrations/${id}/attendance`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  },

  async getAdminRecruitment() {
    const response = await fetch(`${BASE_URL}/admin/recruitment`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async updateRecruitmentStatus(id, status) {
    const response = await fetch(`${BASE_URL}/admin/recruitment/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  },

  async getAdminMembers() {
    const response = await fetch(`${BASE_URL}/admin/members`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async toggleMemberStatus(id, status) {
    const response = await fetch(`${BASE_URL}/admin/members/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  },

  async deleteMember(id) {
    const response = await fetch(`${BASE_URL}/admin/members/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  },

  async createAnnouncement(data) {
    const response = await fetch(`${BASE_URL}/admin/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await handleResponse(response);
  },
};
