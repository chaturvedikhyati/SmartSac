// ===== LANDING PAGE LOGIC =====

class LandingManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupCounter();
    this.setupAccordions();
    this.setupScrollIndicator();
  }

  setupScrollAnimations() {
    // Fade in elements when they enter viewport
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slideUp');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe feature cards, stats, etc.
    document.querySelectorAll('.feature-card, .category-card, .testimonial-card').forEach(el => {
      observer.observe(el);
    });
  }

  setupCounter() {
    const observerOptions = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe stat items and impact counters
    document.querySelectorAll('.stat-number, .impact-number').forEach(el => {
      observer.observe(el);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.textContent) || 0;
    const duration = 2000;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = elapsed / duration;

      if (progress < 1) {
        const current = Math.floor(target * progress);
        element.textContent = Formatters.formatNumber(current);
        requestAnimationFrame(animate);
      } else {
        element.textContent = Formatters.formatNumber(target);
      }
    };

    animate();
  }

  setupAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question?.addEventListener('click', () => {
        const isOpen = answer.classList.contains('open');

        // Close all other items
        faqItems.forEach(i => {
          i.querySelector('.faq-answer').classList.remove('open');
          i.querySelector('.faq-toggle').classList.remove('open');
        });

        // Toggle current item
        if (!isOpen) {
          answer.classList.add('open');
          question.querySelector('.faq-toggle').classList.add('open');
        }
      });
    });
  }

  setupScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
      indicator.addEventListener('click', () => {
        const featureSection = document.querySelector('#features');
        featureSection?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
}

// Smooth scroll anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LandingManager();
  });
} else {
  new LandingManager();
}
