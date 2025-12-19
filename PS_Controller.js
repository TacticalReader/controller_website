document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const header = document.querySelector('header');
  const progressBar = document.getElementById('progress-bar');
  const sections = document.querySelectorAll('main section[id]');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('header nav ul');
  const navLinks = document.querySelectorAll('.smooth-scroll');
  const loadoutItems = document.querySelectorAll('.loadout-item');
  const interactiveImageContainer = document.querySelector('.interactive-image-container');
  const heroImage = document.querySelector('.hero-controller-image');
  const muteBtn = document.getElementById('mute-btn');
  const audioHover = document.getElementById('audio-hover');
  const audioSelect = document.getElementById('audio-select');
  const loginTrigger = document.querySelector('#login-btn');
  const loginContainer = document.querySelector('#login-container');
  const loginCloseBtn = document.querySelector('#login-close-btn');
  const featureCards = document.querySelectorAll('.features-section .card');
  const specItems = document.querySelectorAll('.specs-section .spec-item');
  const scrollToTopBtn = document.querySelector('#scroll-to-top');
  const newsletterForm = document.querySelector('#newsletter-form');
  const copyrightYearEl = document.querySelector('#copyright-year');

  // --- Mission Toast Selectors ---
  const missionToast = document.querySelector('#mission-toast');
  const missionCloseBtn = document.querySelector('#mission-close-btn');
  const missionMinimizeBtn = document.querySelector('#mission-minimize-btn');
  const missionMaximizeBtn = document.querySelector('#mission-maximize-btn');
  const missionClaimBtn = document.querySelector('.mission-claim-btn');
  const hoursEl = document.querySelector('#hours');
  const minutesEl = document.querySelector('#minutes');
  const secondsEl = document.querySelector('#seconds');
  const missionTitleEl = missionToast ? missionToast.querySelector('.mission-title') : null;
  const missionTextEl = missionToast ? missionToast.querySelector('.mission-text') : null;
  const progressRing = document.querySelector('.mission-progress-ring__circle');

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
  const developerCardsContainer = document.querySelector('.developer-cards-container');

  // --- Heatmap Selectors ---
  const ergonomicCard = document.getElementById('ergonomic-card');
  const heatmapSvg = document.getElementById('controller-heatmap-svg');
  const heatmapTooltip = document.getElementById('heatmap-tooltip');

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
  let lastScrollY = window.scrollY;
  let isMuted = false;
  let isTransitioning = false; // Prevent spamming color changes

  // --- Functions ---

  // Converts a date into a human-readable string like "2 hours ago"
  const timeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  // Handles scroll-based UI changes: progress bar, header visibility, scroll-to-top button
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Progress Bar
    if (progressBar) {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (currentScrollY / scrollHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    }

    // Hide/Show Header
    if (header) {
        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
        header.classList.toggle('scrolled', currentScrollY > 20);
    }

    // Scroll-to-top button
    if (scrollToTopBtn) {
      scrollToTopBtn.classList.toggle('visible', currentScrollY > 300);
    }

    // Close spec pop-up on scroll
    if (activeSpecItem) {
        closeSpecPopup();
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  };

  // Intersection Observer for Scroll-Spying
  const initScrollSpy = () => {
    if (!sections.length) return;

    const observerOptions = {
        rootMargin: '-80px 0px -50% 0px', // Trigger when section is in the upper part of the viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`nav a[href="#${id}"]`);
            if (entry.isIntersecting) {
                document.querySelectorAll('nav a.active').forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  };

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

  // Plays a sound if not muted
  const playSound = (audioEl) => {
      if (!isMuted && audioEl) {
          audioEl.currentTime = 0;
          audioEl.play().catch(error => console.error("Audio play failed:", error));
      }
  };

  // Toggles sound mute state
  const toggleMute = () => {
      if (!muteBtn) return;
      isMuted = !isMuted;
      muteBtn.classList.toggle('muted', isMuted);
      muteBtn.setAttribute('aria-pressed', String(isMuted));
      const icon = muteBtn.querySelector('i');
      if (isMuted) {
          icon.classList.remove('fa-volume-up');
          icon.classList.add('fa-volume-mute');
          muteBtn.setAttribute('aria-label', 'Unmute sounds');
      } else {
          icon.classList.remove('fa-volume-mute');
          icon.classList.add('fa-volume-up');
          muteBtn.setAttribute('aria-label', 'Mute sounds');
      }
  };

  // Changes the controller image based on the selected color with a slide animation
  const changeControllerColor = (color) => {
      if (!controllerImages[color] || isTransitioning || !interactiveImageContainer) return;

      const currentActiveItem = document.querySelector('.loadout-item.active');
      if (currentActiveItem && currentActiveItem.dataset.color === color) return;

      isTransitioning = true;
      playSound(audioSelect);

      // Update active state on buttons
      loadoutItems.forEach(item => item.classList.remove('active'));
      const newItem = document.querySelector(`.loadout-item[data-color="${color}"]`);
      if (newItem) newItem.classList.add('active');

      // Handle image transition
      const currentImage = interactiveImageContainer.querySelector('img');
      if (currentImage) {
          currentImage.classList.add('slide-out');
          currentImage.addEventListener('animationend', () => {
              currentImage.remove();
          }, { once: true });
      }

      const newImage = document.createElement('img');
      newImage.src = controllerImages[color];
      newImage.alt = `Interactive controller showing the ${color} skin`;
      newImage.classList.add('slide-in');
      interactiveImageContainer.appendChild(newImage);

      newImage.addEventListener('animationend', () => {
          isTransitioning = false;
      }, { once: true });

      // Also update the static hero image (with a simple fade)
      if (heroImage) {
          heroImage.style.opacity = '0.5';
          setTimeout(() => {
              heroImage.src = controllerImages[color];
              heroImage.style.opacity = '1';
          }, 200);
      }
  };

  // Initial setup for the first image
  const initControllerImage = () => {
      if (interactiveImageContainer && !interactiveImageContainer.querySelector('img')) {
          const initialImage = document.createElement('img');
          initialImage.src = controllerImages['black'];
          initialImage.alt = 'Interactive controller showing the black skin';
          interactiveImageContainer.appendChild(initialImage);
      }
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
  const getSkeletonLoaderHTML = () => {
    return Array(3).fill('').map(() => `
        <div class="skeleton-card">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-text">
                <div class="name"></div>
                <div class="stats"></div>
            </div>
        </div>
    `).join('');
  };

  const getCommitStatus = (authorLogin, lastCommitMap) => {
      const lastCommit = lastCommitMap[authorLogin];
      if (!lastCommit) {
          return { className: 'offline', text: 'Offline', timeAgoString: 'No recent commits' };
      }

      const now = new Date();
      const commitDate = new Date(lastCommit.date);
      const diffHours = (now - commitDate) / (1000 * 60 * 60);
      const timeAgoString = `Last commit: ${timeAgo(commitDate)}`;

      if (diffHours <= 24) {
          return { className: 'online', text: 'Active in last 24 hours', timeAgoString };
      }
      if (diffHours <= 24 * 7) {
          return { className: 'away', text: 'Active in last week', timeAgoString };
      }
      return { className: 'offline', text: 'Offline', timeAgoString };
  };

  const createContributionGraphHTML = (weeks) => {
      if (!weeks || weeks.length === 0) return '';
      const last12Weeks = weeks.slice(-12); // Get last 12 weeks
      const maxCommits = Math.max(...last12Weeks.map(w => w.c), 1); // Avoid division by zero

      const bars = last12Weeks.map(week => {
          const commitCount = week.c;
          const height = Math.max(5, (commitCount / maxCommits) * 100); // min height of 5%
          let level = 0;
          if (commitCount > 0) level = 1;
          if (commitCount > maxCommits * 0.25) level = 2;
          if (commitCount > maxCommits * 0.5) level = 3;
          if (commitCount > maxCommits * 0.75) level = 4;
          
          return `<div class="graph-bar" style="height: ${height}%;" data-level="${level}" title="Week of ${new Date(week.w * 1000).toLocaleDateString()}: ${commitCount} commits"></div>`;
      }).join('');

      return `<div class="contribution-graph" aria-label="Contribution activity over the last 12 weeks">${bars}</div>`;
  };

  const createContributorCardHTML = (contributor) => {
    const linkHTML = contributor.latestCommitUrl
        ? `<a href="${contributor.latestCommitUrl}" target="_blank" rel="noopener noreferrer" class="developer-cta">View Loadout</a>`
        : `<a href="${contributor.author.html_url}" target="_blank" rel="noopener noreferrer" class="developer-cta" aria-label="View ${contributor.author.login}'s GitHub profile"><i class="fab fa-github"></i> View Profile</a>`;

    return `
      <div class="developer-card">
        <img src="${contributor.author.avatar_url}" alt="Avatar for ${contributor.author.login}">
        <div class="developer-info">
          <h4>
            <span class="status-dot ${contributor.status.className}" title="${contributor.status.text}"></span>
            ${contributor.author.login}
          </h4>
          <div class="developer-stats">
            <i class="fas fa-history"></i> ${contributor.status.timeAgoString}
          </div>
          ${createContributionGraphHTML(contributor.weeks)}
        </div>
        <div class="developer-link">
          ${linkHTML}
        </div>
      </div>
    `;
  };

  const renderContributors = (contributors) => {
    if (!developerCardsContainer) return;
    setTimeout(() => {
        developerCardsContainer.innerHTML = contributors.map(createContributorCardHTML).join('');
    }, 300); // Wait for boot-up animation
  };

  const getFallbackData = () => {
    return [
      {
        author: {
          login: 'TacticalReader',
          avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
          html_url: 'https://github.com/TacticalReader',
        },
        total: '100+',
        weeks: [], // No graph for fallback
        status: { className: 'online', text: 'Online (Fallback)', timeAgoString: 'Last commit: just now' },
        latestCommitUrl: 'https://github.com/TacticalReader/controller_website'
      },
      {
        author: {
          login: 'ErrorBot',
          avatar_url: 'https://i.pravatar.cc/150?u=error',
          html_url: '#',
        },
        total: '0',
        weeks: [],
        status: { className: 'offline', text: 'API Error', timeAgoString: 'Could not fetch commit data' },
        latestCommitUrl: null
      }
    ];
  };

  const fetchContributors = async () => {
    if (!developerCardsContainer) return;
    developerCardsContainer.innerHTML = getSkeletonLoaderHTML();

    const cacheKey = 'github_contributors_v3'; // Incremented cache key
    const cachedData = localStorage.getItem(cacheKey);
    const now = new Date().getTime();

    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (now - timestamp < 3600 * 1000) { // 1 hour cache
            renderContributors(data);
            return;
        }
    }

    try {
        const [statsResponse, commitsResponse] = await Promise.all([
            fetch('https://api.github.com/repos/TacticalReader/controller_website/stats/contributors'),
            fetch('https://api.github.com/repos/TacticalReader/controller_website/commits?per_page=100')
        ]);

        if (!statsResponse.ok || !commitsResponse.ok) {
            throw new Error(`GitHub API error: Stats ${statsResponse.status}, Commits ${commitsResponse.status}`);
        }

        if (statsResponse.status === 202) {
            developerCardsContainer.innerHTML = `<p style="color: var(--hud-text);">Calculating contributor stats... please try again in a moment.</p>`;
            setTimeout(fetchContributors, 5000);
            return;
        }

        const contributorsStats = await statsResponse.json();
        const commits = await commitsResponse.json();

        const lastCommitMap = {};
        commits.forEach(commit => {
            if (commit.author && commit.author.login) {
                const login = commit.author.login;
                const commitDate = commit.commit.author.date;
                if (!lastCommitMap[login] || new Date(commitDate) > new Date(lastCommitMap[login].date)) {
                    lastCommitMap[login] = {
                        date: commitDate,
                        url: commit.html_url
                    };
                }
            }
        });

        const processedContributors = contributorsStats.map(contributor => {
            const login = contributor.author.login;
            const lastCommit = lastCommitMap[login];
            return {
                ...contributor,
                status: getCommitStatus(login, lastCommitMap),
                latestCommitUrl: lastCommit ? lastCommit.url : null
            };
        }).sort((a, b) => b.total - a.total);

        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: processedContributors }));
        renderContributors(processedContributors);

    } catch (error) {
        console.error("Failed to fetch contributors:", error);
        renderContributors(getFallbackData());
    }
  };

  const openDeveloperModal = () => {
    if (!developerModalOverlay) return;
    requestAnimationFrame(() => {
        developerModalOverlay.classList.add('visible');
        document.body.classList.add('no-scroll');
        fetchContributors();
    });

    const modalContent = developerModalOverlay.querySelector('.developer-modal-content');
    if (modalContent) {
        modalContent.addEventListener('animationend', () => {
            if (developerModalCloseBtn) developerModalCloseBtn.focus();
        }, { once: true });
    }
  };

  const closeDeveloperModal = () => {
    if (!developerModalOverlay) return;
    developerModalOverlay.classList.add('closing');

    const modalContent = developerModalOverlay.querySelector('.developer-modal-content');
    const onAnimationEnd = () => {
        developerModalOverlay.classList.remove('visible', 'closing');
        document.body.classList.remove('no-scroll');
        if (developerCardsContainer) developerCardsContainer.innerHTML = getSkeletonLoaderHTML();
    };

    if (modalContent) {
        modalContent.addEventListener('animationend', onAnimationEnd, { once: true });
    } else {
        setTimeout(onAnimationEnd, 400); // Fallback
    }
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

  // --- Mission Toast Functions ---
  const dismissMission = () => {
    if (!missionToast) return;
    missionToast.classList.remove('visible');
    localStorage.setItem('missionState', 'dismissed');
    if (countdownInterval) clearInterval(countdownInterval);
  };

  const minimizeMission = () => {
    if (!missionToast) return;
    missionToast.classList.add('minimized');
    localStorage.setItem('missionState', 'minimized');
  };

  const maximizeMission = () => {
    if (!missionToast) return;
    missionToast.classList.remove('minimized');
    localStorage.setItem('missionState', 'expanded');
  };

  const initMissionToast = () => {
    if (!missionToast) return;
    const missionState = localStorage.getItem('missionState');

    if (missionState === 'dismissed' || localStorage.getItem('missionExpired') === 'true') {
      return;
    }

    missionToast.classList.add('visible');
    if (missionState === 'minimized') {
      missionToast.classList.add('minimized');
    } else {
      localStorage.setItem('missionState', 'expanded');
    }
    startCountdown();
  };

  const startCountdown = () => {
    if (!hoursEl || !minutesEl || !secondsEl || !missionClaimBtn || !missionTitleEl || !missionTextEl || !progressRing) return;
    if (countdownInterval) clearInterval(countdownInterval);

    const radius = progressRing.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;

    let endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const totalSecondsInDay = 24 * 60 * 60;

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeLeft = endOfDay.getTime() - now.getTime();

      if (timeLeft < 0) {
        clearInterval(countdownInterval);
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        
        missionTitleEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Mission Expired!';
        missionTitleEl.style.color = 'var(--accent)';
        missionTextEl.textContent = 'This mission has ended. Stay tuned for the next one!';
        missionClaimBtn.disabled = true;
        missionClaimBtn.style.opacity = '0.6';
        missionClaimBtn.style.cursor = 'not-allowed';
        if (missionMinimizeBtn) missionMinimizeBtn.style.display = 'none';
        localStorage.setItem('missionExpired', 'true');
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');

      const secondsSinceStartOfDay = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
      const progress = secondsSinceStartOfDay / totalSecondsInDay;
      const offset = circumference - progress * circumference;
      progressRing.style.strokeDashoffset = offset;

    }, 1000);
  };

  const handleExitIntent = (e) => {
    if (e.clientY < 50 && !exitIntentTriggered && missionToast && !missionToast.classList.contains('visible') && localStorage.getItem('missionState') !== 'dismissed' && localStorage.getItem('missionExpired') !== 'true') {
        initMissionToast();
        exitIntentTriggered = true;
    }
  };

  // --- Ergonomic Heatmap Functions ---
  const initHeatmap = () => {
      if (!ergonomicCard || !heatmapSvg || !heatmapTooltip) return;

      const heatmapZones = heatmapSvg.querySelectorAll('path[data-tooltip]');

      ergonomicCard.addEventListener('mouseenter', () => {
          heatmapSvg.classList.add('visible');
      });

      ergonomicCard.addEventListener('mouseleave', () => {
          heatmapSvg.classList.remove('visible');
      });

      heatmapZones.forEach(zone => {
          zone.addEventListener('mouseenter', (e) => {
              const tooltipText = zone.dataset.tooltip;
              if (tooltipText) {
                  heatmapTooltip.textContent = tooltipText;
                  heatmapTooltip.classList.add('visible');
              }
          });

          zone.addEventListener('mousemove', (e) => {
              // Position tooltip above the cursor
              heatmapTooltip.style.left = `${e.clientX}px`;
              heatmapTooltip.style.top = `${e.clientY}px`;
          });

          zone.addEventListener('mouseleave', () => {
              heatmapTooltip.classList.remove('visible');
          });
      });
  };

  // --- Intersection Observer for Fade-in Animations ---
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

  loadoutItems.forEach(item => {
      item.addEventListener('click', () => changeControllerColor(item.dataset.color));
      item.addEventListener('mouseenter', () => playSound(audioHover));
  });

  if (muteBtn) muteBtn.addEventListener('click', toggleMute);

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

  // Mission Toast Listeners
  if (missionCloseBtn) missionCloseBtn.addEventListener('click', dismissMission);
  if (missionMinimizeBtn) missionMinimizeBtn.addEventListener('click', minimizeMission);
  if (missionMaximizeBtn) missionMaximizeBtn.addEventListener('click', maximizeMission);
  if (missionClaimBtn) {
    missionClaimBtn.addEventListener('click', () => {
        alert('Mission Accepted! Your reward has been applied.');
        dismissMission();
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

  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('mouseleave', handleExitIntent);

  // --- Initializations ---
  initControllerImage();
  if (heroImage) heroImage.src = controllerImages['black']; // Sync hero image

  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }

  fetchAndInitTestimonials();
  initScrollSpy();
  initHeatmap();

  setTimeout(initMissionToast, 5000);
});
