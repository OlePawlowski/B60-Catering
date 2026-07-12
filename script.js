// ===== B60 Catering – Interaktionen =====

// --- Wort-Rotator im Hero ---
const words = document.querySelectorAll('.hero-word');
let wordIndex = 0;

if (words.length > 1) {
  setInterval(() => {
    const current = words[wordIndex];
    wordIndex = (wordIndex + 1) % words.length;
    const next = words[wordIndex];

    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    setTimeout(() => current.classList.remove('is-leaving'), 500);

    next.classList.add('is-active');
  }, 2400);
}

// --- Reveal beim Scrollen ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// --- Mobiles Menü ---
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('is-open');
  navToggle.classList.toggle('is-open');
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
  }
});

// --- Food Carousel (responsive: 1 / 2 / 3 per view) ---
const carouselTrack = document.querySelector('.food-carousel-track');
if (carouselTrack) {
  const GAP = 12;
  const carouselImgs = carouselTrack.querySelectorAll('img');
  const dotsContainer = document.querySelector('.food-carousel-dots');
  const prevBtn = document.querySelector('.food-carousel-prev');
  const nextBtn = document.querySelector('.food-carousel-next');
  let carouselIndex = 0;
  let carouselTimer;

  function getVisible() {
    if (window.matchMedia('(max-width: 560px)').matches) return 1;
    if (window.matchMedia('(max-width: 980px)').matches) return 2;
    return 3;
  }

  let VISIBLE = getVisible();
  let totalSteps = carouselImgs.length - VISIBLE;

  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= totalSteps; i++) {
      const dot = document.createElement('span');
      dot.className = 'food-dot' + (i === carouselIndex ? ' is-active' : '');
      dot.addEventListener('click', () => { carouselGoTo(i); carouselReset(); });
      dotsContainer.appendChild(dot);
    }
  }

  function carouselGoTo(index) {
    carouselIndex = Math.max(0, Math.min(index, totalSteps));
    const imgWidth = carouselImgs[0].offsetWidth;
    carouselTrack.style.transform = `translateX(-${carouselIndex * (imgWidth + GAP)}px)`;
    dotsContainer.querySelectorAll('.food-dot').forEach((d, i) => d.classList.toggle('is-active', i === carouselIndex));
  }

  function carouselStart() {
    carouselTimer = setInterval(() => {
      carouselGoTo(carouselIndex >= totalSteps ? 0 : carouselIndex + 1);
    }, 3500);
  }

  function carouselReset() {
    clearInterval(carouselTimer);
    carouselStart();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newVisible = getVisible();
      if (newVisible !== VISIBLE) {
        VISIBLE = newVisible;
        totalSteps = carouselImgs.length - VISIBLE;
        carouselIndex = Math.min(carouselIndex, totalSteps);
        buildDots();
      }
      carouselGoTo(carouselIndex);
    }, 150);
  });

  buildDots();
  prevBtn.addEventListener('click', () => { carouselGoTo(carouselIndex - 1); carouselReset(); });
  nextBtn.addEventListener('click', () => { carouselGoTo(carouselIndex + 1); carouselReset(); });

  carouselStart();
}

// --- Kontaktformular (Entwurf: nur Bestätigung, kein Versand) ---
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  success.classList.add('is-visible');
  form.reset();
});
