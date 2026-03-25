/* ========================================
   Smart Waste Management - Main App Logic
   Global Utilities & Core Functionality
   ======================================== */

/**
 * DOMReady - Execute code when DOM is fully loaded
 */
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Modal Functions
 */
const Modal = {
  open: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  },
  
  close: function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  },

  closeAll: function() {
    document.querySelectorAll('.modal.show').forEach(modal => {
      modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
  }
};

/**
 * UI Utilities
 */
const UI = {
  // Show toast notification
  toast: function(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `alert alert-${type} animate-slide-right`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="alert-close">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.remove();
    }, duration);
  },

  // Show alert dialog
  alert: function(title, message, type = 'info') {
    alert(`${title}\n\n${message}`);
  },

  // Confirm dialog
  confirm: function(message) {
    return confirm(message);
  },

  // Show spinner
  showSpinner: function(element) {
    const spinner = document.createElement('div');
    spinner.className = 'animate-spin';
    spinner.innerHTML = '⏳';
    element.appendChild(spinner);
  },

  // Hide spinner
  hideSpinner: function(element) {
    const spinner = element.querySelector('.animate-spin');
    if (spinner) spinner.remove();
  }
};

/**
 * Format Data
 */
const Format = {
  // Format date
  date: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Format time
  time: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Format datetime
  datetime: function(dateString) {
    return `${Format.date(dateString)} ${Format.time(dateString)}`;
  },

  // Format number with commas
  number: function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Format file size
  fileSize: function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Capitalize string
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

/**
 * Animation Utils
 */
const Animation = {
  // Animate counter from 0 to target
  counterUp: function(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const animate = () => {
      current += increment;
      if (current < target) {
        element.textContent = Format.number(Math.floor(current));
        requestAnimationFrame(animate);
      } else {
        element.textContent = Format.number(target);
      }
    };
    animate();
  },

  // Fade element in
  fadeIn: function(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in`;
    element.offsetHeight; // Trigger reflow
    element.style.opacity = '1';
  },

  // Fade element out
  fadeOut: function(element, duration = 300) {
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ease-out`;
    element.offsetHeight; // Trigger reflow
    element.style.opacity = '0';
  },

  // Slide element down
  slideDown: function(element, duration = 300) {
    element.style.height = '0';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease-out`;
    element.offsetHeight; // Trigger reflow
    element.style.height = element.scrollHeight + 'px';
  },

  // Slide element up
  slideUp: function(element, duration = 300) {
    element.style.height = element.scrollHeight + 'px';
    element.style.overflow = 'hidden';
    element.style.transition = `height ${duration}ms ease-out`;
    element.offsetHeight; // Trigger reflow
    element.style.height = '0';
  }
};

/**
 * Navigation
 */
const Navigation = {
  // Navigate to page
  go: function(page) {
    window.location.href = page;
  },

  // Navigate back
  back: function() {
    window.history.back();
  },

  // Set active nav item
  setActive: function(navItemId) {
    document.querySelectorAll('.navbar-link, .sidebar-link').forEach(item => {
      item.classList.remove('active');
    });
    const activeItem = document.getElementById(navItemId);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
};

/**
 * Sidebar Toggle
 */
function initSidebarToggle() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const navbarToggle = document.querySelector('.navbar-toggle');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
      const navMenu = document.querySelector('.navbar-menu');
      if (navMenu) {
        navMenu.classList.toggle('show');
      }
    });
  }

  // Close sidebar on link click
  if (sidebar) {
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('show');
      });
    });
  }
}

/**
 * Modal Event Listeners
 */
function initModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        const modalId = modal.id;
        Modal.close(modalId);
      }
    });

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const modalId = modal.id;
        Modal.close(modalId);
      });
    }
  });
}

/**
 * Form Validation
 */
const FormValidator = {
  // Email validation
  email: function(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Password validation (at least 8 chars, 1 uppercase, 1 number)
  password: function(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  // Phone validation
  phone: function(phone) {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(phone);
  },

  // Required field
  required: function(value) {
    return value && value.trim().length > 0;
  },

  // Min length
  minLength: function(value, minLen) {
    return value && value.length >= minLen;
  }
};

/**
 * Utility Functions
 */
const Utils = {
  // Generate random ID
  generateId: function() {
    return Math.random().toString(36).substr(2, 9);
  },

  // Get query parameter
  getQueryParam: function(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  // Local storage helpers
  storage: {
    set: function(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },
    remove: function(key) {
      localStorage.removeItem(key);
    },
    clear: function() {
      localStorage.clear();
    }
  },

  // Session storage helpers
  sessionStorage: {
    set: function(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },
    remove: function(key) {
      sessionStorage.removeItem(key);
    }
  },

  // Deep clone object
  clone: function(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

/**
 * Initialize App on DOM ready
 */
onDOMReady(function() {
  initSidebarToggle();
  initModals();

  // Log app initialized
  console.log('Smart Waste Management System - App Initialized ✓');
});

/**
 * Export for use in other files
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Modal,
    UI,
    Format,
    Animation,
    Navigation,
    FormValidator,
    Utils,
    onDOMReady
  };
}
