/**
 * ===================================================================
 * PORTFOLIO MODERN DUAL THEME - MAIN.JS
 * Vanilla JavaScript (ES6+)
 * Fitur: Dark/Light Mode Switcher, Typing Text, Filter Proyek,
 * Scroll Reveal, Form Validasi, Navbar Sticky, Smooth Scroll,
 * Back to Top, Interactive Code Card.
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi tema terlebih dahulu
  initThemeToggle();

  // Inisialisasi modul fitur lainnya
  initNavbarScroll();
  initTypingEffect();
  initScrollReveal();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initCodeCopy();
  initCurrentYear();
  initMobileNavClose();
  initCustomCursor();
});

/* --------------------------------------------------
   1. THEME SWITCHER (DARK & LIGHT MODE)
   -------------------------------------------------- */
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll('.btn-theme-toggle');

  // Baca tema tersimpan dari LocalStorage atau default ke 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const tooltipText = theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap';

    toggleButtons.forEach(btn => {
      btn.setAttribute('title', tooltipText);
      btn.setAttribute('aria-label', tooltipText);
    });
  }
}

/* --------------------------------------------------
   2. NAVBAR SCROLL EFFECT & ACTIVE LINK
   -------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  const handleScroll = () => {
    if (!navbar) return;

    // Efek glassmorphic saat di-scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight berdasarkan scroll position
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Panggil saat inisialisasi awal
}

/* --------------------------------------------------
   3. MOBILE NAVBAR AUTO-CLOSE
   -------------------------------------------------- */
function initMobileNavClose() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-custom .btn-gradient');
  const navCollapse = document.getElementById('navbarNav');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
        bsCollapse.hide();
      }
    });
  });
}

/* --------------------------------------------------
   4. TYPING TEXT DYNAMIC EFFECT (HERO SECTION)
   -------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Web & Desktop Developer',
    'Guru Koding, AI & Informatika',
    'Motion Designer',
    'Pramuka Garuda'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      currentSpeed = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      currentSpeed = 400;
    }

    setTimeout(type, currentSpeed);
  }

  // Mulai animasi pengetikan
  type();
}

/* --------------------------------------------------
   5. SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* --------------------------------------------------
   6. FEATURED PROJECTS FILTER
   -------------------------------------------------- */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------
   7. INTERACTIVE CONTACT FORM WITH VALIDATION
   -------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const alertContainer = document.getElementById('formAlertContainer');
  const submitBtn = document.getElementById('submitBtn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    // Validasi Regex Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showAlert('danger', '<i class="bi bi-exclamation-triangle-fill me-2"></i> Mohon lengkapi semua bidang yang wajib diisi!');
      return;
    }

    if (!emailRegex.test(email)) {
      showAlert('warning', '<i class="bi bi-exclamation-circle-fill me-2"></i> Format alamat email tidak valid!');
      return;
    }

    // Indikator Loading pada Tombol Kirim
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Mengirim Pesan...
    `;

    // Simulasi pengiriman pesan asynchronous (800ms)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Tampilkan Alert Sukses
      showAlert(
        'success',
        `<i class="bi bi-check-circle-fill me-2"></i> <strong>Terima kasih, ${escapeHtml(name)}!</strong> Pesan Anda berhasil dikirim. Saya akan segera menghubungi Anda kembali.`
      );

      // Reset form
      contactForm.reset();
    }, 850);
  });

  function showAlert(type, messageHtml) {
    if (!alertContainer) return;

    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show border-0 shadow-sm" role="alert" style="border-radius: 12px; background: ${type === 'success' ? 'rgba(16, 185, 129, 0.2)' : type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.4)' : type === 'warning' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'};">
        ${messageHtml}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/* --------------------------------------------------
   8. BACK TO TOP BUTTON
   -------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------
   9. HERO CODE CARD COPY CLIPBOARD
   -------------------------------------------------- */
function initCodeCopy() {
  const copyBtn = document.getElementById('copyCodeBtn');
  const codeContent = document.getElementById('heroCodeContent');

  if (!copyBtn || !codeContent) return;

  copyBtn.addEventListener('click', () => {
    const codeText = codeContent.innerText;

    navigator.clipboard.writeText(codeText).then(() => {
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="bi bi-check-lg text-success"></i>';
      copyBtn.setAttribute('title', 'Tersalin ke clipboard!');

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.removeAttribute('title');
      }, 2000);
    }).catch(err => {
      console.warn('Gagal menyalin:', err);
    });
  });
}

/* --------------------------------------------------
   10. DYNAMIC FOOTER YEAR
   -------------------------------------------------- */
function initCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------
   11. CUSTOM CURSOR FOLLOWER (TRAILING RING + CENTER DOT)
   -------------------------------------------------- */
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (!cursorDot || !cursorOutline) return;

  // Nonaktifkan di perangkat touch screen / mobile
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 992) {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;
  let isMoving = false;

  // Update target posisi kursor saat mouse bergerak
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Center dot bergerak instan dengan akselerasi GPU (zero latency)
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (!isMoving) {
      isMoving = true;
      cursorDot.classList.remove('cursor-hidden');
      cursorOutline.classList.remove('cursor-hidden');
      outlineX = mouseX;
      outlineY = mouseY;
    }
  }, { passive: true });

  // Animasi trailing ring menggunakan requestAnimationFrame + lerp (linear interpolation)
  function animateOutline() {
    // Lerp factor 0.18 memberi efek trailing yang halus dan responsif
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;

    cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animateOutline);
  }

  requestAnimationFrame(animateOutline);

  // Efek hover interaktif saat mengarahkan ke link, tombol, kartu, atau elemen klik
  const interactiveSelector = 'a, button, input, textarea, select, .btn, .nav-link, .glass-card, .project-card, .skill-card, .bento-card, .project-filter-btn, .social-pill-btn, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-active');
    }
  });

  // Efek klik (mousedown / mouseup)
  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Sembunyikan kursor saat mouse meninggalkan jendela browser
  document.addEventListener('mouseleave', () => {
    cursorDot.classList.add('cursor-hidden');
    cursorOutline.classList.add('cursor-hidden');
  });

  document.addEventListener('mouseenter', () => {
    if (isMoving) {
      cursorDot.classList.remove('cursor-hidden');
      cursorOutline.classList.remove('cursor-hidden');
    }
  });
}
