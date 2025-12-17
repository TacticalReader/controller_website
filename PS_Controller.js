document.addEventListener('DOMContentLoaded', () => {
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
  const scrollToTopBtn = document.querySelector('#scroll-to-top');
  const newsletterForm = document.querySelector('#newsletter-form');
  const offerBanner = document.querySelector('#offer-banner');
  const offerCloseBtn = document.querySelector('#offer-close-btn');
  const offerViewLaterBtn = document.querySelector('#offer-view-later-btn');
  const offerClaimBtn = document.querySelector('.offer-claim-btn');
  const hoursEl = document.querySelector('#hours');
  const minutesEl = document.querySelector('#minutes');
  const secondsEl = document.querySelector('#seconds');
  const offerTitleEl = offerBanner ? offerBanner.querySelector('.offer-title') : null;
  const offerTextEl = offerBanner ? offerBanner.querySelector('.offer-text') : null;
  const copyrightYearEl = document.querySelector('#copyright-year');

  // --- Spec Pop-up Selectors ---
  const specPopupContainer = document.getElementById('spec-popup-container');
  const specPopupTitle = document.getElementById('spec-popup-title');
  const specPopupDetails = document.getElementById('spec-popup-details');

  // --- Wall of Victory Selectors ---
  const victoryWallGrid = document.querySelector('.victory-wall-grid');
  const loadMoreBtn = document.querySelector('#load-more-reviews');

  // --- Developer Modal Selectors ---
  const developerCreditsTrigger = document.querySelector('#developer-credits');
  const developerModalOverlay = document.getElementById('developer-modal-overlay');
  const developerModalCloseBtn = document.getElementById('developer-modal-close-btn');

  // --- State ---
  const controllerImages = {
    black: './ps4-controller-png-42098.png',
    white: './ps4-controller-png-42099.png',
    red: './ps4-controller-png-42109.png',
  };
  let allTestimonials = [];
  let currentTestimonialPage = 0;
  const testimonialsPerPage = 6;
  let countdownInterval;
  let exitIntentTriggered = false;
  let activeSpecItem = null; // Track the currently active spec item for the pop-up

  // --- Functions ---

  // Toggles the mobile navigation menu
  const toggleMobileMenu = () => {
    if (!hamburgerMenu || !navMenu) return;
    const isOpen = navMenu.classList.toggle('menu-open');
    hamburgerMenu.classList.toggle('active');
    hamburgerMenu.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  };

  // Toggles the login modal visibility
  const toggleLoginModal = () => {
    if (!loginContainer) return;
    const isVisible = loginContainer.classList.toggle('visible');
    document.body.classList.toggle('no-scroll', isVisible);
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
    if (!targetId) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 90;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
      });
    }
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

  // --- Specifications Pop-up Functions ---
  const openSpecPopup = (item) => {
    if (!specPopupContainer || !item) return;
    
    if (activeSpecItem) {
        closeSpecPopup();
    }

    activeSpecItem = item;
    const title = item.dataset.title;
    const details = item.dataset.details;

    specPopupTitle.textContent = title;
    specPopupDetails.textContent = details;

    specPopupContainer.classList.add('visible');

    positionSpecPopup(item);
  };

  const positionSpecPopup = (item) => {
    if (!specPopupContainer || !item) return;

    const itemRect = item.getBoundingClientRect();
    const popupRect = specPopupContainer.getBoundingClientRect();
    const popupMargin = 15;

    let top, left;

    left = itemRect.left + (itemRect.width / 2) - (popupRect.width / 2);

    if (itemRect.top > popupRect.height + popupMargin) {
        // Position popup ABOVE the item, so the pointer should point down.
        top = itemRect.top - popupRect.height - popupMargin;
        specPopupContainer.classList.remove('popup-from-bottom');
        specPopupContainer.classList.add('popup-from-top');
    } else {
        // Position popup BELOW the item, so the pointer should point up.
        top = itemRect.bottom + popupMargin;
        specPopupContainer.classList.remove('popup-from-top');
        specPopupContainer.classList.add('popup-from-bottom');
    }

    if (left < 10) left = 10;
    if (left + popupRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popupRect.width - 10;
    }

    specPopupContainer.style.top = `${top}px`;
    specPopupContainer.style.left = `${left}px`;
  };

  const closeSpecPopup = () => {
    if (specPopupContainer) {
        specPopupContainer.classList.remove('visible');
    }
    activeSpecItem = null;
  };

  // --- Wall of Victory Functions ---
  const createVictoryCard = (testimonial) => {
      const card = document.createElement('div');
      card.className = 'victory-card';

      const ratingPercentage = (testimonial.rating / 5) * 100;

      card.innerHTML = `
          <div class="victory-card-header">
              <img src="${testimonial.avatar}" alt="Avatar of ${testimonial.username}">
              <div class="victory-user-info">
                  <h4>${testimonial.username}</h4>
                  <span>${testimonial.rank}</span>
              </div>
              ${testimonial.verified ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>' : ''}
          </div>
          <div class="victory-card-body">
              <blockquote>${testimonial.quote}</blockquote>
          </div>
          <div class="victory-card-footer">
              <div class="player-stats">
                  <i class="fas fa-clock"></i> Hours Played: ${testimonial.hoursPlayed}+
              </div>
              <div class="rating-bar-container" title="${testimonial.rating} out of 5 stars">
                  <div class="rating-bar-fill" style="width: ${ratingPercentage}%;"></div>
              </div>
          </div>
      `;
      return card;
  };

  const appendTestimonials = () => {
      if (!victoryWallGrid) return;

      const startIndex = currentTestimonialPage * testimonialsPerPage;
      const endIndex = startIndex + testimonialsPerPage;
      const testimonialsToAppend = allTestimonials.slice(startIndex, endIndex);

      if (testimonialsToAppend.length === 0 && currentTestimonialPage > 0) {
          if (loadMoreBtn) loadMoreBtn.style.display = 'none'; // No more reviews
          return;
      }

      testimonialsToAppend.forEach((testimonial, index) => {
          const card = createVictoryCard(testimonial);
          card.style.transitionDelay = `${index * 100}ms`;
          victoryWallGrid.appendChild(card);
          observer.observe(card);
      });

      currentTestimonialPage++;

      if (endIndex >= allTestimonials.length) {
          if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      }
  };

  const handleLoadMore = () => {
      if (!loadMoreBtn) return;
      const icon = loadMoreBtn.querySelector('i');
      
      loadMoreBtn.disabled = true;
      if (icon) icon.classList.add('loading');

      setTimeout(() => {
          appendTestimonials();
          loadMoreBtn.disabled = false;
          if (icon) icon.classList.remove('loading');
      }, 500);
  };

  const fetchAndInitTestimonials = async () => {
      if (!victoryWallGrid) return;
      try {
          const response = await fetch('./testimonials.json');
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          allTestimonials = await response.json();
          if (allTestimonials.length > 0) {
            appendTestimonials();
          } else {
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
          }
      } catch (error) {
          console.error('Failed to fetch testimonials:', error);
          if (victoryWallGrid) victoryWallGrid.innerHTML = '<p style="color: white; text-align: center;">Could not load reviews at this time.</p>';
          if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      }
  };

  // --- Developer Modal Functions ---
  const openDeveloperModal = () => {
    if (!developerModalOverlay) return;
    developerModalOverlay.classList.add('visible');
    document.body.classList.add('no-scroll');
  };

  const closeDeveloperModal = () => {
    if (!developerModalOverlay) return;
    developerModalOverlay.classList.remove('visible');
    document.body.classList.remove('no-scroll');
  };

  // Handles newsletter form submission
  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.classList.contains('subscribed')) return; // Prevent re-submission

    const input = form.querySelector('#newsletter-email');
    const button = form.querySelector('button');
    const message = form.querySelector('#newsletter-feedback');
    if (!input || !button || !message) return;

    input.classList.remove('invalid');
    message.classList.remove('error');
    message.textContent = '';
    input.setAttribute('aria-invalid', 'false');

    const email = input.value.trim();
    const emailRegex = /^[^ \s@]+@[^ \s@]+\.[^ \s@]+$/;

    if (email && emailRegex.test(email)) {
      form.classList.add('subscribed');
      message.textContent = 'Thank you! News is on its way.';
      button.innerHTML = '<i class="fas fa-check"></i> Subscribed';
      input.disabled = true;
      button.disabled = true;
    } else {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      message.textContent = 'Please enter a valid email address.';
      message.classList.add('error');
      
      setTimeout(() => {
        input.classList.remove('invalid');
      }, 2500);
    }
  };

  // --- Offer Banner Functions ---
  const hideOfferBanner = () => {
    if (offerBanner) {
      offerBanner.classList.remove('visible');
    }
  };

  const showOfferBanner = () => {
    if (!offerBanner) return;
    if (localStorage.getItem('offerBannerClosed') === 'true') return;

    const viewLaterExpiry = localStorage.getItem('offerBannerViewLater');
    if (viewLaterExpiry && Date.now() < parseInt(viewLaterExpiry, 10)) {
        return;
    } else if (viewLaterExpiry) {
        localStorage.removeItem('offerBannerViewLater');
    }

    if (localStorage.getItem('offerExpired') === 'true') return;

    offerBanner.classList.add('visible');
    startCountdown();
  };

  const startCountdown = () => {
    if (!hoursEl || !minutesEl || !secondsEl || !offerClaimBtn || !offerTitleEl || !offerTextEl) return;
    if (countdownInterval) clearInterval(countdownInterval);

    let endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = endOfDay.getTime() - now.getTime();

      if (timeLeft < 0) {
        clearInterval(countdownInterval);
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        
        offerTitleEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Offer Expired!';
        offerTitleEl.style.color = 'var(--accent)';
        offerTextEl.textContent = 'This flash sale has ended. Stay tuned for more great deals!';
        offerClaimBtn.disabled = true;
        offerClaimBtn.style.opacity = '0.6';
        offerClaimBtn.style.cursor = 'not-allowed';
        if (offerViewLaterBtn) offerViewLaterBtn.style.display = 'none';
        localStorage.setItem('offerExpired', 'true');
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

  const handleExitIntent = (e) => {
    if (e.clientY < 50 && !exitIntentTriggered && offerBanner && !offerBanner.classList.contains('visible') && localStorage.getItem('offerBannerClosed') !== 'true' && localStorage.getItem('offerExpired') !== 'true') {
        showOfferBanner();
        exitIntentTriggered = true;
    }
  };

  // --- Intersection Observer for Animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  featureCards.forEach(card => observer.observe(card));
  specItems.forEach(item => observer.observe(item));

  // --- Event Listeners ---

  if (hamburgerMenu) hamburgerMenu.addEventListener('click', toggleMobileMenu);
  if (loginTrigger) loginTrigger.addEventListener('click', toggleLoginModal);
  if (loginCloseBtn) loginCloseBtn.addEventListener('click', toggleLoginModal);
  if (loginContainer) loginContainer.addEventListener('click', (e) => e.target === loginContainer && toggleLoginModal());

  colorButtons.forEach(button => {
    button.addEventListener('click', () => changeControllerColor(button.dataset.color));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
  });

  if (scrollToTopBtn) scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', handleLoadMore);

  // Spec Item Pop-up Listeners
  specItems.forEach(item => {
    item.addEventListener('click', () => openSpecPopup(item));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openSpecPopup(item);
        }
    });
  });

  // Offer Banner Listeners
  if (offerCloseBtn) {
    offerCloseBtn.addEventListener('click', () => {
      hideOfferBanner();
      localStorage.setItem('offerBannerClosed', 'true');
      if (countdownInterval) clearInterval(countdownInterval);
    });
  }
  if (offerViewLaterBtn) {
    offerViewLaterBtn.addEventListener('click', () => {
      hideOfferBanner();
      localStorage.setItem('offerBannerViewLater', Date.now() + (2 * 60 * 60 * 1000));
      if (countdownInterval) clearInterval(countdownInterval);
    });
  }
  if (offerClaimBtn) {
    offerClaimBtn.addEventListener('click', () => {
        alert('Congratulations! Your flash sale discount has been applied!');
        hideOfferBanner();
        localStorage.setItem('offerBannerClosed', 'true');
        if (countdownInterval) clearInterval(countdownInterval);
    });
  }

  // Developer Modal Listeners
  if (developerCreditsTrigger) developerCreditsTrigger.addEventListener('click', openDeveloperModal);
  if (developerModalCloseBtn) developerModalCloseBtn.addEventListener('click', closeDeveloperModal);
  if (developerModalOverlay) developerModalOverlay.addEventListener('click', (e) => e.target === developerModalOverlay && closeDeveloperModal());

  // Global Keydown Listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (loginContainer && loginContainer.classList.contains('visible')) toggleLoginModal();
      if (developerModalOverlay && developerModalOverlay.classList.contains('visible')) closeDeveloperModal();
      if (activeSpecItem) closeSpecPopup();
    }
  });

  // Global Click Listener for closing pop-ups
  document.addEventListener('click', (e) => {
    if (activeSpecItem && !activeSpecItem.contains(e.target) && !specPopupContainer.contains(e.target)) {
        closeSpecPopup();
    }
  });

  const combinedScrollHandler = () => {
    handleScroll();
    if (activeSpecItem) {
        closeSpecPopup();
    }
  };

  window.addEventListener('scroll', combinedScrollHandler, { passive: true });
  document.addEventListener('mouseleave', handleExitIntent);

  // --- Initializations ---
  changeControllerColor('black');

  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  fetchAndInitTestimonials();

  setTimeout(showOfferBanner, 5000);
});
