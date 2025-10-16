document.addEventListener('DOMContentLoaded', () => {

    // Controller color images
    const controllerImages = [
        "./assets/images/controller-black.png",
        "./assets/images/controller-white.png",
        "./assets/images/controller-red.png"
    ];

    // DOM Elements
    const interactiveImage = document.querySelector(".interactive-image-container .controller-image");
    const colorButtons = document.querySelectorAll(".color-buttons button");
    const loginContainer = document.getElementById('login-container');
    const loginTriggerButton = document.getElementById('login-btn');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('header nav ul');
    const navLinks = document.querySelectorAll('header nav ul li');

    // --- Color Switching Logic ---
    function changeControllerColor(index) {
        if (!interactiveImage || index >= controllerImages.length) return;

        interactiveImage.style.opacity = '0.5';
        interactiveImage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            interactiveImage.setAttribute("src", controllerImages[index]);
            setTimeout(() => {
                interactiveImage.style.opacity = '1';
                interactiveImage.style.transform = 'scale(1)';
            }, 100);
        }, 200);
    }

    if (colorButtons.length > 0) {
        colorButtons.forEach((button, index) => {
            button.addEventListener('click', () => changeControllerColor(index));
        });
    }

    // --- Login Modal Logic ---
    function toggleLoginForm() {
        if (!loginContainer) return;

        const isVisible = loginContainer.classList.contains('visible');
        if (isVisible) {
            loginTriggerButton.textContent = "Log In";
            loginContainer.classList.remove('visible');
            document.body.style.overflow = "auto";
        } else {
            loginTriggerButton.textContent = "Close Form";
            loginContainer.classList.add('visible');
            document.body.style.overflow = "hidden";
        }
    }

    if (loginTriggerButton) {
        loginTriggerButton.addEventListener('click', toggleLoginForm);
    }

    if (loginContainer) {
        loginContainer.addEventListener('click', (event) => {
            if (event.target === loginContainer) { // Close only if overlay is clicked
                toggleLoginForm();
            }
        });
    }

    // --- Keyboard Accessibility for Modal ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && loginContainer && loginContainer.classList.contains('visible')) {
            toggleLoginForm();
        }
    });

    // --- Smooth Scrolling for Nav Links ---
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile menu on link click
                    if (navMenu && navMenu.classList.contains('menu-open')) {
                        navMenu.classList.remove('menu-open');
                        hamburgerMenu.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                }
            });
        });
    }

    // --- Mobile Menu Logic ---
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            const isMenuOpen = navMenu.classList.toggle('menu-open');
            hamburgerMenu.classList.toggle('active');
            document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        });
    }
