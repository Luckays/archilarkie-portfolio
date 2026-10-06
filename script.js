const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('is-open', !open);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  });
});

const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const selected = button.dataset.filter;
    projects.forEach((project) => {
      project.classList.toggle('is-hidden', selected !== 'all' && project.dataset.category !== selected);
    });
  });
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.project-track');
  const slides = [...carousel.querySelectorAll('.project-slide')];
  const currentLabel = carousel.querySelector('.current');
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  let index = 0;
  let pointerStart = null;
  let pointerDelta = 0;

  const show = (newIndex) => {
    index = (newIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    currentLabel.textContent = String(index + 1).padStart(2, '0');
    slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== index)));
  };

  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  carousel.tabIndex = 0;
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });

  carousel.addEventListener('pointerdown', (event) => {
    if (event.target.closest('model-viewer, button')) return;
    pointerStart = event.clientX;
    pointerDelta = 0;
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener('pointermove', (event) => {
    if (pointerStart === null) return;
    pointerDelta = event.clientX - pointerStart;
  });

  carousel.addEventListener('pointerup', () => {
    if (Math.abs(pointerDelta) > 45) show(index + (pointerDelta < 0 ? 1 : -1));
    pointerStart = null;
    pointerDelta = 0;
  });

  show(0);
});

