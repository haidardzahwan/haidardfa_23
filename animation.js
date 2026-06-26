const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

function updateCursor(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
}

document.addEventListener('mousemove', updateCursor);

function animateRing() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}

animateRing();

document.querySelectorAll('a, button, .glass-card, .hamburger, .mobile-close').forEach((element) => {
  element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.6 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.45;
    this.speedY = (Math.random() - 0.5) * 0.45;
    this.opacity = Math.random() * 0.45 + 0.08;
    this.color = Math.random() > 0.76 ? '239,68,68' : '193,18,31';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i += 1) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 95) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(193,18,31,${0.08 * (1 - dist / 95)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();

const homeSection = document.querySelector('#home');
const heroSpotlight = document.createElement('div');
heroSpotlight.className = 'hero-spotlight';
if (homeSection) {
  homeSection.appendChild(heroSpotlight);
}

function updateHeroSpotlight(event) {
  const rect = homeSection.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  heroSpotlight.style.transform = `translate(${x - rect.width / 2}px, ${y - rect.height / 2}px)`;
}

if (homeSection) {
  homeSection.addEventListener('mousemove', updateHeroSpotlight);
}

function updateHeroParallax(event) {
  const heroContent = document.querySelector('.hero-content');
  const avatar = document.querySelector('.hero-image-wrap');
  if (!heroContent || !avatar) return;

  const rect = homeSection.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  heroContent.style.transform = `translate3d(${x * 10}px, ${y * 6}px, 0)`;
  avatar.style.transform = `translate3d(${x * -10}px, ${y * -8}px, 0)`;
}

if (homeSection) {
  homeSection.addEventListener('mousemove', updateHeroParallax);
}

const navBar = document.getElementById('navbar');
function onScrollNav() {
  if (window.scrollY > 24) {
    navBar.classList.add('scrolled');
  } else {
    navBar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScrollNav);
window.addEventListener('load', onScrollNav);

const welcomeOverlay = document.getElementById('welcomeOverlay');
const welcomeEnter = document.getElementById('welcomeEnter');
if (welcomeEnter && welcomeOverlay) {
  welcomeEnter.addEventListener('click', () => {
    welcomeOverlay.style.display = 'none';
    document.body.classList.remove('cursor-hover');
  });
}

