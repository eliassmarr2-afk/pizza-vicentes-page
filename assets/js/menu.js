const menuToggle = document.querySelector('#menuToggle');
const siteMenu = document.querySelector('#siteMenu');
const menuOverlay = document.querySelector('#menuOverlay');

function setMenu(open) {
  if (!menuToggle || !siteMenu || !menuOverlay) return;
  siteMenu.classList.toggle('open', open);
  menuOverlay.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  siteMenu.setAttribute('aria-hidden', String(!open));
}

function showMenuFeedback(message) {
  let feedback = document.querySelector('#menuFeedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'menuFeedback';
    feedback.className = 'menu-feedback';
    feedback.setAttribute('role', 'status');
    document.body.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.classList.add('show');
  window.clearTimeout(showMenuFeedback.timeoutId);
  showMenuFeedback.timeoutId = window.setTimeout(() => feedback.classList.remove('show'), 1800);
}

menuToggle?.addEventListener('click', () => {
  setMenu(!siteMenu.classList.contains('open'));
});

menuOverlay?.addEventListener('click', () => setMenu(false));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

document.querySelectorAll('[data-menu-placeholder]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setMenu(false);
    showMenuFeedback(`${link.dataset.menuPlaceholder} se construirá en una próxima etapa`);
  });
});
