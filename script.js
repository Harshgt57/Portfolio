/* ============================================
   HARSH GUPTA — Portfolio Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();

  /* ---------- Theme Toggle ---------- */
  initThemeToggle();

  /* ---------- Particles Canvas ---------- */
  initParticles();

  /* ---------- Typed Text Animation ---------- */
  initTypedText();

  /* ---------- Navbar Scroll ---------- */
  initNavbar();

  /* ---------- Hamburger Menu ---------- */
  initMobileMenu();

  /* ---------- Scroll Reveal ---------- */
  initScrollReveal();

  /* ---------- Stat Counter ---------- */
  initStatCounter();

  /* ---------- Back to Top ---------- */
  initBackToTop();

  /* ---------- Active Nav Link ---------- */
  initActiveNav();

  /* ---------- Contact Form (EmailJS) ---------- */
  initContactForm();

  /* ---------- Resume Download Counter (Firebase) ---------- */
  initResumeCounter();
});

/* ============================================
   PARTICLE CONSTELLATION BACKGROUND
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 187 : 260; // cyan or purple
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Limit particles on mobile
  const count = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================
   TYPED TEXT ANIMATION
   ============================================ */
function initTypedText() {
  const element = document.getElementById('typed-text');
  if (!element) return;

  const texts = [
    'Azure Data Engineer',
    'Databricks Engineer',
    'ETL Pipeline Architect'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const current = texts[textIndex];

    if (isDeleting) {
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      speed = 40;
    } else {
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      speed = 90;
    }

    if (!isDeleting && charIndex === current.length) {
      speed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 400; // pause before next word
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 800);
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ============================================
   MOBILE HAMBURGER MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   STAT COUNTER ANIMATION
   ============================================ */
function initStatCounter() {
  const stats = document.querySelectorAll('.stat-number[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '+';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   ACTIVE NAV LINK HIGHLIGHTING
   ============================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ============================================
   CONTACT FORM — EmailJS (Free, No Backend)
   ============================================
   SETUP INSTRUCTIONS:
   1. Go to https://www.emailjs.com/ and create a free account
   2. Add an Email Service (e.g. Gmail) → copy the Service ID
   3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
      → copy the Template ID
   4. Go to Account > General > copy your Public Key
   5. Replace the 3 placeholders below with your real IDs
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // ⚠️ REPLACE THESE with your real EmailJS credentials
  const EMAILJS_PUBLIC_KEY = 'spqK7j8YUuFLAdklw';
  const EMAILJS_SERVICE_ID = 'service_hf3nwln';
  const EMAILJS_TEMPLATE_ID = 'template_i9b3g5f';

  // Initialize EmailJS
  emailjs.init(EMAILJS_PUBLIC_KEY);

  const submitBtn = document.getElementById('form-submit-btn');
  const statusEl = document.getElementById('form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader" style="width:18px;height:18px;"></i> Sending...';
    if (window.lucide) lucide.createIcons();
    statusEl.style.display = 'none';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        // Success
        statusEl.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
        statusEl.style.color = '#10b981';
        statusEl.style.display = 'block';
        form.reset();
      })
      .catch((error) => {
        // Error
        console.error('EmailJS Error:', error);
        statusEl.textContent = '❌ Failed to send message. Please try again or email me directly.';
        statusEl.style.color = '#ef4444';
        statusEl.style.display = 'block';
      })
      .finally(() => {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="send" style="width:18px;height:18px;"></i> Send Message';
        if (window.lucide) lucide.createIcons();
      });
  });
}

/* ============================================
   THEME TOGGLE (Light / Dark)
   ============================================ */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('portfolio-theme', newTheme);
  });
}

/* ============================================
   RESUME DOWNLOAD COUNTER (Firebase Realtime DB)
   ============================================ */
function initResumeCounter() {
  const downloadBtn = document.getElementById('download-resume-btn');
  const countEl = document.getElementById('download-count');
  if (!downloadBtn || !countEl) return;

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyCCzoG7KGA9xQwtBFrYXMV-gMQ6Ig1XlHk",
    authDomain: "portfolio-counter-ea3a8.firebaseapp.com",
    databaseURL: "https://portfolio-counter-ea3a8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "portfolio-counter-ea3a8",
    storageBucket: "portfolio-counter-ea3a8.firebasestorage.app",
    messagingSenderId: "721028111003",
    appId: "1:721028111003:web:a9fe3766daed65e94e843e",
    measurementId: "G-6NX107R8RK"
  };

  // Initialize Firebase (only if not already initialized)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  const countRef = db.ref('resumeDownloads');

  // Listen for real-time count updates
  countRef.on('value', (snapshot) => {
    const count = snapshot.val() || 0;
    countEl.textContent = '(' + count + ')';
  });

  // Increment count on download click
  downloadBtn.addEventListener('click', () => {
    countRef.transaction((currentCount) => {
      return (currentCount || 0) + 1;
    });
  });
}
