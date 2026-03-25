/* ========================================
   Smart Waste Management - Authentication
   User Login & Registration Logic
   ======================================== */

/**
 * Authentication Functions
 */
const Auth = {
  // Check if user is logged in
  isLoggedIn: function() {
    // Check new localStorage keys first
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    
    // Fall back to old storage system
    if (!userName && !userRole) {
      return Utils.storage.get('currentUser') !== null;
    }
    return userName !== null && userRole !== null;
  },

  // Get current user
  getCurrentUser: function() {
    // Check new localStorage keys first
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    
    if (userName && userEmail && userRole) {
      return {
        name: userName,
        email: userEmail,
        role: userRole,
        avatar: userName.split(' ')[0].charAt(0) + (userName.split(' ')[1] ? userName.split(' ')[1].charAt(0) : '')
      };
    }
    
    // Fall back to old storage system
    return Utils.storage.get('currentUser') || AppData.currentUser;
  },

  // Set current user
  setCurrentUser: function(user) {
    // Store in new system
    localStorage.setItem('userName', user.name || user.email);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userRole', user.role);
    
    // Also store in old system for compatibility
    Utils.storage.set('currentUser', user);
  },

  // Login user
  login: function(email, password, role) {
    // Mock authentication
    if (!email || !password) {
      return { success: false, message: 'Email and password required' };
    }

    if (!FormValidator.email(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Mock user
    const user = {
      id: Math.floor(Math.random() * 1000),
      name: email.split('@')[0],
      email: email,
      role: role,
      avatar: email.charAt(0).toUpperCase(),
      joinDate: new Date().toISOString().split('T')[0]
    };

    this.setCurrentUser(user);
    Utils.storage.set('authToken', 'token_' + Math.random().toString(36));

    return { success: true, message: 'Login successful', user: user };
  },

  // Register user
  register: function(name, email, password, confirmPassword, role) {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return { success: false, message: 'All fields are required' };
    }

    if (!FormValidator.email(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (!FormValidator.password(password)) {
      return { 
        success: false, 
        message: 'Password must be at least 8 characters with uppercase and number' 
      };
    }

    // Create new user
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      name: name,
      email: email,
      role: role,
      avatar: name.charAt(0).toUpperCase(),
      joinDate: new Date().toISOString().split('T')[0]
    };

    this.setCurrentUser(newUser);
    Utils.storage.set('authToken', 'token_' + Math.random().toString(36));

    return { success: true, message: 'Registration successful', user: newUser };
  },

  // Logout user
  logout: function() {
    Utils.storage.remove('currentUser');
    Utils.storage.remove('authToken');
    window.location.href = './login.html';
  },

  // Check authorization
  authorize: function(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    return user.role === requiredRole;
  },

  // Require authentication
  requireAuth: function() {
    if (!this.isLoggedIn()) {
      window.location.href = './login.html';
      return false;
    }
    return true;
  },

  // Require specific role
  requireRole: function(role) {
    if (!this.authorize(role)) {
      UI.toast('Access denied. Required role: ' + role, 'danger');
      window.history.back();
      return false;
    }
    return true;
  }
};

/**
 * Handle Login Form
 */
function handleLoginForm(event) {
  console.log('Login form submitted');
  if (event) event.preventDefault();

  try {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Get role from radio button
    const roleChecked = document.querySelector('input[name="loginRole"]:checked');
    if (!roleChecked) {
      UI.toast('Please select a role', 'warning');
      return;
    }
    const role = roleChecked.value;

    console.log('Login data:', { email, role });

    if (!email || !password || !role) {
      UI.toast('Please fill all fields', 'warning');
      return;
    }

    const result = Auth.login(email, password, role);

    if (result.success) {
      UI.toast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        // Redirect based on role
        const redirects = {
          'citizen': './dashboard-user.html',
          'admin': './dashboard-admin.html',
          'driver': './dashboard-driver.html'
        };
        window.location.href = redirects[role] || './dashboard-user.html';
      }, 1500);
    } else {
      UI.toast(result.message, 'danger');
    }
  } catch (error) {
    console.error('Login error:', error);
    UI.toast('An error occurred during login: ' + error.message, 'danger');
  }
}

/**
 * Handle Register Form
 */
function handleRegisterForm(event) {
  console.log('Registration form submitted');
  if (event) event.preventDefault();

  try {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Get role from radio button
    const roleChecked = document.querySelector('input[name="registerRole"]:checked');
    if (!roleChecked) {
      UI.toast('Please select a role', 'warning');
      return;
    }
    const role = roleChecked.value;
    
    const agreeTerms = document.getElementById('agreeTerms').checked;

    console.log('Form data:', { name, email, role, agreeTerms });

    if (!name) {
      UI.toast('Please enter your name', 'warning');
      return;
    }

    if (!email) {
      UI.toast('Please enter your email', 'warning');
      return;
    }

    if (!password) {
      UI.toast('Please enter a password', 'warning');
      return;
    }

    if (!confirmPassword) {
      UI.toast('Please confirm your password', 'warning');
      return;
    }

    if (!agreeTerms) {
      UI.toast('Please agree to terms and conditions', 'warning');
      return;
    }

    const result = Auth.register(name, email, password, confirmPassword, role);

    if (result.success) {
      UI.toast('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        const redirects = {
          'citizen': './dashboard-user.html',
          'admin': './dashboard-admin.html',
          'driver': './dashboard-driver.html'
        };
        window.location.href = redirects[role] || './dashboard-user.html';
      }, 1500);
    } else {
      UI.toast(result.message, 'danger');
    }
  } catch (error) {
    console.error('Registration error:', error);
    UI.toast('An error occurred during registration: ' + error.message, 'danger');
  }
}

/**
 * Initialize Auth UI
 */
function initAuthUI() {
  const user = Auth.getCurrentUser();
  if (!user) return;

  // Update profile display
  const profileName = document.querySelectorAll('.profile-name');
  const profileRole = document.querySelectorAll('.profile-role');
  const profileAvatar = document.querySelectorAll('.profile-avatar');

  profileName.forEach(el => el.textContent = user.name);
  profileRole.forEach(el => el.textContent = Format.capitalize(user.role));
  profileAvatar.forEach(el => el.textContent = user.avatar);
}

/**
 * Setup Logout Button
 */
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (UI.confirm('Are you sure you want to logout?')) {
        Auth.logout();
      }
    });
  }
}

/**
 * Setup Form Toggle (Login <-> Register)
 */
function setupFormToggle() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const toggleToRegister = document.getElementById('toggleToRegister');
  const toggleToLogin = document.getElementById('toggleToLogin');

  if (toggleToRegister && registerForm) {
    toggleToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginForm) loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      Animation.fadeIn(registerForm);
    });
  }

  if (toggleToLogin && loginForm) {
    toggleToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerForm) registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      Animation.fadeIn(loginForm);
    });
  }
}

/**
 * Initialize Authentication on page load
 */
onDOMReady(function() {
  initAuthUI();
  setupLogoutButton();
  setupFormToggle();

  // Setup form event listeners
  const loginFormElement = document.getElementById('loginForm');
  if (loginFormElement) {
    loginFormElement.addEventListener('submit', handleLoginForm);
  }

  const registerFormElement = document.getElementById('registerForm');
  if (registerFormElement) {
    registerFormElement.addEventListener('submit', handleRegisterForm);
  }
});

/**
 * Export for use
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Auth,
    handleLoginForm,
    handleRegisterForm
  };
}
