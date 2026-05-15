// ===== AUTHENTICATION MODULE =====
// Manages auth token storage and user state

const Auth = {
  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Set auth token
  setToken(token) {
    localStorage.setItem('auth_token', token);
    this.notifyObservers();
  },

  // Remove auth token (logout)
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.notifyObservers();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Get stored user data
  getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Set user data
  setUser(userData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
    this.notifyObservers();
  },

  // Observers for auth state changes
  observers: [],

  subscribe(callback) {
    this.observers.push(callback);
  },

  notifyObservers() {
    this.observers.forEach(callback => callback());
  },

  // Auto-logout on token expiry
  setupTokenRefresh() {
    // Check token validity every 5 minutes
    setInterval(() => {
      const token = this.getToken();
      if (token && this.isTokenExpired(token)) {
        this.logout();
        window.location.href = '/';
      }
    }, 5 * 60 * 1000);
  },

  // Simple token expiration check (JWT decode)
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return false;
    }
  },
};

// Initialize auth system
Auth.setupTokenRefresh();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Auth;
}
