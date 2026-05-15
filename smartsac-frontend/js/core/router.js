// ===== ROUTER MODULE =====
// Client-side navigation and state management

const Router = {
  currentPage: 'home',
  history: [],
  observers: [],

  // Define routes
  routes: {
    '/': 'index.html',
    '/dashboard': 'dashboard.html',
    '/upload': 'upload.html',
    '/history': 'history.html',
    '/result': 'result.html',
    '/admin': 'admin.html',
  },

  // Initialize router
  init() {
    this.handleNavigation();
    this.setupLinkInterception();
  },

  // Handle navigation
  handleNavigation() {
    const path = this.getCurrentPath();
    this.currentPage = path || '/';
    this.notifyObservers();
  },

  // Get current path from URL
  getCurrentPath() {
    const pathname = window.location.pathname;
    const base = pathname.substring(0, pathname.lastIndexOf('/'));
    return pathname.substring(base.length) || '/';
  },

  // Get query parameters
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const obj = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  },

  // Navigate to page
  navigate(path, data = null) {
    // Store data in session if provided
    if (data) {
      sessionStorage.setItem('router_data', JSON.stringify(data));
    }

    // Update history
    this.history.push(this.currentPage);
    this.currentPage = path;

    // Update browser URL
    window.history.pushState(null, '', path);
    this.notifyObservers();
  },

  // Go back in history
  goBack() {
    if (this.history.length > 0) {
      const previousPath = this.history.pop();
      this.currentPage = previousPath;
      window.history.back();
      this.notifyObservers();
    }
  },

  // Get stored navigation data
  getStoredData() {
    const data = sessionStorage.getItem('router_data');
    sessionStorage.removeItem('router_data');
    return data ? JSON.parse(data) : null;
  },

  // Setup link interception for SPA behavior
  setupLinkInterception() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && !link.target && link.href.includes(window.location.origin)) {
        e.preventDefault();
        const path = link.href.substring(window.location.origin.length);
        this.navigate(path);
      }
    });
  },

  // Subscribe to route changes
  subscribe(callback) {
    this.observers.push(callback);
  },

  notifyObservers() {
    this.observers.forEach(callback => callback(this.currentPage));
  },

  // Check if route requires authentication
  requiresAuth(path) {
    const publicRoutes = ['/'];
    return !publicRoutes.includes(path);
  },

  // Check if user has required role
  hasRole(role) {
    const user = Auth.getUser();
    return user && user.role === role;
  },
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Router.init());
} else {
  Router.init();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Router;
}
