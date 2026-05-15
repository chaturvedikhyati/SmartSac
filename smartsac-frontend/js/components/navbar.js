// ===== NAVBAR COMPONENT =====
// Dynamic navbar injection and management

const Navbar = {
  init() {
    this.render();
    this.setupEventListeners();
    this.updateActiveLink();
  },

  render() {
    const navbar = document.querySelector('.navbar') || document.createElement('nav');
    navbar.className = 'navbar';
    
    const isAuthenticated = Auth.isAuthenticated();
    const user = Auth.getUser();

    navbar.innerHTML = `
      <!-- Logo -->
      <a href="/" class="navbar-logo">
        <span class="navbar-logo-icon">🌱</span>
        SmartSac
      </a>

      <!-- Navigation Links (Desktop) -->
      <ul class="navbar-nav">
        <li><a href="/" class="nav-link">Home</a></li>
        <li><a href="/#features" class="nav-link">Features</a></li>
        <li><a href="/#how-it-works" class="nav-link">How It Works</a></li>
        <li><a href="/#faq" class="nav-link">FAQ</a></li>
      </ul>

      <!-- Right Side -->
      <div class="navbar-right">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">
          <span class="theme-icon">🌙</span>
        </button>

        ${isAuthenticated ? `
          <a href="/dashboard" class="btn btn-primary btn-sm">Dashboard</a>
          <button id="logout-btn" class="btn btn-ghost btn-sm">Logout</button>
        ` : `
          <a href="/upload" class="btn btn-primary btn-sm">Get Started</a>
        `}
      </div>

      <!-- Mobile Hamburger -->
      <button class="navbar-hamburger" id="hamburger-btn" aria-label="Toggle menu">☰</button>

      <!-- Mobile Menu -->
      <div class="navbar-menu" id="navbar-menu">
        <a href="/" class="nav-link">Home</a>
        <a href="/#features" class="nav-link">Features</a>
        <a href="/#how-it-works" class="nav-link">How It Works</a>
        <a href="/#faq" class="nav-link">FAQ</a>
        ${isAuthenticated ? `
          <a href="/dashboard" class="btn btn-primary btn-full">Dashboard</a>
          <button id="logout-btn-mobile" class="btn btn-ghost btn-full">Logout</button>
        ` : `
          <a href="/upload" class="btn btn-primary btn-full">Get Started</a>
        `}
      </div>
    `;

    if (!document.querySelector('.navbar')) {
      document.body.insertBefore(navbar, document.body.firstChild);
    }
  },

  setupEventListeners() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const newTheme = Theme.toggleTheme();
        this.updateThemeIcon(newTheme);
      });
    }

    // Mobile hamburger
    const hamburger = document.getElementById('hamburger-btn');
    const menu = document.getElementById('navbar-menu');
    if (hamburger && menu) {
      hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
      });

      // Close menu on link click
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('active');
        });
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn') || document.getElementById('logout-btn-mobile');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
        window.location.href = '/';
      });
    }

    // Scroll handler for navbar styling
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  },

  updateActiveLink() {
    const currentPage = window.location.pathname;
    const links = document.querySelectorAll('.navbar-nav a, .navbar-menu a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '/' && href === '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  },
};

// Initialize navbar on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Navbar.init());
} else {
  Navbar.init();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navbar;
}
