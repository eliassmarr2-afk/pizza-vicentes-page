import { siteConfig, getProductsByTab, formatARS } from './catalog.js';

const $ = (selector) => document.querySelector(selector);
const tabsRoot = $('#tabs');
const panelsRoot = $('#tabPanels');
const toast = $('#toast');

const state = {
  mode: 'delivery',
  activeTab: siteConfig.tabs[0].id,
  address: localStorage.getItem('pizzaVicenteAddress') || ''
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function openSheet(id) {
  document.getElementById(id)?.classList.add('open');
}

function closeSheet(id) {
  document.getElementById(id)?.classList.remove('open');
}

function productLink(product) {
  return `producto.html?id=${encodeURIComponent(product.id)}`;
}

function deliveryText() {
  if (state.mode === 'pickup') return 'Retiro en el local';
  if (state.address) return `Llega en ${siteConfig.defaultEtaMinutes} min a ${state.address}`;
  return `Llega en ${siteConfig.defaultEtaMinutes} min · completá tu dirección`;
}

function featuredCard(product) {
  return `
    <article class="catalog-card">
      <a href="${productLink(product)}" aria-label="Ver ${product.title}">
        <img src="${product.images[0]}" alt="${product.title}">
      </a>
      <div class="catalog-card-body">
        <div class="badges">${(product.badges || []).slice(0, 2).map((badge) => `<span class="badge">${badge}</span>`).join('')}</div>
        <h3>${product.title}</h3>
        <p>${product.subtitle}</p>
        <div class="delivery-hint">${deliveryText()}</div>
        <div class="card-bottom">
          <div class="price-stack">
            <strong>${formatARS(product.price)}</strong>
            ${product.compareAtPrice ? `<del>${formatARS(product.compareAtPrice)}</del>` : ''}
          </div>
          <a class="icon-button" href="${productLink(product)}" aria-label="Ver detalles de ${product.title}">+</a>
        </div>
      </div>
    </article>`;
}

function compactCard(product) {
  return `
    <article class="compact-card">
      <img src="${product.images[0]}" alt="${product.title}">
      <div>
        <h3>${product.title}</h3>
        <p>${product.subtitle}</p>
        <div class="compact-price">${formatARS(product.price)}</div>
      </div>
      <a class="icon-button" href="${productLink(product)}" aria-label="Ver ${product.title}">+</a>
    </article>`;
}

function renderCatalog() {
  tabsRoot.innerHTML = siteConfig.tabs.map((tab, index) => `
    <button class="tab-button ${index === 0 ? 'active' : ''}" type="button" data-tab="${tab.id}">${tab.label}</button>
  `).join('');

  panelsRoot.innerHTML = siteConfig.tabs.map((tab, index) => {
    const items = getProductsByTab(tab.id);
    const cards = items.map(tab.layout === 'compact' ? compactCard : featuredCard).join('');
    const layoutClass = tab.layout === 'compact' ? 'compact-list' : 'horizontal-cards';
    return `
      <section class="tab-panel ${index === 0 ? 'active' : ''}" data-panel="${tab.id}">
        <div class="${layoutClass}">${cards}</div>
      </section>`;
  }).join('');
}

function updateAddressUI() {
  const label = $('#locationLabel');
  if (state.mode === 'pickup') {
    label.textContent = 'Retiro en el local';
    $('#locationTrigger').disabled = true;
  } else {
    label.textContent = state.address || 'Completá tu dirección de envío';
    $('#locationTrigger').disabled = false;
  }
  renderCatalog();
}

function setup() {
  $('#coverImage').src = siteConfig.coverImage;
  $('#profileImage').src = siteConfig.profileImage;
  $('#promoBanner').src = siteConfig.promoBanner;
  $('#businessName').textContent = siteConfig.businessName;
  $('#registerBenefit').textContent = siteConfig.registerBenefit;

  renderCatalog();
  updateAddressUI();

  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-mode]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      state.mode = button.dataset.mode;
      updateAddressUI();
    });
  });

  tabsRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    state.activeTab = button.dataset.tab;
    document.querySelectorAll('.tab-button').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === state.activeTab));
  });

  $('#locationTrigger').addEventListener('click', () => openSheet('locationSheet'));
  $('#registerTrigger').addEventListener('click', () => openSheet('registerSheet'));

  $('#useAddress').addEventListener('click', () => {
    const postalCode = $('#postalCode').value.trim();
    const address = $('#address').value.trim();
    if (!postalCode || !address) {
      showToast('Completá código postal y dirección');
      return;
    }
    state.address = `${address} · CP ${postalCode}`;
    localStorage.setItem('pizzaVicenteAddress', state.address);
    updateAddressUI();
    closeSheet('locationSheet');
    showToast('Dirección guardada');
  });

  document.addEventListener('click', (event) => {
    const close = event.target.closest('[data-close]');
    if (close) closeSheet(close.dataset.close);
    if (event.target.classList.contains('sheet')) closeSheet(event.target.id);
  });

  if (!state.address) window.setTimeout(() => openSheet('locationSheet'), 350);
}

setup();
