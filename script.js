const pages = ['home','about','experience','projects','skills','certificates','contact'];
const pageElements = pages.map(id => document.getElementById(id));
const navLinks = document.querySelectorAll('.nav-links a');
const loadingEl = document.getElementById('loading');
const loadingBar = document.getElementById('loading-bar');
const loadingPlane = document.getElementById('loading-plane-progress');
const loadingText = document.getElementById('loading-text');
const phrases = [
  'Administrative & Operational Support',
  'Data Entry Specialist',
  'Staff Office Professional',
  'Administrative Assistant',
  'Junior IT Support',
  'Project Assistant'
];
let currentPhrase = 0;
let currentChar = 0;
let deletingText = false;
let typedTimeout;

function setActiveNav(pageId) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.id === `nav-${pageId}`);
  });
}

function navigate(pageId) {
  if (!pages.includes(pageId)) return;
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  setActiveNav(pageId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  triggerReveal();
  if (pageId === 'about') startCounters();
  if (pageId === 'skills') animateSkillBars();
  if (pageId === 'experience') animateTimeline();
}

function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
}

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.add('open');
});

document.getElementById('mobileClose').addEventListener('click', closeMobileNav);

function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrase = phrases[currentPhrase];
  if (!deletingText) {
    el.textContent = phrase.substring(0, currentChar + 1);
    currentChar += 1;
    if (currentChar === phrase.length) {
      deletingText = true;
      typedTimeout = setTimeout(initTyped, 1800);
      return;
    }
  } else {
    el.textContent = phrase.substring(0, currentChar - 1);
    currentChar -= 1;
    if (currentChar === 0) {
      deletingText = false;
      currentPhrase = (currentPhrase + 1) % phrases.length;
    }
  }
  typedTimeout = setTimeout(initTyped, deletingText ? 50 : 80);
}

function triggerReveal() {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  activePage.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('in-view');
    observer.observe(el);
  });
}

function startCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10) || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const counterInterval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(counterInterval);
      }
      el.textContent = current;
    }, 36);
  });
}

function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const width = bar.dataset.width || '0';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = `${width}%`;
    }, 120);
  });
}

function animateTimeline() {
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('reveal', 'in-view');
    }, 180 * index);
  });
}

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8835136848:AAF1zXt8xQ-vlBSoafWqFkxISliEI7ePXOY';
const TELEGRAM_CHAT_ID = '8417732063';

async function sendTelegramMessage(name, email, messageText) {
  const telegramMessage = `
📧 <b>Pesan Baru dari Portfolio</b>

<b>Nama:</b> ${name}
<b>Email:</b> ${email}

<b>Pesan:</b>
${messageText}
  `.trim();

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

function submitForm() {
  const name = document.getElementById('form-name');
  const email = document.getElementById('form-email');
  const message = document.getElementById('form-message');
  const status = document.getElementById('form-status');
  const emailValue = email.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.value.trim() || !validEmail.test(emailValue) || !message.value.trim()) {
    status.className = 'form-status error';
    status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Mohon lengkapi semua kolom dengan format yang benar.';
    return;
  }

  // Show loading state
  status.className = 'form-status loading';
  status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim pesan...';

  // Send message to Telegram
  sendTelegramMessage(name.value.trim(), emailValue, message.value.trim()).then(success => {
    if (success || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      // Show success message
      status.className = 'form-status success';
      status.innerHTML = '<i class="fas fa-check-circle"></i> Pesan terkirim! Saya akan segera menghubungi Anda.';
      name.value = '';
      email.value = '';
      message.value = '';
      document.querySelectorAll('.form-field input, .form-field textarea').forEach(input => input.classList.remove('has-value'));
    } else {
      // Show error
      status.className = 'form-status error';
      status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Gagal mengirim pesan. Silahkan coba lagi.';
    }
  });
}

function validateField(event) {
  const field = event.target;
  const value = field.value.trim();
  if (value.length) {
    field.classList.add('has-value');
  } else {
    field.classList.remove('has-value');
  }
}

function openCert(title, issuer, source) {
  const modal = document.getElementById('certModal');
  document.getElementById('certModalTitle').textContent = title;
  document.getElementById('certModalIssuer').textContent = issuer;
  document.getElementById('certModalDownload').href = source;
  document.getElementById('certPreviewText').textContent = `Preview dokumen: ${title}`;
  modal.classList.add('open');
}

function closeCert() {
  document.getElementById('certModal').classList.remove('open');
}

function initCarousel() {
  const track = document.querySelector('.cert-grid');
  const prev = document.getElementById('certPrev');
  const next = document.getElementById('certNext');
  if (!track || !prev || !next) return;

  const cardWidth = track.querySelector('.cert-card')?.offsetWidth || 320;
  prev.addEventListener('click', () => {
    track.scrollBy({ left: -cardWidth - 24, behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
  });
}

function initTilt() {
  const tiltCards = document.querySelectorAll('.project-card, .cert-card, .skill-category-card, .trait-card, .timeline-card, .contact-form-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const rotateY = (x - centerX) / centerX * 7;
      const rotateX = -(y - centerY) / centerY * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initRipples() {
  document.querySelectorAll('.btn-primary, .btn-outline, .carousel-control').forEach(button => {
    button.classList.add('btn-ripple');
    button.addEventListener('click', function (event) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');
      const ripple = this.getElementsByClassName('ripple')[0];
      if (ripple) ripple.remove();
      this.appendChild(circle);
    });
  });
}

function initLoading() {
  const texts = ['Memuat Portfolio...', 'Menyiapkan Animasi...', 'Hampir Selesai...', 'Selamat Datang!'];
  let progress = 0;
  let index = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress > 100) progress = 100;
    loadingBar.style.width = `${progress}%`;
    if (loadingPlane) {
      const pathY = 24 + Math.sin((progress / 100) * Math.PI) * 10;
      loadingPlane.style.left = `${Math.max(6, Math.min(progress, 94))}%`;
      loadingPlane.style.top = `${pathY}px`;
    }
    index = Math.min(Math.floor(progress / 25), texts.length - 1);
    loadingText.textContent = texts[index];
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingEl.classList.add('hide');
        initTyped();
        triggerReveal();
      }, 600);
    }
  }, 80);
}

function applyTheme(theme) {
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const icon = document.querySelector('#themeToggle .icon i');
  const isLight = theme === 'light';

  body.classList.toggle('theme-light', isLight);
  if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
  if (toggle) {
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    if (isLight) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }
  localStorage.setItem('portfolioTheme', theme);
}

function initTheme() {
  const storedTheme = localStorage.getItem('portfolioTheme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));
}

function bindThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    toggle.classList.add('rotate');
    applyTheme(nextTheme);
    setTimeout(() => toggle.classList.remove('rotate'), 320);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.form-field input, .form-field textarea').forEach(input => {
    input.addEventListener('input', validateField);
    input.addEventListener('blur', validateField);
  });

  document.getElementById('certModal').addEventListener('click', (event) => {
    if (event.target.id === 'certModal' || event.target.classList.contains('modal-close')) {
      closeCert();
    }
  });

  initCarousel();
  initTilt();
  initRipples();
  bindThemeToggle();
  initTheme();
  initLoading();
  setActiveNav('home');
});

window.addEventListener('scroll', triggerReveal);
