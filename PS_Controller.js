\document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const header = document.querySelector('header');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('header nav ul');
  const navLinks = document.querySelectorAll('.smooth-scroll');
  const colorButtons = document.querySelectorAll('.color-buttons button');
  const interactiveImage = document.querySelector('.interactive-controller-image');
  const heroImage = document.querySelector('.hero-controller-image');
  const loginTrigger = document.querySelector('#login-btn');
  const loginContainer = document.querySelector('#login-container');
  const loginCloseBtn = document.querySelector('#login-close-btn');
  const featureCards = document.querySelectorAll('.features-section .card');
  const specItems = document.querySelectorAll('.specs-section .spec-item');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const scrollToTopBtn = document.querySelector('#scroll-to-top');
  const newsletterForm = document.querySelector('#newsletter-form');
  const offerBanner = document.querySelector('#offer-banner');
  const offerCloseBtn = document.querySelector('#offer-close-btn');
  const offerViewLaterBtn = document.querySelector('#offer-view-later-btn');
  const offerClaimBtn = document.querySelector('.offer-claim-btn'); // New selector
  const hoursEl = document.querySelector('#hours');
  const minutesEl = document.querySelector('#minutes');
  const secondsEl = document.querySelector('#seconds');
  const offerTitleEl = offerBanner ? offerBanner.querySelector('.offer-title') : null; // New selector
  const offerTextEl = offerBanner ? offerBanner.querySelector('.offer-text') : null; // New selector


  // --- State ---
  const controllerImages = {
    black: './ps4-controller-png-42098.png',
    white: './ps4-controller-png-42099.png',
    red: './ps4-controller-png-42109.png',
  };
  let currentTestimonialIndex = 0;
  let countdownInterval;
  let exitIntentTriggered = false; // New state for exit intent

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
    if (!controllerImages[color]) return;

    const imagesToUpdate = [interactiveImage, heroImage].filter(Boolean);

    imagesToUpdate.forEach(img => {
        img.style.opacity = '0.5';
        img.style.transform = 'scale(0.95)';
    });

    setTimeout(() => {
        imagesToUpdate.forEach(img => {
            img.src = controllerImages[color];
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        });
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
      // Calculate offset for fixed header
      const headerOffset = 90;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
      });
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

  // Rotates testimonials
  const rotateTestimonials = () => {
    if (testimonialCards.length === 0) return;
    testimonialCards.forEach(card => card.classList.remove('active'));
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
    testimonialCards[currentTestimonialIndex].classList.add('active');
  };

  // Handles newsletter form submission
  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('#newsletter-email');
    const button = form.querySelector('button');
    const message = form.querySelector('#newsletter-feedback');
    if (!input || !button || !message) return;

    // Clear previous states
    input.classList.remove('invalid');
    message.classList.remove('error');
    message.textContent = '';
    input.setAttribute('aria-invalid', 'false');

    const email = input.value.trim();
    // A more reliable regex for email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (email && emailRegex.test(email)) {
      // Success state
      form.classList.add('subscribed');
      message.textContent = 'Thank you! News is on its way.';
      button.innerHTML = '<i class="fas fa-check"></i> Subscribed';
      input.disabled = true;
      button.disabled = true;
    } else {
      // Invalid email feedback
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      message.textContent = 'Please enter a valid email address.';
      message.classList.add('error');
      
      // Remove invalid state after a delay for better UX
      setTimeout(() => {
        input.classList.remove('invalid');
      }, 2500);
    }
  };

  // --- Offer Banner Functions ---

  // Hides the offer banner
  const hideOfferBanner = () => {
    if (offerBanner) {
      offerBanner.classList.remove('visible');
    }
  };

  // Shows the offer banner
  const showOfferBanner = () => {
    if (!offerBanner) return;

    // --- New Feature: Persistent Dismissal (using localStorage) ---
    // If banner was permanently closed, don't show it.
    if (localStorage.getItem('offerBannerClosed') === 'true') {
      return;
    }

    // --- New Feature: Timed "View Later" ---
    const viewLaterExpiry = localStorage.getItem('offerBannerViewLater');
    if (viewLaterExpiry && Date.now() < parseInt(viewLaterExpiry, 10)) {
        // Still within the "view later" period
        return;
    } else if (viewLaterExpiry && Date.now() >= parseInt(viewLaterExpiry, 10)) {
        // "View later" period has expired, clear the flag
        localStorage.removeItem('offerBannerViewLater');
    }

    // --- New Feature: Offer Expiration ---
    if (localStorage.getItem('offerExpired') === 'true') {
        // If the offer has permanently expired, don't show it.
        return;
    }

    offerBanner.classList.add('visible');
    startCountdown(); // Start countdown only when banner is visible
  };

  // Starts the countdown timer
  const startCountdown = () => {
    if (!hoursEl || !minutesEl || !secondsEl || !offerClaimBtn || !offerTitleEl || !offerTextEl) return;

    // Clear any existing interval to prevent multiple timers
    if (countdownInterval) clearInterval(countdownInterval);

    let endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to end of the current day

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = endOfDay.getTime() - now.getTime();

      if (timeLeft < 0) {
        clearInterval(countdownInterval);
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        
        // --- New Feature: Offer Expiration Handling ---
        offerTitleEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Offer Expired!';
        offerTitleEl.style.color = 'var(--accent)';
        offerTextEl.textContent = 'This flash sale has ended. Stay tuned for more great deals!';
        offerClaimBtn.disabled = true;
        offerClaimBtn.style.opacity = '0.6';
        offerClaimBtn.style.cursor = 'not-allowed';
        if (offerViewLaterBtn) offerViewLaterBtn.style.display = 'none'; // Hide "View Later"
        localStorage.setItem('offerExpired', 'true'); // Persist expiry
        return;
      }

      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }, 1000);
  };

  // --- New Feature: Exit-Intent Trigger ---
  const handleExitIntent = (e) => {
    // Only trigger if mouse moves to the top edge of the viewport
    if (e.clientY < 50 && !exitIntentTriggered && !offerBanner.classList.contains('visible') && localStorage.getItem('offerBannerClosed') !== 'true' && localStorage.getItem('offerExpired') !== 'true') {
        showOfferBanner();
        exitIntentTriggered = true; // Prevent re-triggering until page reload
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
  specItems.forEach(item => observer.observe(item));


  // --- Event Listeners ---

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleMobileMenu);
  }

  if (loginTrigger) {
    loginTrigger.addEventListener('click', toggleLoginModal);
  }
  if (loginCloseBtn) {
    loginCloseBtn.addEventListener('click', toggleLoginModal);
  }
  if (loginContainer) {
    loginContainer.addEventListener('click', (e) => {
      if (e.target === loginContainer) {
        toggleLoginModal();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginContainer && loginContainer.classList.contains('visible')) {
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
    // Only apply to anchor links, not buttons that might have the class
    if (link.tagName === 'A') {
        link.addEventListener('click', handleSmoothScroll);
    }
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  // Offer Banner Listeners
  if (offerCloseBtn) {
    offerCloseBtn.addEventListener('click', () => {
      hideOfferBanner();
      // --- New Feature: Persistent Dismissal ---
      localStorage.setItem('offerBannerClosed', 'true'); // Use localStorage for permanent dismissal
      if (countdownInterval) clearInterval(countdownInterval);
    });
  }

  if (offerViewLaterBtn) {
    offerViewLaterBtn.addEventListener('click', () => {
      hideOfferBanner();
      // --- New Feature: Timed "View Later" ---
      // Reappear after 2 hours (2 * 60 * 60 * 1000 milliseconds)
      localStorage.setItem('offerBannerViewLater', Date.now() + (2 * 60 * 60 * 1000));
      if (countdownInterval) clearInterval(countdownInterval);
    });
  }

  if (offerClaimBtn) {
    offerClaimBtn.addEventListener('click', () => {
        // --- New Feature: "Claim Now" Action ---
        alert('Congratulations! Your flash sale discount has been applied!');
        // In a real application, you would redirect to a product page with a discount,
        // add to cart with discount, or show a discount code.
        console.log('Offer claimed!');
        hideOfferBanner();
        localStorage.setItem('offerBannerClosed', 'true'); // Optionally close permanently after claiming
        if (countdownInterval) clearInterval(countdownInterval);
    });
  }

  window.addEventListener('scroll', handleScroll);

  // --- New Feature: Exit-Intent Listener ---
  document.addEventListener('mouseleave', handleExitIntent);


  // --- Initial State & Timers ---
  changeControllerColor('black'); // Set initial color for all controller images

  if (testimonialCards.length > 0) {
    testimonialCards[0].classList.add('active');
    setInterval(rotateTestimonials, 5000); // Rotate every 5 seconds
  }

  // Delayed appearance for the offer banner (if not already dismissed/expired)
  // This initial show is still delayed, but exit-intent can trigger it earlier.
  setTimeout(showOfferBanner, 5000); // Show banner after 5 seconds
});
