// ===== VALIDATORS =====
// Input validation utilities

const Validators = {
  // Validate email
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password (min 8 chars, 1 uppercase, 1 number)
  isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  // Validate item name (3-200 characters)
  isValidItemName(name) {
    return name && name.trim().length >= 3 && name.trim().length <= 200;
  },

  // Validate file (image only)
  isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!file) return { valid: false, error: 'No file selected' };
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    return { valid: true };
  },

  // Validate URL
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Validate phone number (basic)
  isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Validate number range
  isInRange(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  // Validate required field
  isRequired(value) {
    return value && value.toString().trim().length > 0;
  },

  // Validate text length
  isValidLength(text, min, max) {
    if (!text) return false;
    const length = text.toString().trim().length;
    return length >= min && length <= max;
  },

  // Get validation error message
  getErrorMessage(field, validationType) {
    const messages = {
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
      itemName: 'Item name must be between 3 and 200 characters',
      image: 'Please upload a valid image (JPEG, PNG, or WebP) under 10MB',
      url: 'Please enter a valid URL',
      phone: 'Please enter a valid phone number',
      required: `${field} is required`,
      tooShort: `${field} is too short`,
      tooLong: `${field} is too long`,
    };

    return messages[validationType] || 'Invalid input';
  },

  // Validate form object
  validateForm(formData, schema) {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = formData[field];

      if (rules.required && !this.isRequired(value)) {
        errors[field] = this.getErrorMessage(field, 'required');
        continue;
      }

      if (rules.type === 'email' && !this.isEmail(value)) {
        errors[field] = this.getErrorMessage(field, 'email');
      }

      if (rules.type === 'url' && !this.isValidUrl(value)) {
        errors[field] = this.getErrorMessage(field, 'url');
      }

      if (rules.minLength && !this.isValidLength(value, rules.minLength, Infinity)) {
        errors[field] = this.getErrorMessage(field, 'tooShort');
      }

      if (rules.maxLength && !this.isValidLength(value, 0, rules.maxLength)) {
        errors[field] = this.getErrorMessage(field, 'tooLong');
      }

      if (rules.custom && !rules.custom(value)) {
        errors[field] = rules.customMessage || 'Invalid input';
      }
    }

    return errors;
  },

  // Sanitize input (basic XSS prevention)
  sanitize(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validators;
}
