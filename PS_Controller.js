document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const header = document.querySelector('header');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('header nav ul');
  const navLinks = document.querySelectorAll('header nav ul li a');
  const colorButtons = document.querySelectorAll('.color-buttons button');
  const interactiveImage = document.querySelector('.controller-image');
  const loginTrigger = document.querySelector('#login-btn');
  const loginContainer = document.querySelector('#login-container');
  const featureCards = document.querySelectorAll('.features-section .card');
  const scrollToTopBtn = document.querySelector('#scroll-to-top');

  // --- State ---
  const controllerImages = {
    black: './ps4-controller-png-42098.png',
    white: './ps4-controller-png-42099.png',
    red: './ps4-controller-png-42109.png',
  };

  // --- Functions ---

  // Toggles the mobile navigation menu
  const toggleMobileMenu = () => {
    if (!hamburgerMenu || !navMenu) return;
    const isOpen = navMenu.classList.toggle('menu-open');
    hamburgerMenu.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  };

  // Toggles the login modal visibility
  const toggleLoginModal = () => {
    if (!loginContainer) return;
    const isVisible = loginContainer.classList.toggle('visible');
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
  };

  // Changes the controller image based on the selected color
  const changeControllerColor = (color) => {
    if (!interactiveImage || !controllerImages[color]) return;

    interactiveImage.style.opacity = '0.5';
    interactiveImage.style.transform = 'scale(0.95)';

    setTimeout(() => {
      interactiveImage.src = controllerImages[color];
      interactiveImage.style.opacity = '1';
      interactiveImage.style.transform = 'scale(1)';
    }, 200);
  };

  // Handles smooth scrolling for navigation links
  const handleSmoothScroll = (event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href');
    if (!targetId || targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('menu-open')) {
      toggleMobileMenu();
    }
  };

  // Handles scroll-to-top button visibility and header shadow
  const handleScroll = () => {
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }
    if (scrollToTopBtn) {
      scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    }
  };

  // --- Intersection Observer for Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  featureCards.forEach(card => observer.observe(card));


  // --- Event Listeners ---

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
  }

  if (loginTrigger) {
    loginTrigger.addEventListener('click', toggleLoginModal);
  }
  if (loginContainer) {
    loginContainer.addEventListener('click', (e) => {
      if (e.target === loginContainer) {
        toggleLoginModal();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginContainer.classList.contains('visible')) {
      toggleLoginModal();
    }
  });

  colorButtons.forEach(button => {
    button.addEventListener('click', () => {
      const color = button.dataset.color;
      changeControllerColor(color);
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', handleScroll);

  // --- Initial State ---
  if (interactiveImage) {
    interactiveImage.src = controllerImages.black;
  }
});
