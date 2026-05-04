
// Global variables
let currentPage = 'home';
let pages = null;
let navLinks = null;

// ==========================================
// INITIALIZATION - Runs when page loads
// ==========================================

function initApp() {
    // Get all the page elements
    pages = document.querySelectorAll('.page');
    navLinks = document.querySelectorAll('[data-page]');
    
    // Set up everything
    setupNavigation();
    setupHeader();
    setupForm();
    setupSmoothScrolling();
    setupAnimations();
    
    // Set current year in footer
    updateCurrentYear();
    
    // Handle initial page load
    const hash = window.location.hash.slice(1) || 'home';
    navigateToPage(hash);
}

// ==========================================
// NAVIGATION AND ROUTING
// ==========================================

function setupNavigation() {
    // Set up click listeners for all navigation links
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            showPage(e.state.page);
        }
    });
}

// Navigate to a specific page
function navigateToPage(pageName) {
    showPage(pageName);
    
    // Update URL without page reload
    history.pushState({ page: pageName }, '', '#' + pageName);
    
    // Update active navigation links
    updateActiveLinks(pageName);
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show a specific page
function showPage(pageName) {
    // Hide all pages
    pages.forEach(function(page) {
        page.classList.remove('active');
    });

    // Show the target page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
    }
}

// Update which navigation link is active
function updateActiveLinks(pageName) {
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// HEADER FUNCTIONALITY
// ==========================================

function setupHeader() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Handle scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Handle mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

// ==========================================
// FORM HANDLING
// ==========================================

function setupForm() {
    const assignmentForm = document.getElementById('assignmentForm');
    
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAssignmentSubmission();
        });
    }
}

// Handle assignment form submission
function handleAssignmentSubmission() {
    const assignmentForm = document.getElementById('assignmentForm');
    const formData = new FormData(assignmentForm);
    const data = {};
    
    // Convert FormData to simple object
    for (let pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }
    
    // Validate the form
    if (!validateForm(data)) {
        return;
    }

    // Show success message
    showSuccessMessage('Assignment submitted successfully! We will contact you soon.');
    
    // Reset the form
    assignmentForm.reset();
    
    // Open WhatsApp with the assignment details
    openWhatsAppWithAssignment(data);
}

// Validate form data
function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'subject', 'deadline', 'requirements'];
    
    // Check if all required fields are filled
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!data[field] || data[field].trim() === '') {
            showErrorMessage('Please fill in the ' + field + ' field.');
            return false;
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone.replace(/[^0-9]/g, ''))) {
        showErrorMessage('Please enter a valid 10-digit phone number.');
        return false;
    }

    return true;
}

// ==========================================
// MOBILE MENU
// ==========================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    if (mobileMenu.style.display === 'flex') {
        mobileMenu.style.display = 'none';
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    } else {
        mobileMenu.style.display = 'flex';
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    mobileMenu.style.display = 'none';
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
}

// ==========================================
// WHATSAPP INTEGRATION
// ==========================================

function openWhatsApp() {
    window.open('https://wa.me/918580641139', '_blank');
}

function openWhatsAppWithAssignment(data) {
    const message = 'New Assignment Submission:%0A%0A' +
        'Name: ' + data.name + '%0A' +
        'Email: ' + data.email + '%0A' +
        'Phone: ' + data.phone + '%0A' +
        'Subject: ' + data.subject + '%0A' +
        'Deadline: ' + data.deadline + '%0A' +
        'Requirements: ' + data.requirements;
    
    const whatsappUrl = 'https://wa.me/918580641139?text=' + message;
    window.open(whatsappUrl, '_blank');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Update current year in footer
function updateCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Show success message
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

// Show error message
function showErrorMessage(message) {
    showMessage(message, 'error');
}

// Generic message function
function showMessage(message, type) {
    type = type || 'success';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type + '-message';
    messageDiv.textContent = message;
    
    // Style the message
    if (type === 'success') {
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #0066ff 0%, #00ccff 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
    } else {
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(function() {
        messageDiv.remove();
    }, 5000);
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = anchor.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ==========================================
// ANIMATIONS
// ==========================================

function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .feature-item, .step, .pricing-card').forEach(function(el) {
        observer.observe(el);
    });
}

// ==========================================
// START THE APP WHEN PAGE LOADS
// ==========================================

document.addEventListener('DOMContentLoaded', initApp);
