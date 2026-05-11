// ===== SMOOTH SCROLL & NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== PLANNER FORM FUNCTIONALITY =====
    const tripForm = document.getElementById('tripPlannerForm');
    const interestTags = document.getElementById('interestTags');
    
    // Interest tags functionality
    document.getElementById('interests').addEventListener('input', function(e) {
        const interests = e.target.value.split(',').map(i => i.trim()).filter(i => i);
        interestTags.innerHTML = '';
        
        interests.forEach(interest => {
            const tag = document.createElement('span');
            tag.className = 'interest-tag';
            tag.textContent = interest;
            tag.innerHTML += '<span class="tag-remove">&times;</span>';
            interestTags.appendChild(tag);
        });
    });

    // Form submission
    tripForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            destination: document.getElementById('destination').value,
            budget: document.getElementById('budget').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            travelers: document.getElementById('travelerCount').value,
            type: document.getElementById('travelerType').value,
            interests: document.getElementById('interests').value.split(',').map(i => i.trim()).filter(i => i)
        };

        // Show loading
        const submitBtn = document.querySelector('.btn-generate');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        submitBtn.disabled = true;

        // Simulate AI generation (30 seconds)
        setTimeout(() => {
            // Save to localStorage
            const trips = JSON.parse(localStorage.getItem('trips') || '[]');
            trips.unshift({
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString(),
                status: 'generated'
            });
            localStorage.setItem('trips', JSON.stringify(trips));

            // Show success
            alert(`✨ AI Itinerary generated for ${formData.destination}!\n\nCheck your trips in planner section. (Demo mode)`);
            
            // Reset form
            tripForm.reset();
            interestTags.innerHTML = '';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    });

    // ===== DESTINATION FILTERING =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('.destination-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter cards
            destinationCards.forEach(card => {
                if (filter === 'all' || card.dataset.tags.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Quick plan buttons
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const dest = this.dataset.dest;
            document.getElementById('destination').value = dest;
            document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== MODAL FUNCTIONALITY (Updated) =====
const modal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.querySelector('.close');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Open modal
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close modal
closeBtn.addEventListener('click', () => {
    closeModal();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Update active tab btn
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(targetTab + 'Tab').classList.add('active');
    });
});

// Login form
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('✅ Login successful! Welcome back! 🎉');
    closeModal();
});

// Signup form
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('❌ Passwords do not match!');
        document.getElementById('confirmPassword').classList.add('password-mismatch');
        return;
    }
    
    // Mark as match
    document.getElementById('confirmPassword').classList.add('password-match');
    
    alert('🎉 Account created successfully! Welcome to AI Trip Planner! ✨');
    closeModal();
});

// Real-time password validation
document.getElementById('signupPassword').addEventListener('input', validatePassword);
document.getElementById('confirmPassword').addEventListener('input', validatePassword);

function validatePassword() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.classList.remove('password-match');
        confirmInput.classList.add('password-mismatch');
    } else if (confirmPassword && password === confirmPassword) {
        confirmInput.classList.remove('password-mismatch');
        confirmInput.classList.add('password-match');
    } else {
        confirmInput.classList.remove('password-match', 'password-mismatch');
    }
}

// Google buttons (demo)
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('🔥 Google auth coming soon! (Demo mode)');
    });
});

    // Login form (demo)
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Logged in successfully! 🎉');
        modal.style.display = 'none';
    });

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').min = today;
    document.getElementById('endDate').min = today;

    // Auto set end date
    document.getElementById('startDate').addEventListener('change', function() {
        document.getElementById('endDate').min = this.value;
    });

    // Floating cards animation
    const floatingCards = document.querySelectorAll('.card-float');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Pricing cards animation
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    console.log('🚀 AI Trip Planner loaded successfully!');
});