const sheets = [...document.querySelectorAll('.sheet')];
const previous = document.querySelector('.previous-page');
const next = document.querySelector('.next-page');
const activePage = document.querySelector('.active-page');
const activeLabel = document.querySelector('.active-label');
const strip = document.querySelector('.page-strip');
let current = 0;

const dots = sheets.map((sheet, index) => {
  const button = document.createElement('button');
  button.className = 'page-dot';
  button.type = 'button';
  button.textContent = String(index + 1).padStart(2, '0');
  button.setAttribute('aria-label', `Otevřít stránku ${index + 1}: ${sheet.dataset.label}`);
  button.addEventListener('click', () => showPage(index));
  strip.append(button);
  return button;
});

function showPage(index) {
  current = (index + sheets.length) % sheets.length;
  sheets.forEach((sheet, sheetIndex) => {
    const active = sheetIndex === current;
    sheet.classList.toggle('is-active', active);
    sheet.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === current));
  activePage.textContent = String(current + 1).padStart(2, '0');
  activeLabel.textContent = sheets[current].dataset.label;
}

previous.addEventListener('click', () => showPage(current - 1));
next.addEventListener('click', () => showPage(current + 1));
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPage(current - 1);
  if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); showPage(current + 1); }
});
document.querySelector('.print-button').addEventListener('click', () => window.print());
const requestedPage = Number(new URLSearchParams(window.location.search).get('page'));
showPage(Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= sheets.length ? requestedPage - 1 : 0);
