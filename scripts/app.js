const pageSize = 12;

const state = {
  items: [],
  activeFilter: 'All',
  query: '',
  visibleCount: pageSize,
  viewMode: 'grid',
  swipeIndex: 0,
};

const filterIcons = {
  All: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/></svg>',
  Biology: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20c-4.4 0-8-3.6-8-8 0-3.6 2.4-6.7 5.7-7.7C9.4 7.8 10.6 9 12 9s2.6-1.2 2.3-4.7C17.6 5.3 20 8.4 20 12c0 4.4-3.6 8-8 8Z"/><path d="M12 9v11"/></svg>',
  Chemistry: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3v6.2L5.8 16A3 3 0 0 0 8.5 20h7a3 3 0 0 0 2.7-4l-4.2-6.8V3"/><path d="M8 13h8"/></svg>',
  Neuroscience: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 1 1-5 0Z"/><path d="M12 9v6"/><path d="M8.5 12.5 6 15"/><path d="M15.5 12.5 18 15"/><path d="M9 18H7"/><path d="M17 18h-2"/></svg>',
  Physics: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 14 5-4 3 4 8-6"/><path d="M17 8h3v3"/></svg>',
  Atmosphere: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h9a3 3 0 1 0-.6-5.9A4.5 4.5 0 0 0 7 12.5 2.5 2.5 0 0 0 7 17Z"/></svg>',
  Space: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 0 16c3.5 0 6.6-2.2 7.6-5.4A7 7 0 0 1 12 4Z"/></svg>',
  Senses: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z"/><path d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>',
  Technology: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><path d="M18 11h2v2h-2"/><path d="M9 11h3"/><path d="M14 11h1"/></svg>',
  Engineering: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16"/><path d="M6 18l5-12h2l5 12"/><path d="M8 13h8"/><path d="M9.5 9h5"/></svg>',
  'Plant Biology': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c8 0 13-5 14-14-9 1-14 6-14 14Z"/><path d="M5 19c3-5 7-8 12-11"/></svg>',
};

const gallery = document.querySelector('#gallery');
const swipeView = document.querySelector('#swipeView');
const swipeDeck = document.querySelector('#swipeDeck');
const swipeCounter = document.querySelector('#swipeCounter');
const filters = document.querySelector('#filters');
const searchInput = document.querySelector('#searchInput');
const toolbar = document.querySelector('.toolbar');
const emptyState = document.querySelector('#emptyState');
const loadMoreButton = document.querySelector('#loadMoreButton');
const gridViewButton = document.querySelector('#gridViewButton');
const swipeViewButton = document.querySelector('#swipeViewButton');
const swipePrevButton = document.querySelector('#swipePrevButton');
const swipeNextButton = document.querySelector('#swipeNextButton');
const swipeOpenButton = document.querySelector('#swipeOpenButton');
const lightbox = document.querySelector('#lightbox');
const modalImage = document.querySelector('#modalImage');
const modalCategory = document.querySelector('#modalCategory');
const modalTitle = document.querySelector('#modalTitle');
const modalTakeaway = document.querySelector('#modalTakeaway');
const modalMechanism = document.querySelector('#modalMechanism');
const modalFields = document.querySelector('#modalFields');
const modalStatus = document.querySelector('#modalStatus');
const modalDescription = document.querySelector('#modalDescription');
const modalVideo = document.querySelector('#modalVideo');

const normalize = (value) => value.toLowerCase().trim();

function iconFor(label) {
  return filterIcons[label] || filterIcons.All;
}

function getFilters(items) {
  const set = new Set(['All']);
  items.forEach((item) => set.add(item.category));
  return [...set];
}

function matches(item) {
  const filterMatch = state.activeFilter === 'All' || item.category === state.activeFilter || item.fields.includes(state.activeFilter);
  const haystack = normalize([item.title, item.question, item.takeaway, item.mechanism, item.fields.join(' '), item.tags.join(' ')].join(' '));
  const queryMatch = !state.query || haystack.includes(normalize(state.query));
  return filterMatch && queryMatch;
}

function getFilteredItems() {
  return state.items.filter(matches);
}

function renderSkeleton(count = 6) {
  gallery.hidden = false;
  gallery.style.display = '';
  if (swipeView) {
    swipeView.hidden = true;
    swipeView.style.display = 'none';
  }
  gallery.innerHTML = '';
  for (let index = 0; index < count; index += 1) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line short"></div>
    `;
    gallery.appendChild(card);
  }
}

function renderFilters() {
  filters.innerHTML = '';
  getFilters(state.items).forEach((label) => {
    const button = document.createElement('button');
    button.className = 'chip';
    button.type = 'button';
    button.setAttribute('aria-pressed', String(state.activeFilter === label));
    button.innerHTML = `<span class="chip-icon" aria-hidden="true">${iconFor(label)}</span><span>${label}</span>`;
    button.addEventListener('click', () => {
      state.activeFilter = label;
      state.visibleCount = pageSize;
      state.swipeIndex = 0;
      renderFilters();
      renderCurrentView();
    });
    filters.appendChild(button);
  });
}

function renderViewControls() {
  gridViewButton.setAttribute('aria-pressed', String(state.viewMode === 'grid'));
  swipeViewButton.setAttribute('aria-pressed', String(state.viewMode === 'swipe'));
}

function setViewMode(mode) {
  state.viewMode = mode;
  state.swipeIndex = 0;
  renderViewControls();
  renderCurrentView();
}

function renderGallery() {
  const filtered = getFilteredItems();
  const visible = filtered.slice(0, state.visibleCount);
  gallery.hidden = false;
  gallery.style.display = '';
  swipeView.hidden = true;
  swipeView.style.display = 'none';
  gallery.innerHTML = '';
  emptyState.hidden = filtered.length > 0;
  loadMoreButton.hidden = filtered.length <= state.visibleCount;

  visible.forEach((item) => {
    const card = document.createElement('button');
    card.className = 'topic-card';
    card.type = 'button';
    card.setAttribute('aria-label', `Open ${item.title}`);
    card.innerHTML = `
      <div class="card-image-wrap">
        <img class="card-image" src="${item.images.thumb}" alt="${item.alt}" loading="eager" decoding="async" width="640" height="954">
        <span class="card-topic-hint"><span aria-hidden="true">${iconFor(item.tags[0])}</span>${item.hint || item.category}</span>
      </div>
      <div class="card-copy">
        <div class="card-kicker">${item.category}</div>
        <h2 class="card-title">${item.title}</h2>
        <p class="card-summary">${item.takeaway}</p>
      </div>
    `;
    card.addEventListener('click', () => openModal(item));
    gallery.appendChild(card);
  });
}

function createSwipeCard(item, className) {
  const card = document.createElement('button');
  card.className = `swipe-card ${className}`;
  card.type = 'button';
  card.setAttribute('aria-label', `Open ${item.title}`);
  card.innerHTML = `
    <img src="${item.images.thumb}" alt="${item.alt}" loading="eager" decoding="async" width="640" height="954">
    <div class="swipe-card-copy">
      <div class="swipe-card-kicker">${item.hint || item.category}</div>
      <h2 class="swipe-card-title">${item.title}</h2>
      <p class="swipe-card-summary">${item.takeaway}</p>
    </div>
  `;
  card.addEventListener('click', () => openModal(item));
  return card;
}

function moveSwipe(direction) {
  const filtered = getFilteredItems();
  if (!filtered.length) return;
  state.swipeIndex = (state.swipeIndex + direction + filtered.length) % filtered.length;
  renderSwipeView();
}

function setupSwipeGesture(card) {
  let startX = 0;
  let startY = 0;
  let dragging = false;

  card.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) < Math.abs(dy)) return;
    card.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`;
  });

  card.addEventListener('pointerup', (event) => {
    if (!dragging) return;
    dragging = false;
    const dx = event.clientX - startX;
    card.style.transform = '';
    if (Math.abs(dx) > 70) moveSwipe(dx > 0 ? -1 : 1);
  });
}

function renderSwipeView() {
  const filtered = getFilteredItems();
  gallery.hidden = true;
  gallery.style.display = 'none';
  swipeView.hidden = false;
  swipeView.style.display = 'block';
  loadMoreButton.hidden = true;
  emptyState.hidden = filtered.length > 0;
  swipeDeck.innerHTML = '';

  if (!filtered.length) {
    swipeCounter.textContent = '';
    return;
  }

  if (state.swipeIndex >= filtered.length) state.swipeIndex = 0;
  const current = filtered[state.swipeIndex];
  const next = filtered[(state.swipeIndex + 1) % filtered.length];
  const third = filtered[(state.swipeIndex + 2) % filtered.length];

  if (filtered.length > 2) swipeDeck.appendChild(createSwipeCard(third, 'swipe-card-third'));
  if (filtered.length > 1) swipeDeck.appendChild(createSwipeCard(next, 'swipe-card-next'));
  const mainCard = createSwipeCard(current, 'swipe-card-main');
  setupSwipeGesture(mainCard);
  swipeDeck.appendChild(mainCard);
  swipeCounter.textContent = `${state.swipeIndex + 1} of ${filtered.length}`;
}

function renderCurrentView() {
  if (state.viewMode === 'swipe') {
    renderSwipeView();
  } else {
    renderGallery();
  }
}

function openModal(item) {
  modalImage.src = item.images.large;
  modalImage.alt = item.alt;
  modalCategory.textContent = `${item.category} · ${item.tags.join(' / ')}`;
  modalTitle.textContent = item.title;
  modalTakeaway.textContent = item.takeaway;
  modalMechanism.textContent = item.mechanism;
  modalFields.textContent = item.fields.join(', ');
  modalStatus.textContent = item.status;
  modalDescription.textContent = item.description;
  if (item.video) {
    modalVideo.hidden = false;
    modalVideo.href = item.video;
  } else {
    modalVideo.hidden = true;
  }
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalImage.removeAttribute('src');
}

document.querySelector('#closeLightbox').addEventListener('click', closeModal);
document.querySelector('#modalCloseButton').addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
  if (lightbox.classList.contains('is-open') || state.viewMode !== 'swipe') return;
  if (event.key === 'ArrowRight') moveSwipe(1);
  if (event.key === 'ArrowLeft') moveSwipe(-1);
});

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  state.visibleCount = pageSize;
  state.swipeIndex = 0;
  renderCurrentView();
});

loadMoreButton.addEventListener('click', () => {
  state.visibleCount += pageSize;
  renderGallery();
});

gridViewButton.addEventListener('click', () => setViewMode('grid'));
swipeViewButton.addEventListener('click', () => setViewMode('swipe'));
swipePrevButton.addEventListener('click', () => moveSwipe(-1));
swipeNextButton.addEventListener('click', () => moveSwipe(1));
swipeOpenButton.addEventListener('click', () => {
  const filtered = getFilteredItems();
  if (filtered.length) openModal(filtered[state.swipeIndex]);
});

let lastScrollY = window.scrollY;
let toolbarHidden = false;

function updateToolbarVisibility() {
  if (!toolbar) return;

  const current = window.scrollY;
  const delta = current - lastScrollY;
  const isMobile = window.innerWidth <= 760;
  const toolbarStart = Math.max(0, toolbar.offsetTop - 8);

  if (!isMobile || current <= toolbarStart) {
    toolbar.classList.remove('is-hidden');
    toolbarHidden = false;
    lastScrollY = current;
    return;
  }

  if (delta > 2 && !toolbarHidden) {
    toolbar.classList.add('is-hidden');
    toolbarHidden = true;
  } else if (delta < -2 && toolbarHidden) {
    toolbar.classList.remove('is-hidden');
    toolbarHidden = false;
  }

  lastScrollY = current;
}

window.addEventListener('scroll', updateToolbarVisibility, { passive: true });
window.addEventListener('resize', updateToolbarVisibility);

renderSkeleton();
renderViewControls();

fetch('data/items.json')
  .then((response) => response.json())
  .then((items) => {
    state.items = items;
    renderFilters();
    renderCurrentView();
  })
  .catch((error) => {
    console.error('Failed to load items', error);
    emptyState.hidden = false;
    emptyState.textContent = 'Could not load the visual science library.';
  });
