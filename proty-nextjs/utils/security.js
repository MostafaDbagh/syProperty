// Frontend Security Configuration
export const securityConfig = {
  // API Configuration
  api: {
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://proty-api-mostafa-56627d8ca9aa.herokuapp.com'
      : 'http://localhost:5000',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "blob:", "https:", "http:"],
    'connect-src': ["'self'", "https://proty-api-mostafa-56627d8ca9aa.herokuapp.com"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },

  // Input Sanitization
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .trim();
  },

  // Password Validation
  validatePassword: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: [
        password.length < minLength && 'Password must be at least 8 characters long',
        !hasUpperCase && 'Password must contain at least one uppercase letter',
        !hasLowerCase && 'Password must contain at least one lowercase letter',
        !hasNumbers && 'Password must contain at least one number',
        !hasSpecialChar && 'Password must contain at least one special character'
      ].filter(Boolean)
    };
  },

  // Email Validation
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone Validation
  validatePhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  },

  // XSS Protection
  escapeHtml: (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  },

  // Secure Storage
  secureStorage: {
    setItem: (key, value) => {
      try {
        const encryptedValue = btoa(JSON.stringify(value));
        localStorage.setItem(key, encryptedValue);
      } catch (error) {
        console.error('Error storing data securely:', error);
      }
    },

    getItem: (key) => {
      try {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;
        return JSON.parse(atob(encryptedValue));
      } catch (error) {
        console.error('Error retrieving data securely:', error);
        return null;
      }
    },

    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing data securely:', error);
      }
    }
  },

  // Request Security
  secureRequest: async (url, options = {}) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include'
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, mergedOptions);
      
      // Check for suspicious responses
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      return response;
    } catch (error) {
      console.error('Secure request failed:', error);
      throw error;
    }
  },

  // Session Management
  session: {
    isExpired: (timestamp) => {
      const now = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      return (now - timestamp) > sessionDuration;
    },

    refreshToken: async () => {
      try {
        const response = await securityConfig.secureRequest('/api/auth/refresh', {
          method: 'POST'
        });
        
        if (response.ok) {
          const data = await response.json();
          securityConfig.secureStorage.setItem('token', data.token);
          securityConfig.secureStorage.setItem('tokenTimestamp', Date.now());
          return true;
        }
        return false;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
      }
    }
  },

  // Error Handling
  handleError: (error, context = '') => {
    console.error(`Security Error ${context}:`, error);
    
    // Don't expose sensitive error information
    const safeError = {
      message: 'An error occurred. Please try again.',
      timestamp: new Date().toISOString(),
      context
    };

    return safeError;
  },

  // Monitoring
  logSecurityEvent: (event) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', event);
    }
    
    // In production, you might want to send this to a monitoring service
    // Example: sendToMonitoringService(event);
  }
};

// Initialize security measures
if (typeof window !== 'undefined') {
  // Disable right-click context menu in production
  if (process.env.NODE_ENV === 'production') {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault();
      }
    });
  }

  // Monitor for suspicious activities
  window.addEventListener('error', (event) => {
    securityConfig.logSecurityEvent({
      type: 'JAVASCRIPT_ERROR',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Monitor for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    securityConfig.logSecurityEvent({
      type: 'UNHANDLED_PROMISE_REJECTION',
      message: event.reason?.message || 'Unknown error',
      reason: event.reason
    });
  });
}

export default securityConfig;
