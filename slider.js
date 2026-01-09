const slides = document.querySelectorAll('.slide');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const indicatorsContainer = document.querySelector('.carousel-indicators');

let currentSlide = 0;
let autoplayInterval;

// Crear indicadores
slides.forEach((_, index) => {
  const indicator = document.createElement('div');
  indicator.classList.add('indicator');
  if (index === 0) indicator.classList.add('active');
  indicator.addEventListener('click', () => goToSlide(index));
  indicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

function updateSlides() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    indicators[index].classList.remove('active');
  });

  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlides();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlides();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlides();
  resetAutoplay();
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 16000);
}

btnNext.addEventListener('click', () => {
  nextSlide();
  resetAutoplay();
});

btnPrev.addEventListener('click', () => {
  prevSlide();
  resetAutoplay();
});

// Pausar autoplay cuando el mouse está sobre el carrusel
const carousel = document.querySelector('.carousel-container');
carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
carousel.addEventListener('mouseleave', startAutoplay);

// begining autoplay
startAutoplay();
