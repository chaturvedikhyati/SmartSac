// ===== FORMATTERS =====
// Utility functions for formatting data

const Formatters = {
  // Format date
  formatDate(dateString, format = 'short') {
    const date = new Date(dateString);
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    
    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    
    if (format === 'time') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    
    if (format === 'relative') {
      return this.formatRelativeTime(date);
    }
    
    return date.toLocaleString();
  },

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  },

  // Format category name
  formatCategory(category) {
    const icons = {
      recyclable: '♻️',
      compostable: '🌿',
      hazardous: '☠️',
      reusable: '🔄',
      landfill: '⛰️',
    };
    
    const icon = icons[category.toLowerCase()] || '📦';
    return `${icon} ${category}`;
  },

  // Format eco score color
  formatEcoScoreColor(score) {
    if (score >= 70) return 'success'; // Green
    if (score >= 40) return 'warning'; // Orange
    return 'error'; // Red
  },

  // Format percentage
  formatPercentage(value, decimals = 0) {
    return (parseFloat(value) * 100).toFixed(decimals) + '%';
  },

  // Format confidence score
  formatConfidence(confidence) {
    const percent = (parseFloat(confidence) * 100).toFixed(1);
    return `${percent}%`;
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Format waste item name (capitalize)
  formatItemName(name) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Formatters;
}
