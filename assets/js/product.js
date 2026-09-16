import { getProduct, extras, desserts, formatARS, siteConfig } from './catalog.js';

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(window.location.search);
const product = getProduct(params.get('id'));
const toast = $('#toast');

const state = {
  quantity: 1,
  added: false,
  selectedExtras: new Map(),
  selectedDesserts: new Map(),
  galleryIndex: 0
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function openLayer(id) { document.getElementById(id)?.classList.add('open'); }
function closeLayer(id) { document.getElementById(id)?.classList.remove('open'); }

function selectedUnitTotal() {
  let total = product.price;
  state.selectedExtras.forEach((item) => { total += item.price; });
  state.selectedDesserts.forEach((item) => { total += item.price; });
  return total;
}

function grandTotal() {
  return selectedUnitTotal() * state.quantity;
}

function selectedSummary() {
  const additions = [...state.selectedExtras.values(), ...state.selectedDesserts.values()].map((item) => item.title);
  const base = product.subtitle;
  return additions.length ? `${base} + ${additions.join(' + ')}` : base;
}

function updateSticky() {
  $('#stickyTitle').textContent = state.quantity > 1 ? `${state.quantity}x ${product.title}` : product.title;
  $('#stickyLine').textContent = selectedSummary();
  $('#stickyEta').textContent = `Llega en ${siteConfig.defaultEtaMinutes} min`;
  $('#stickyPrice').textContent = formatARS(grandTotal());
  $('#primaryAction').textContent = state.added
    ? `Ir a pagar ${formatARS(grandTotal())} →`
    : `Agregar ${formatARS(grandTotal())} →`;
}

function renderGallery() {
  $('#heroTrack').innerHTML = product.images.map((src) => `<img src="${src}" alt="${product.title}">`).join('');
  $('#galleryDots').innerHTML = product.images.map((_, index) => `<button class="gallery-dot ${index === 0 ? 'active' : ''}" data-gallery-index="${index}" aria-label="Imagen ${index + 1}"></button>`).join('');
  moveGallery(0);
}

function moveGallery(index) {
  state.galleryIndex = index;
  $('#heroTrack').style.transform = `translateX(-${index * 100}%)`;
  document.querySelectorAll('.gallery-dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
}

function upsellCard(item, group) {
  return `
    <article class="upsell-card" data-upsell-id="${item.id}" data-group="${group}">
      <div>
        <h3>${item.title}</h3>
        <p>${item.subtitle}</p>
        <div class="compact-price">${formatARS(item.price)}</div>
      </div>
      <div class="upsell-actions">
        ${group === 'dessert' ? `<button class="button ghost" type="button" data-detail-id="${item.id}">Ver</button>` : ''}
        <button class="icon-button" type="button" data-add-id="${item.id}" data-group="${group}" aria-label="Agregar ${item.title}">+</button>
      </div>
    </article>`;
}

function renderMatchingOffer() {
  if (!product.matchingOfferId || !product.enabledSections.includes('matchingOffer')) return;
  const offer = getProduct(product.matchingOfferId);
  $('#matchingOfferSection').hidden = false;
  $('#matchingOffer').innerHTML = `
    <article class="upsell-card highlight">
      <div>
        <div class="badges"><span class="badge">MEJOR OFERTA</span></div>
        <h3>${offer.title}</h3>
        <p>${offer.subtitle}</p>
        <div class="compact-price">${formatARS(offer.price)}</div>
      </div>
      <a class="button" href="producto.html?id=${encodeURIComponent(offer.id)}">Ver</a>
    </article>`;
}

function renderUpsells() {
  if (product.enabledSections.includes('extras')) {
    $('#extrasSection').hidden = false;
    $('#extrasList').innerHTML = extras.map((item) => upsellCard(item, 'extra')).join('');
  }
  if (product.enabledSections.includes('desserts')) {
    $('#dessertsSection').hidden = false;
    $('#dessertsList').innerHTML = desserts.map((item) => upsellCard(item, 'dessert')).join('');
  }
}

function toggleUpsell(id, group, button) {
  const source = group === 'dessert' ? desserts : extras;
  const map = group === 'dessert' ? state.selectedDesserts : state.selectedExtras;
  const item = source.find((candidate) => candidate.id === id);
  if (!item) return;

  if (map.has(id)) {
    map.delete(id);
    button.textContent = '+';
    showToast(`${item.title} quitado`);
  } else {
    map.set(id, item);
    button.textContent = '✓';
    showToast(`${item.title} agregado`);
  }
  state.added = false;
  updateSticky();
}

function openDetail(id) {
  const item = getProduct(id);
  $('#detailTitle').textContent = item.title;
  $('#detailSubtitle').textContent = item.subtitle;
  $('#detailContent').innerHTML = `
    <img src="${item.images[0]}" alt="${item.title}" style="border-radius:10px;margin:12px 0;max-height:280px;object-fit:cover">
    <p>${item.description}</p>
    <strong>${formatARS(item.price)}</strong>`;
  openLayer('detailSheet');
}

function buildTimeOptions() {
  const select = $('#deliveryTime');
  for (let hour = 0; hour < 24; hour += 1) {
    const label = `${String(hour).padStart(2, '0')}:00`;
    select.insertAdjacentHTML('beforeend', `<option value="${label}">${label}</option>`);
  }
}

function setup() {
  document.title = `${product.title} | Pizza Vicente`;
  renderGallery();
  $('#productBadges').innerHTML = (product.badges || []).map((badge) => `<span class="badge">${badge}</span>`).join('');
  $('#productTitle').textContent = product.title;
  $('#productSubtitle').textContent = product.subtitle;
  $('#productDescription').textContent = product.description;
  $('#productPrice').innerHTML = `${formatARS(product.price)} ${product.compareAtPrice ? `<del class="muted" style="font-size:.8rem;margin-left:6px">${formatARS(product.compareAtPrice)}</del>` : ''}`;

  renderMatchingOffer();
  renderUpsells();
  buildTimeOptions();
  updateSticky();

  $('#galleryDots').addEventListener('click', (event) => {
    const dot = event.target.closest('[data-gallery-index]');
    if (dot) moveGallery(Number(dot.dataset.galleryIndex));
  });

  $('#deliveryDay').addEventListener('change', (event) => {
    $('#customDateField').hidden = event.target.value !== 'custom';
  });

  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-id]');
    if (addButton) toggleUpsell(addButton.dataset.addId, addButton.dataset.group, addButton);

    const detailButton = event.target.closest('[data-detail-id]');
    if (detailButton) openDetail(detailButton.dataset.detailId);

    const closeButton = event.target.closest('[data-close]');
    if (closeButton) closeLayer(closeButton.dataset.close);

    if (event.target.classList.contains('sheet') || event.target.classList.contains('modal')) closeLayer(event.target.id);
  });

  $('#increaseBtn').addEventListener('click', () => {
    state.quantity += 1;
    state.added = false;
    updateSticky();
  });

  $('#decreaseBtn').addEventListener('click', () => {
    if (state.quantity > 1) {
      state.quantity -= 1;
      state.added = false;
      updateSticky();
      return;
    }
    openLayer('emptyModal');
  });

  $('#confirmEmpty').addEventListener('click', () => {
    state.selectedExtras.clear();
    state.selectedDesserts.clear();
    state.quantity = 1;
    state.added = false;
    document.querySelectorAll('[data-add-id]').forEach((button) => { button.textContent = '+'; });
    closeLayer('emptyModal');
    updateSticky();
    showToast('Compra vaciada');
  });

  $('#primaryAction').addEventListener('click', () => {
    if (!state.added) {
      state.added = true;
      updateSticky();
      showToast('Pedido agregado');
      return;
    }
    showToast('Checkout pendiente de migración a Shopify');
  });
}

setup();
