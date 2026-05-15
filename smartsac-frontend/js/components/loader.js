// ===== LOADER / LOADING OVERLAY =====
// Full-page loading indicator

const Loader = {
  element: null,
  isShowing: false,

  init() {
    const loaderHTML = `
      <div class="loader-overlay" id="global-loader" style="display: none;">
        <div style="text-align: center;">
          <div class="loader-ring"></div>
          <div class="loader-text">Loading...</div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
    this.element = document.getElementById('global-loader');
  },

  show(message = 'Loading...') {
    if (!this.element) this.init();
    
    const textEl = this.element.querySelector('.loader-text');
    if (textEl) textEl.textContent = message;
    
    this.element.style.display = 'flex';
    this.isShowing = true;
  },

  hide() {
    if (!this.element) return;
    this.element.style.display = 'none';
    this.isShowing = false;
  },

  toggle() {
    if (this.isShowing) {
      this.hide();
    } else {
      this.show();
    }
  },
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Loader.init());
} else {
  Loader.init();
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Loader;
}
