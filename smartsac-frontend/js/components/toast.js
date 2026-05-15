// ===== TOAST NOTIFICATION SYSTEM =====
// Non-blocking notifications

class Toast {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create container if doesn't exist
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(options = {}) {
    const {
      title = 'Notification',
      message = '',
      type = 'info', // 'success', 'error', 'warning', 'info'
      duration = 4000,
    } = options;

    const toastEl = document.createElement('div');
    toastEl.className = `toast ${type}`;
    toastEl.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    this.container.appendChild(toastEl);

    // Close handler
    const close = () => {
      toastEl.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => toastEl.remove(), 300);
    };

    toastEl.querySelector('.toast-close').addEventListener('click', close);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(close, duration);
    }

    return toastEl;
  }

  success(title, message = '') {
    return this.show({ title, message, type: 'success' });
  }

  error(title, message = '') {
    return this.show({ title, message, type: 'error' });
  }

  warning(title, message = '') {
    return this.show({ title, message, type: 'warning' });
  }

  info(title, message = '') {
    return this.show({ title, message, type: 'info' });
  }
}

const toast = new Toast();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = toast;
}
