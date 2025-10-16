// Robust PS_Controller.js - fallback-friendly and tolerant of multiple HTML variants
document.addEventListener('DOMContentLoaded', () => {
  // Candidate image paths per color (try several common repo layouts)
  const controllerImageCandidates = [
    // Black
    [
      './assets/images/controller-black.png',
      './ps4-controller-png-42098.png',
      './controller.png',
      './assets/controller-black.png'
    ],
    // White
    [
      './assets/images/controller-white.png',
      './ps4-controller-png-42099.png',
      './assets/controller-white.png'
    ],
    // Red
    [
      './assets/images/controller-red.png',
      './ps4-controller-png-42109.png',
      './assets/controller-red.png'
    ]
  ];

  // Helper: choose the first selector that matches an element
  function queryFirst(...selectors) {
    for (const sel of selectors) {
      if (!sel) continue;
      const found = document.querySelector(sel);
      if (found) return found;
    }
    return null;
  }

  // Find interactive image element (supports multiple markup variants)
  const interactiveImage =
    queryFirst(
      '.interactive-image-container .controller-image', // index.html expected
      '.interactive-image img.colours',                // PS_Controller.html variant
      '.interactive-image img',                        // generic fallback
      '.controller-image',
      'img.controller-image'
    );

  // Find color buttons (support different class names)
  const colorButtonsNodeList =
    document.querySelectorAll('.color-buttons button')?.length ? document.querySelectorAll('.color-buttons button') :
    document.querySelectorAll('.colours-button button')?.length ? document.querySelectorAll('.colours-button button') :
    document.querySelectorAll('button.color-black, button.color-white, button.color-red')?.length ? document.querySelectorAll('button.color-black, button.color-white, button.color-red') :
    document.querySelectorAll('.color-buttons button, .colours-button button, .color-black, .color-white, .color-red');

  const colorButtons = Array.from(colorButtonsNodeList || []);

  // Login modal / trigger elements (support different structures)
  const loginContainer = document.getElementById('login-container') || queryFirst('#login-container', '.login-container');
  const loginTriggerButton = queryFirst('#login-btn', '.login-button', '.login-btn', 'button.login-button', 'h3#login-btn');

  // Hamburger and nav menu (optional)
  const hamburgerMenu = queryFirst('.hamburger-menu', '.hamburger');
  const navMenu = queryFirst('header nav ul', 'nav ul');

  // Create a fallback loader that tries each candidate until one succeeds
  function tryLoadImage(imgEl, candidates, idx = 0) {
    if (!imgEl || !candidates || idx >= candidates.length) return;
    const candidate = candidates[idx];

    // Create temporary probe image
    const probe = new Image();
    probe.onload = () => {
      // if it loads successfully, set actual image src
      imgEl.src = candidate;
    };
    probe.onerror = () => {
      // try the next candidate
      tryLoadImage(imgEl, candidates, idx + 1);
    };

    // start loading the probe
    probe.src = candidate;
  }

  // Change controller color with graceful fallback
  function changeControllerColor(index) {
    if (!interactiveImage) return;
    if (index == null || index < 0 || index >= controllerImageCandidates.length) return;

    // Visual transition
    interactiveImage.style.opacity = '0.5';
    interactiveImage.style.transform = 'scale(0.95)';

    // Try to load and set the best candidate for this color
    setTimeout(() => {
      tryLoadImage(interactiveImage, controllerImageCandidates[index], 0);

      // restore visuals after a short delay
      setTimeout(() => {
        interactiveImage.style.opacity = '1';
        interactiveImage.style.transform = 'scale(1)';
      }, 150);
    }, 180);
  }

  // Wire up color buttons
  if (colorButtons.length > 0) {
    colorButtons.forEach((button, index) => {
      // For safety, if there are more buttons than candidates, ignore extras
      const colorIndex = Math.min(index, controllerImageCandidates.length - 1);
      button.addEventListener('click', () => changeControllerColor(colorIndex));
      // hover preview support (optional)
      button.addEventListener('mouseenter', () => changeControllerColor(colorIndex));
    });
  }

  // Toggle login form - keeps existing markup working
  function toggleLoginForm() {
    if (!loginContainer) return;
    const isVisible = loginContainer.classList.contains('visible') || getComputedStyle(loginContainer).display !== 'none' && loginContainer.style.opacity === '1';
    if (isVisible) {
      // hide
      loginContainer.classList.remove('visible');
      loginContainer.style.opacity = '0';
      document.body.style.overflow = 'auto';
    } else {
      // show
      loginContainer.classList.add('visible');
      loginContainer.style.display = loginContainer.style.display || 'flex';
      loginContainer.style.opacity = '1';
      document.body.style.overflow = 'hidden';
    }
  }

  // Expose alias for inline onclick handlers that call loginForm()
  // (This avoids "loginForm is not defined" errors if old HTML uses an inline attribute)
  window.loginForm = toggleLoginForm;

  // Attach event handler for login triggers (both old and new markup)
  if (loginTriggerButton) {
    // If the trigger is a button containing an h3, attach to the outer button as well
    const outerButton = loginTriggerButton.tagName.toLowerCase() === 'h3' ? loginTriggerButton.closest('button') : null;
    const clickable = outerButton || loginTriggerButton;
    if (clickable) clickable.addEventListener('click', toggleLoginForm);
  }

  // Close login when overlay clicked (if markup supports overlay)
  if (loginContainer) {
    loginContainer.addEventListener('click', (ev) => {
      if (ev.target === loginContainer) toggleLoginForm();
    });
  }

  // Keyboard accessibility for modal
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && loginContainer && (loginContainer.classList.contains('visible') || getComputedStyle(loginContainer).opacity === '1')) {
      toggleLoginForm();
    }
  });

  // Mobile menu toggle
  if (hamburgerMenu && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('menu-open');
      hamburgerMenu.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    });
  }

  // Smooth scroll for nav links (support data-target or anchors)
  const navLinks = document.querySelectorAll('header nav ul li, nav ul li, .nav-links a');
  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        // if li contains a link, try to find the anchor; otherwise, use data-target or inner text
        const targetId = link.getAttribute('data-target') || (link.querySelector('a') ? link.querySelector('a').getAttribute('href') : null);
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const el = document.querySelector(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // close mobile menu
          if (navMenu && navMenu.classList.contains('menu-open')) {
            navMenu.classList.remove('menu-open');
            if (hamburgerMenu) hamburgerMenu.classList.remove('active');
          }
        }
      });
    });
  }

  // Initial attempt: load the first color (index 0) so we show a valid image if possible
  if (interactiveImage) {
    tryLoadImage(interactiveImage, controllerImageCandidates[0], 0);
  }
});
