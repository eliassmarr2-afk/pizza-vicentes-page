const $ = (selector) => document.querySelector(selector);

const supportState = {
  topic: 'last-purchase'
};

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function updateContactButton() {
  const email = $('#supportEmail')?.value || '';
  const name = $('#supportName')?.value || '';
  const button = $('#contactButton');
  if (!button) return;
  button.disabled = !(validEmail(email) && name.trim().length >= 2);
}

function setupTopics() {
  document.querySelectorAll('[data-topic]').forEach((button) => {
    button.addEventListener('click', () => {
      supportState.topic = button.dataset.topic;
      document.querySelectorAll('[data-topic]').forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    });
  });
}

function setupInputs() {
  ['#supportEmail', '#supportName'].forEach((selector) => {
    const input = $(selector);
    input?.addEventListener('input', updateContactButton);
    input?.addEventListener('blur', updateContactButton);
  });
}

function setupContact() {
  $('#contactButton')?.addEventListener('click', () => {
    if ($('#contactButton').disabled) return;
    showToast('Consulta lista. La conexión real con soporte se incorporará más adelante.');
  });
}

function setup() {
  setupTopics();
  setupInputs();
  setupContact();
  updateContactButton();
}

setup();
