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

const pageParameters = new URLSearchParams(window.location.search);

document.querySelectorAll('[data-carousel]').forEach((carousel, carouselIndex) => {
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

  const requestedProject = Number(pageParameters.get('project'));
  const requestedSlide = Number(pageParameters.get('slide'));
  const initialSlide = requestedProject === carouselIndex + 1 && requestedSlide > 0 ? requestedSlide - 1 : 0;
  show(initialSlide);
});

const cvPanel = document.querySelector('#cv');
if (cvPanel && window.location.hash === '#cv') {
  cvPanel.open = true;
}

if (cvPanel) {
  const cvSummary = cvPanel.querySelector('summary');
  let cvAnimation = null;

  const finishCvAnimation = () => {
    cvPanel.style.height = '';
    cvPanel.style.overflow = '';
    cvAnimation = null;
  };

  cvSummary.addEventListener('click', (event) => {
    event.preventDefault();
    if (cvAnimation) cvAnimation.cancel();

    const startHeight = cvPanel.offsetHeight;
    const willOpen = !cvPanel.open;
    if (willOpen) cvPanel.open = true;
    const endHeight = willOpen ? cvPanel.scrollHeight : cvSummary.offsetHeight;

    cvPanel.style.overflow = 'hidden';
    cvAnimation = cvPanel.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 460, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );

    cvAnimation.onfinish = () => {
      if (!willOpen) cvPanel.open = false;
      finishCvAnimation();
    };
    cvAnimation.oncancel = finishCvAnimation;
  });
}

