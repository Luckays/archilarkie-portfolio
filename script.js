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
  const totalLabel = carousel.querySelector('.total');
  const previous = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  let index = 0;
  let pointerStart = null;
  let pointerDelta = 0;

  if (totalLabel) totalLabel.textContent = String(slides.length).padStart(2, '0');

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

const lightbox = document.querySelector('#image-lightbox');

if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('figcaption');
  const lightboxCount = lightbox.querySelector('.lightbox-count');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const previousButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let gallery = [];
  let activeIndex = 0;

  const renderLightbox = (newIndex) => {
    activeIndex = (newIndex + gallery.length) % gallery.length;
    const source = gallery[activeIndex];
    const caption = source.closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
    lightboxImage.src = source.currentSrc || source.src;
    lightboxImage.alt = source.alt;
    lightboxCaption.textContent = caption;
    lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
    const hasMultiple = gallery.length > 1;
    previousButton.hidden = !hasMultiple;
    nextButton.hidden = !hasMultiple;
  };

  const openLightbox = (source) => {
    const project = source.closest('.project');
    gallery = [...project.querySelectorAll('.project-slide:not(.project-model) > img')];
    activeIndex = gallery.indexOf(source);
    renderLightbox(activeIndex);
    lightbox.showModal();
    document.body.classList.add('dialog-open');
  };

  document.querySelectorAll('.project-slide:not(.project-model) > img').forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Zvětšit: ${image.alt}`);
    image.addEventListener('click', () => openLightbox(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  previousButton.addEventListener('click', () => renderLightbox(activeIndex - 1));
  nextButton.addEventListener('click', () => renderLightbox(activeIndex + 1));
  closeButton.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') renderLightbox(activeIndex - 1);
    if (event.key === 'ArrowRight') renderLightbox(activeIndex + 1);
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    lightboxImage.removeAttribute('src');
  });
}

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

