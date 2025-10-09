// Controller Website JavaScript - Enhanced Version with Fixed Hamburger Menu

// Image array for controller colors
const loadImage = [
    "ps4-controller-png-42098.png", // Black
    "ps4-controller-png-42099.png", // White  
    "ps4-controller-png-42109.png"  // Red
];

// Get DOM elements
const changeImage = document.querySelector(".second-section .interactive-image .colours");
const buttons = document.querySelectorAll(".second-section .colours-button button");
const loginContainer = document.getElementById('login-container');
const loginBtn = document.getElementById('login-btn');

// Enhanced color changing functionality with smoother animations
function setupColorButtons() {
    buttons.forEach((button, index) => {
        // Add mouseover events for color changes
        button.addEventListener('mouseover', () => {
            changeControllerColor(index);
        });
        
        // Add click events for more responsive interaction
        button.addEventListener('click', () => {
            changeControllerColor(index);
            // Add active state feedback
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
        
        // Add focus events for keyboard accessibility
        button.addEventListener('focus', () => {
            changeControllerColor(index);
        });
    });
}

// Enhanced color changing function with better animations
function changeControllerColor(colorIndex) {
    if (changeImage && colorIndex < loadImage.length) {
        // Add loading state
        changeImage.style.opacity = '0.7';
        changeImage.style.transform = 'translateY(-30px) scale(0.95)';
        
        setTimeout(() => {
            changeImage.setAttribute("src", loadImage[colorIndex]);
            
            // Smooth return animation
            setTimeout(() => {
                changeImage.style.opacity = '1';
                changeImage.style.transform = 'translateY(-10px) scale(1)';
            }, 100);
        }, 200);
    }
}

// Enhanced login form functionality
function loginForm() {
    const display = window.getComputedStyle(loginContainer).display;
    
    if (display === "none" || display === "") {
        // Show login form
        loginBtn.innerHTML = "Close Form";
        loginContainer.style.display = "flex";
        
        // Add fade in effect
        setTimeout(() => {
            loginContainer.style.opacity = "1";
        }, 10);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = "hidden";
    } else {
        // Hide login form
        loginBtn.innerHTML = "Log In";
        loginContainer.style.opacity = "0";
        
        setTimeout(() => {
            loginContainer.style.display = "none";
            document.body.style.overflow = "auto";
        }, 300);
    }
}

// Add escape key functionality to close login form
function handleEscapeKey(event) {
    if (event.key === 'Escape' && loginContainer.style.display === 'flex') {
        loginForm();
    }
}

// Click outside to close modal functionality
function handleOutsideClick(event) {
    if (event.target === loginContainer) {
        loginForm();
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('header ul li');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Define scroll targets
            const targets = [
                document.querySelector('.container'), // Home
                document.querySelector('section'),    // Product
                document.querySelector('.second-section') // News
            ];
            
            if (targets[index]) {
                targets[index].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// FIXED: Enhanced hamburger menu functionality with correct logic
function setupMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('header ul');
    let isMenuOpen = false;
    
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // SHOW menu
                navMenu.style.opacity = '1';
                navMenu.style.pointerEvents = 'all';
                hamburgerMenu.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                console.log('Menu opened');
            } else {
                // HIDE menu
                navMenu.style.opacity = '0';
                navMenu.style.pointerEvents = 'none';
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
                console.log('Menu closed');
            }
        });
        
        // Close menu when clicking on menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Close menu when item is clicked
                isMenuOpen = false;
                navMenu.style.opacity = '0';
                navMenu.style.pointerEvents = 'none';
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                console.log('Menu closed via menu item click');
            });
        });
        
        // Close menu when clicking outside (on the overlay)
        navMenu.addEventListener('click', (e) => {
            // Only close if clicking on the nav menu background, not on menu items
            if (e.target === navMenu) {
                isMenuOpen = false;
                navMenu.style.opacity = '0';
                navMenu.style.pointerEvents = 'none';
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                console.log('Menu closed via outside click');
            }
        });
        
        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                isMenuOpen = false;
                navMenu.style.opacity = '0';
                navMenu.style.pointerEvents = 'none';
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                console.log('Menu closed via Escape key');
            }
        });
    }
}

// Add loading animation for images
function setupImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
}

// Add scroll-based animations
function setupScrollAnimations() {
    const cards = document.querySelectorAll('.card-one, .card-two, .card-three');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Initialize all functionality when DOM is loaded
function initializeWebsite() {
    console.log('PS4 Controller Website - Enhanced Version with Fixed Hamburger Menu Loaded');
    
    // Setup all interactive features
    setupColorButtons();
    setupSmoothScrolling();
    setupMobileMenu(); // Fixed hamburger menu functionality
    setupImageLoading();
    setupScrollAnimations();
    
    // Add event listeners for login form
    document.addEventListener('keydown', handleEscapeKey);
    if (loginContainer) {
        loginContainer.addEventListener('click', handleOutsideClick);
        
        // Add CSS for better login container opacity
        loginContainer.style.transition = 'opacity 0.3s ease';
        loginContainer.style.opacity = '0';
    }
    
    console.log('All enhancements loaded successfully, including fixed hamburger menu!');
}

// Start initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}