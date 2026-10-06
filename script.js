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

const dialog = document.querySelector('.project-dialog');
const dialogImage = dialog.querySelector('.dialog-image');
const dialogTitle = dialog.querySelector('#dialog-title');
const dialogMeta = dialog.querySelector('.dialog-meta');
const dialogDescription = dialog.querySelector('.dialog-description');
const closeButton = dialog.querySelector('.dialog-close');

function openProject(project) {
  dialogImage.src = project.dataset.image;
  dialogImage.alt = project.querySelector('img').alt;
  dialogTitle.textContent = project.dataset.title;
  dialogMeta.textContent = project.dataset.meta;
  dialogDescription.textContent = project.dataset.description;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

projects.forEach((project) => {
  project.addEventListener('click', () => openProject(project));
  project.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(project);
    }
  });
});

function closeDialog() {
  dialog.close();
  document.body.classList.remove('dialog-open');
}

closeButton.addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

document.querySelector('#year').textContent = new Date().getFullYear();
