// ===== THEME MODULE =====
// Dark mode toggle and theme management

const Theme = {
  // Get current theme
  getCurrentTheme() {
    return localStorage.getItem('theme') || 'light';
  },

  // Set theme
  setTheme(theme) {
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
    this.notifyObservers(theme);
  },

  // Toggle theme
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  },

  // Apply theme to DOM
  applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  },

  // Initialize theme from system preference
  initTheme() {
    const savedTheme = this.getCurrentTheme();
    
    // If no saved theme, use system preference
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      this.setTheme(theme);
    } else {
      this.applyTheme(savedTheme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        this.applyTheme(theme);
      }
    });
  },

  // Observers
  observers: [],

  subscribe(callback) {
    this.observers.push(callback);
  },

  notifyObservers(theme) {
    this.observers.forEach(callback => callback(theme));
  },
};

// Initialize theme on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Theme.initTheme());
} else {
  Theme.initTheme();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Theme;
}
