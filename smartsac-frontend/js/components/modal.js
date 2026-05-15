// ===== MODAL SYSTEM =====
// Dialog/modal management

class Modal {
  constructor(options = {}) {
    this.options = {
      title: 'Modal',
      content: '',
      buttons: [],
      onClose: null,
      ...options,
    };
    this.element = null;
    this.isOpen = false;
  }

  render() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <h2 class="modal-title">${this.options.title}</h2>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    `;

    // Body
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = this.options.content;

    // Footer (if buttons provided)
    let footer = null;
    if (this.options.buttons && this.options.buttons.length > 0) {
      footer = document.createElement('div');
      footer.className = 'modal-footer';
      this.options.buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `btn ${btn.className || 'btn-secondary'}`;
        button.textContent = btn.label;
        button.addEventListener('click', () => {
          if (btn.onClick) btn.onClick();
          if (btn.close) this.close();
        });
        footer.appendChild(button);
      });
    }

    // Assemble
    modal.appendChild(header);
    modal.appendChild(body);
    if (footer) modal.appendChild(footer);
    overlay.appendChild(modal);

    // Event handlers
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    header.querySelector('.modal-close').addEventListener('click', () => this.close());

    // Keyboard handling
    this.handleKeyboard = (e) => {
      if (e.key === 'Escape') this.close();
    };

    this.element = overlay;
    return overlay;
  }

  open() {
    if (this.isOpen) return;

    const element = this.render();
    document.body.appendChild(element);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.handleKeyboard);

    // Focus trap
    this.focusTrap();

    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;

    if (this.element) {
      this.element.remove();
      this.element = null;
    }

    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeyboard);

    if (this.options.onClose) {
      this.options.onClose();
    }

    this.isOpen = false;
  }

  focusTrap() {
    const focusableElements = this.element.querySelectorAll('button, input, textarea, select');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  setContent(content) {
    this.options.content = content;
    if (this.isOpen) {
      const body = this.element.querySelector('.modal-body');
      body.innerHTML = content;
    }
  }
}

// Helper function to create and open modal
function showModal(options) {
  const modal = new Modal(options);
  modal.open();
  return modal;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Modal, showModal };
}
