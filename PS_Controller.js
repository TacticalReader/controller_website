// Controller Website JavaScript - Enhanced Version with Clean White Sidebar Menu

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

// UPDATED: Clean white sidebar menu functionality
function setupMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('header ul');
    let isMenuOpen = false;
    
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // SHOW sidebar menu
                navMenu.classList.add('menu-open');
                hamburgerMenu.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                console.log('Sidebar menu opened');
            } else {
                // HIDE sidebar menu
                navMenu.classList.remove('menu-open');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
                console.log('Sidebar menu closed');
            }
        });
        
        // Close menu when clicking on menu items
        const menuItems = navMenu.querySelectorAll('li');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Close menu when item is clicked
                isMenuOpen = false;
                navMenu.classList.remove('menu-open');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                console.log('Sidebar menu closed via menu item click');
            });
        });
        
        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                isMenuOpen = false;
                navMenu.classList.remove('menu-open');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                console.log('Sidebar menu closed via Escape key');
            }
        });
        
        // Close menu when clicking outside (on the main content area)
        document.addEventListener('click', (e) => {
            // Check if click is outside both hamburger and menu
            if (isMenuOpen && 
                !navMenu.contains(e.target) && 
                !hamburgerMenu.contains(e.target)) {
                isMenuOpen = false;
                navMenu.classList.remove('menu-open');
                hamburgerMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                console.log('Sidebar menu closed via outside click');
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

// Check if all images are working properly
function checkImageStatus() {
    console.log('Checking image status...');
    
    // Check main controller image
    const mainImage = document.querySelector('.container main img');
    if (mainImage) {
        console.log('Main controller image:', mainImage.src, mainImage.complete ? '✅ Loaded' : '❌ Failed');
    }
    
    // Check color variant images
    loadImage.forEach((imagePath, index) => {
        const img = new Image();
        img.onload = () => console.log(`Color variant ${index + 1} (${imagePath}): ✅ Loaded`);
        img.onerror = () => console.log(`Color variant ${index + 1} (${imagePath}): ❌ Failed`);
        img.src = imagePath;
    });
    
    // Check card images
    const cardImages = document.querySelectorAll('section img');
    cardImages.forEach((img, index) => {
        console.log(`Card image ${index + 1}:`, img.src, img.complete ? '✅ Loaded' : '❌ Failed');
    });
    
    // Check interactive image
    const interactiveImage = document.querySelector('.second-section .interactive-image img');
    if (interactiveImage) {
        console.log('Interactive image:', interactiveImage.src, interactiveImage.complete ? '✅ Loaded' : '❌ Failed');
    }
}

// Initialize all functionality when DOM is loaded
function initializeWebsite() {
    console.log('PS4 Controller Website - Enhanced Version with Clean White Sidebar Menu Loaded');
    
    // Setup all interactive features
    setupColorButtons();
    setupSmoothScrolling();
    setupMobileMenu(); // Updated sidebar menu functionality
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
    
    // Check image status after a short delay to ensure DOM is ready
    setTimeout(checkImageStatus, 1000);
    
    console.log('All enhancements loaded successfully, including clean white sidebar menu!');
}

// Start initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}