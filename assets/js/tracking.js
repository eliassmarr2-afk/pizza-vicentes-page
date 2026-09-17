const formatARS = (value) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
}).format(value);

const trackingContract = {
  orderId: 'PV-2026-1149',
  accessMode: 'mock',
  logisticsStatus: 'on_the_way',
  verificationCode: '1149',
  customer: {
    name: 'Martín González',
    phone: '11 5555 1849'
  },
  destination: {
    address: 'Av. Santa Fe 3253, Palermo, CABA',
    reference: 'Piso 4 · Departamento B'
  },
  items: [
    {
      quantity: 1,
      title: 'Combo Satisfacción 100%',
      components: '1 Pizza + 2 Fainá + 6 Empanadas + 1 Gaseosa',
      price: 22400
    }
  ]
};

const timelineSteps = [
  {
    id: 'received',
    label: 'Recibido',
    description: 'Estamos preparando tu comida',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4L19 6"/></svg>'
  },
  {
    id: 'preparing',
    label: 'Casi lista',
    description: 'Pronto enviaremos tu pedido a tu domicilio',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16h16M6 16a6 6 0 0 1 12 0M12 7V4M8 8 6 6M16 8l2-2"/></svg>'
  },
  {
    id: 'on_the_way',
    label: 'En camino',
    description: `Tu pedido va en camino a ${trackingContract.destination.address}`,
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6l2-6h-5l-2-3H7"/></svg>'
  },
  {
    id: 'delivered',
    label: 'Entregado',
    description: '¡Disfrutá tu comida y calificála!',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>'
  }
];

const $ = (selector) => document.querySelector(selector);

function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function renderVerificationCode() {
  $('#verificationCode').textContent = trackingContract.verificationCode.split('').join(' ');
}

function renderTimeline() {
  const activeIndex = Math.max(0, timelineSteps.findIndex((step) => step.id === trackingContract.logisticsStatus));
  const progress = activeIndex >= timelineSteps.length - 1
    ? 1
    : (activeIndex + .5) / (timelineSteps.length - 1);

  const timeline = $('#orderTimeline');
  timeline.style.setProperty('--timeline-progress', `${Math.min(progress, 1) * 100}%`);
  timeline.innerHTML = timelineSteps.map((step, index) => {
    const stateClass = index < activeIndex ? 'completed' : index === activeIndex ? 'active' : 'pending';
    return `
      <div class="timeline-item ${stateClass}" data-logistics-status="${step.id}">
        <div class="timeline-icon">${step.icon}</div>
        <div class="timeline-copy">
          <strong>${step.label}</strong>
          <span>${step.description}</span>
        </div>
      </div>`;
  }).join('');
}

function renderOrder() {
  $('#orderId').textContent = `Orden ${trackingContract.orderId}`;
  const itemsContainer = $('#orderItems');
  itemsContainer.innerHTML = trackingContract.items.map((item) => `
    <div class="order-item">
      <div>
        <div class="order-item-title">${item.quantity}× ${item.title}</div>
        <div class="order-item-components">${item.components}</div>
      </div>
      <div class="order-item-price">${formatARS(item.price * item.quantity)}</div>
    </div>`).join('');

  const total = trackingContract.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $('#orderTotal').textContent = formatARS(total);
}

function renderDestination() {
  $('#destinationAddress').textContent = trackingContract.destination.address;
  $('#destinationReference').textContent = trackingContract.destination.reference;
  $('#customerName').textContent = trackingContract.customer.name;
  $('#customerPhone').textContent = trackingContract.customer.phone;
}

function setupHelpActions() {
  document.querySelectorAll('[data-help-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const labels = {
        address: 'Cambio de domicilio pendiente de integración',
        store: 'Contacto con el local pendiente de integración',
        courier: 'Chat con repartidor pendiente de integración',
        cancel: 'Cancelación de entrega pendiente de integración'
      };
      showToast(labels[button.dataset.helpAction] || 'Acción pendiente de integración');
    });
  });
}

function setup() {
  renderVerificationCode();
  renderTimeline();
  renderOrder();
  renderDestination();
  setupHelpActions();
}

setup();
