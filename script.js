/* ================================================
   JOY Stationery — Enhanced JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==== PAGE LOADER ==== */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });
  // Fallback in case load event already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ==== SCROLL PROGRESS BAR ==== */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateProgress);

  /* ==== PARALLAX HERO ==== */
  const heroParallax = document.getElementById('heroParallax');
  function updateParallax() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroParallax.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
  }
  window.addEventListener('scroll', updateParallax);

  /* ==== TYPING EFFECT ==== */
  const typingEl = document.getElementById('typingText');
  const phrases = ['Office Stationery', 'Packaging Supplies', 'Desk Organisation', 'Planning Tools', 'Writing Instruments'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  // Add cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  typingEl.parentNode.insertBefore(cursor, typingEl.nextSibling);

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // pause before deleting
      }
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // pause before typing next
      }
    }

    setTimeout(type, typingSpeed);
  }
  type();

  /* ==== NAVBAR SCROLL ==== */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    backToTop.classList.toggle('visible', scrollY > 600);
  });

  /* ==== MOBILE NAV TOGGLE ==== */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ==== BACK TO TOP ==== */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==== ANIMATED STAT COUNTERS ==== */
  function animateCounters() {
    document.querySelectorAll('.stat__number').forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - (1 - progress) * (1 - progress);
        counter.textContent = Math.round(target * ease);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.stats');
  let statsCounted = false;
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsCounted) {
      statsCounted = true;
      animateCounters();
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);

  /* ==== SCROLL FADE-IN ANIMATION ==== */
  const fadeElements = document.querySelectorAll(
    '.content-block__grid, .intro__grid, .supply-list, .social__inner, .contact__grid, .delivery__locations, .why-us__grid, .faq__list'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeElements.forEach(el => fadeObserver.observe(el));

  /* ==== WHY-US CARDS STAGGER ==== */
  const whyCards = document.querySelectorAll('.why-card');
  const whyObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      whyCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity .5s ease ${i * .12}s, transform .5s ease ${i * .12}s`;
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      });
      whyObserver.unobserve(entries[0].target);
    }
  }, { threshold: 0.2 });

  const whyGrid = document.querySelector('.why-us__grid');
  if (whyGrid) whyObserver.observe(whyGrid);

  /* ==== BRANDS CAROUSEL SLIDER (Animated) ==== */
  const brandsTrack = document.getElementById('brandsTrack');
  const brandsPrev = document.getElementById('brandsPrev');
  const brandsNext = document.getElementById('brandsNext');
  const brandsDots = document.getElementById('brandsDots');

  if (brandsTrack && brandsPrev && brandsNext && brandsDots) {
    const brandItems = brandsTrack.querySelectorAll('.brand-item');
    let brandsPerView = 5;
    let currentBrandPage = 0;
    let totalBrandPages = 1;
    let autoSlideInterval;
    let isAnimating = false;

    function getBrandsPerView() {
      const w = window.innerWidth;
      if (w <= 480) return 2;
      if (w <= 768) return 3;
      if (w <= 1024) return 4;
      return 5;
    }

    // Staggered entrance animation for brand items
    function animateBrandItems() {
      brandItems.forEach((item, i) => {
        item.classList.remove('visible');
        item.style.transitionDelay = (i * 0.08) + 's';
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          brandItems.forEach(item => item.classList.add('visible'));
        });
      });
    }

    // Animate slide with scale effect
    function slideTo(page) {
      if (isAnimating) return;
      isAnimating = true;

      const wrapper = brandsTrack.parentElement;
      const gap = parseInt(getComputedStyle(brandsTrack).gap) || 24;
      const itemWidth = (wrapper.offsetWidth - gap * (brandsPerView - 1)) / brandsPerView;

      // Scale down items briefly during transition
      brandItems.forEach(item => {
        item.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        item.style.transform = 'scale(0.92)';
        item.style.opacity = '0.6';
      });

      setTimeout(() => {
        const offset = page * (itemWidth + gap) * brandsPerView;
        brandsTrack.style.transform = 'translateX(-' + offset + 'px)';

        setTimeout(() => {
          brandItems.forEach(item => {
            item.style.transform = '';
            item.style.opacity = '';
          });
          isAnimating = false;
        }, 350);
      }, 200);

      // Update dots
      const dots = brandsDots.querySelectorAll('.brands-carousel__dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === page);
      });
    }

    function updateBrandsCarousel(animate) {
      brandsPerView = getBrandsPerView();
      totalBrandPages = Math.ceil(brandItems.length / brandsPerView);
      if (currentBrandPage >= totalBrandPages) currentBrandPage = totalBrandPages - 1;

      const wrapper = brandsTrack.parentElement;
      const gap = parseInt(getComputedStyle(brandsTrack).gap) || 24;
      const itemWidth = (wrapper.offsetWidth - gap * (brandsPerView - 1)) / brandsPerView;

      brandItems.forEach(item => {
        item.style.minWidth = itemWidth + 'px';
        item.style.maxWidth = itemWidth + 'px';
      });

      if (!animate) {
        const offset = currentBrandPage * (itemWidth + gap) * brandsPerView;
        brandsTrack.style.transform = 'translateX(-' + offset + 'px)';
      }

      // Build dots
      brandsDots.innerHTML = '';
      for (let i = 0; i < totalBrandPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'brands-carousel__dot' + (i === currentBrandPage ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
        dot.addEventListener('click', () => {
          if (i === currentBrandPage) return;
          currentBrandPage = i;
          slideTo(currentBrandPage);
          resetAutoSlide();
        });
        brandsDots.appendChild(dot);
      }
    }

    function goNext() {
      currentBrandPage = (currentBrandPage + 1) % totalBrandPages;
      slideTo(currentBrandPage);
      resetAutoSlide();
    }

    function goPrev() {
      currentBrandPage = (currentBrandPage - 1 + totalBrandPages) % totalBrandPages;
      slideTo(currentBrandPage);
      resetAutoSlide();
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        currentBrandPage = (currentBrandPage + 1) % totalBrandPages;
        slideTo(currentBrandPage);
      }, 4000);
    }

    // Button click with ripple animation
    function addRipple(btn, e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.4);transform:scale(0);animation:btnRipple 0.6s ease-out;pointer-events:none;';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    brandsPrev.addEventListener('click', (e) => { addRipple(brandsPrev, e); goPrev(); });
    brandsNext.addEventListener('click', (e) => { addRipple(brandsNext, e); goNext(); });

    // Touch/swipe support
    let touchStartX = 0;
    brandsTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    brandsTrack.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext(); else goPrev();
      }
    }, { passive: true });

    // Keyboard support
    const carousel = document.getElementById('brandsCarousel');
    if (carousel) {
      carousel.setAttribute('tabindex', '0');
      carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { goPrev(); e.preventDefault(); }
        if (e.key === 'ArrowRight') { goNext(); e.preventDefault(); }
      });
    }

    // Entrance animation on scroll
    const brandsSection = document.querySelector('.brands');
    const brandsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateBrandItems();
        brandsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    if (brandsSection) brandsObserver.observe(brandsSection);

    window.addEventListener('resize', () => updateBrandsCarousel(false));
    updateBrandsCarousel(false);
    resetAutoSlide();
  }

  /* ==== SUPPLY LIST ITEMS STAGGER ==== */
  const supplyItems = document.querySelectorAll('.supply-list__items span');
  const supplyObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      supplyItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = `opacity .4s ease ${i * .08}s, transform .4s ease ${i * .08}s`;
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      });
      supplyObserver.unobserve(entries[0].target);
    }
  }, { threshold: 0.3 });

  const supplyList = document.querySelector('.supply-list');
  if (supplyList) supplyObserver.observe(supplyList);

  /* ==== FAQ ACCORDION ==== */
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));

      // Open clicked (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  /* ==== NEWSLETTER FORM ==== */
  document.getElementById('newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    alert(`Thanks for subscribing with ${input.value}! We'll keep you updated.`);
    input.value = '';
  });

  /* ==== CONTACT FORM ==== */
  // Form now submits via FormSubmit.co — no JS override needed

  /* ==== SECTION REVEAL (Slide-in Left/Right) ==== */
  const revealSections = document.querySelectorAll('.reveal-section');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealSections.forEach(section => revealObserver.observe(section));

  /* ==== REQUEST A QUOTE MODAL ==== */
  const quoteModal = document.getElementById('quoteModal');
  const quoteModalClose = document.getElementById('quoteModalClose');
  const quoteTriggers = document.querySelectorAll('.quote-trigger');

  function openModal() {
    quoteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
      quoteModal.querySelector('input')?.focus();
    }, 300);
  }

  function closeModal() {
    quoteModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  quoteTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  quoteModalClose.addEventListener('click', closeModal);

  // Close on overlay click
  quoteModal.addEventListener('click', e => {
    if (e.target === quoteModal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && quoteModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Quote form submit
  document.getElementById('quoteForm').addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you! Your quote request has been submitted. We\'ll be in touch within 24 hours.');
    e.target.reset();
    closeModal();
  });

});
