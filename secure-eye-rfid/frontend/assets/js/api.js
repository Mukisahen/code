// Secure Eye — shared API client. Handles JWT storage, auth headers and
// automatic access-token refresh on 401s.

const API_BASE = window.SECURE_EYE_API_BASE || 'http://localhost/secure-eye-rfid/backend/api';

const Session = {
  get accessToken() { return localStorage.getItem('se_access_token'); },
  get refreshToken() { return localStorage.getItem('se_refresh_token'); },
  get user() { return JSON.parse(localStorage.getItem('se_user') || 'null'); },
  set(accessToken, refreshToken, user) {
    localStorage.setItem('se_access_token', accessToken);
    if (refreshToken) localStorage.setItem('se_refresh_token', refreshToken);
    if (user) localStorage.setItem('se_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('se_access_token');
    localStorage.removeItem('se_refresh_token');
    localStorage.removeItem('se_user');
  },
  requireRole(roles) {
    const user = Session.user;
    if (!user || !Session.accessToken || !roles.includes(user.role)) {
      window.location.href = 'index.html';
    }
    return user;
  },
};

async function apiFetch(path, options = {}, retry = true) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  if (Session.accessToken) {
    headers['Authorization'] = `Bearer ${Session.accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, Object.assign({}, options, { headers }));

  if (res.status === 401 && retry && Session.refreshToken) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch(path, options, false);
    Session.clear();
    window.location.href = 'index.html';
    return;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

async function tryRefresh() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: Session.refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    Session.set(data.access_token, null, null);
    return true;
  } catch {
    return false;
  }
}

const Api = {
  login: (email, password) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
  logout: () =>
    apiFetch('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: Session.refreshToken }) }),

  students: {
    list: () => apiFetch('/students'),
    create: (payload) => apiFetch('/students', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiFetch(`/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id) => apiFetch(`/students/${id}`, { method: 'DELETE' }),
  },
  vehicles: {
    list: () => apiFetch('/vehicles'),
    create: (payload) => apiFetch('/vehicles', { method: 'POST', body: JSON.stringify(payload) }),
    ping: (id, lat, lng) => apiFetch(`/vehicles/${id}/ping`, { method: 'POST', body: JSON.stringify({ lat, lng }) }),
  },
  routes: {
    list: () => apiFetch('/routes'),
    create: (payload) => apiFetch('/routes', { method: 'POST', body: JSON.stringify(payload) }),
  },
  scan: (payload) => apiFetch('/scan', { method: 'POST', body: JSON.stringify(payload) }),
  tracking: {
    vehicle: (id) => apiFetch(`/tracking/vehicle/${id}`),
    student: (id) => apiFetch(`/tracking/student/${id}`),
  },
  notifications: {
    list: () => apiFetch('/notifications'),
    markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: 'POST' }),
  },
  reports: {
    attendance: () => apiFetch('/reports/attendance'),
    fleetUtilisation: () => apiFetch('/reports/fleet-utilisation'),
  },
};
