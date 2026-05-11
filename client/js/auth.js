// ===== COMPLETE AUTHENTICATION SYSTEM =====
class AuthManager {
    constructor() {
        this.modal = document.getElementById('authModal');
        this.loginTab = document.getElementById('loginTab');
        this.registerTab = document.getElementById('registerTab');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.token = localStorage.getItem('authToken');
        this.currentUser = localStorage.getItem('currentUser');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkAuthStatus();
        console.log('✅ Auth system initialized');
    }
    
    bindEvents() {
        // Login button
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            this.showModal('login');
        });
        
        // Close modal
        document.querySelector('.close')?.addEventListener('click', () => {
            this.hideModal();
        });
        
        // Tab switching
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab('register');
        });
        
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab('login');
        });
        
        // Form submissions
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
        
        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });
    }
    
    showModal(tab = 'login') {
        this.modal.style.display = 'block';
        this.switchTab(tab);
        document.body.style.overflow = 'hidden';
    }
    
    hideModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    switchTab(tab) {
        // Hide both tabs
        this.loginTab.style.display = 'none';
        this.registerTab.style.display = 'none';
        
        // Show selected tab
        if (tab === 'login') {
            this.loginTab.style.display = 'block';
        } else {
            this.registerTab.style.display = 'block';
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        const email = this.loginForm.querySelector('input[type="email"]').value;
        const password = this.loginForm.querySelector('input[type="password"]').value;
        
        // Simulate API call
        this.showLoading(this.loginForm.querySelector('button'));
        
        setTimeout(() => {
            if (email && password.length > 5) {
                this.loginSuccess(email);
            } else {
                this.showError('Invalid credentials');
            }
        }, 1500);
    }
    
    async handleRegister(e) {
        e.preventDefault();
        const name = this.registerForm.querySelector('input[type="text"]').value;
        const email = this.registerForm.querySelector('input[type="email"]').value;
        const password = this.registerForm.querySelector('input[type="password"]').value;
        
        this.showLoading(this.registerForm.querySelector('button'));
        
        setTimeout(() => {
            if (name && email && password.length > 5) {
                this.registerSuccess(name, email);
            } else {
                this.showError('Please fill all fields');
            }
        }, 1500);
    }
    
    showLoading(button) {
        const original = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        return original;
    }
    
    loginSuccess(email) {
        const token = 'user_' + Date.now();
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', email);
        
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-flex';
        
        this.hideModal();
        this.showNotification('Welcome back!', 'success');
        console.log('✅ Login successful:', email);
    }
    
    registerSuccess(name, email) {
        localStorage.setItem('currentUser', name);
        this.switchTab('login');
        this.showNotification(`Welcome ${name}! Please login.`, 'success');
        console.log('✅ Registration successful:', name);
    }
    
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        document.getElementById('loginBtn').style.display = 'inline-flex';
        document.getElementById('logoutBtn').style.display = 'none';
        
        this.showNotification('Logged out successfully', 'info');
        console.log('✅ Logged out');
    }
    
    checkAuthStatus() {
        if (this.token) {
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'inline-flex';
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #ff4757;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 10px 0;
            font-weight: 500;
        `;
        
        // Add to form
        const form = document.activeElement.closest('form');
        form.insertBefore(errorDiv, form.querySelector('button'));
        
        setTimeout(() => errorDiv.remove(), 3000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize
const authManager = new AuthManager();

// Global functions
window.loginUser = () => authManager.loginSuccess('demo@trip.com');
window.logoutUser = () => authManager.logout();