const pageSize = 12;

const state = {
  items: [],
  activeFilter: 'All',
  query: '',
  visibleCount: pageSize,
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
};

const gallery = document.querySelector('#gallery');
const filters = document.querySelector('#filters');
const searchInput = document.querySelector('#searchInput');
const toolbar = document.querySelector('.toolbar');
const emptyState = document.querySelector('#emptyState');
const loadMoreButton = document.querySelector('#loadMoreButton');
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
  items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
  return [...set];
}

function renderSkeleton(count = 6) {
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
      renderFilters();
      renderGallery();
    });
    filters.appendChild(button);
  });
}

function matches(item) {
  const filterMatch = state.activeFilter === 'All' || item.tags.includes(state.activeFilter);
  const haystack = normalize([item.title, item.question, item.takeaway, item.mechanism, item.fields.join(' '), item.tags.join(' ')].join(' '));
  const queryMatch = !state.query || haystack.includes(normalize(state.query));
  return filterMatch && queryMatch;
}

function renderGallery() {
  const filtered = state.items.filter(matches);
  const visible = filtered.slice(0, state.visibleCount);
  gallery.innerHTML = '';
  emptyState.hidden = filtered.length > 0;
  loadMoreButton.hidden = filtered.length <= state.visibleCount;

  visible.forEach((item, index) => {
    const loadingMode = 'eager';
    const card = document.createElement('button');
    card.className = 'topic-card';
    card.type = 'button';
    card.setAttribute('aria-label', `Open ${item.title}`);
    card.innerHTML = `
      <div class="card-image-wrap">
        <img class="card-image" src="${item.images.thumb}" alt="${item.alt}" loading="${loadingMode}" decoding="async" width="640" height="954">
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
});

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  state.visibleCount = pageSize;
  renderGallery();
});

loadMoreButton.addEventListener('click', () => {
  state.visibleCount += pageSize;
  renderGallery();
});

let lastScrollY = window.scrollY;
let toolbarHidden = false;

function updateToolbarVisibility() {
  if (!toolbar) return;

  const current = window.scrollY;
  const delta = current - lastScrollY;
  const isMobile = window.innerWidth <= 760;
  const galleryTop = gallery ? gallery.offsetTop : 0;
  const hideBeforeGrid = Math.round(window.innerHeight * 0.25);
  const hideAfterApproachingGrid = Math.max(180, galleryTop - hideBeforeGrid);

  if (!isMobile || current < hideAfterApproachingGrid) {
    toolbar.classList.remove('is-hidden');
    toolbarHidden = false;
    lastScrollY = current;
    return;
  }

  if (delta > 10 && !toolbarHidden) {
    toolbar.classList.add('is-hidden');
    toolbarHidden = true;
  } else if (delta < -8 && toolbarHidden) {
    toolbar.classList.remove('is-hidden');
    toolbarHidden = false;
  }

  lastScrollY = current;
}

window.addEventListener('scroll', updateToolbarVisibility, { passive: true });
window.addEventListener('resize', updateToolbarVisibility);

renderSkeleton();

fetch('data/items.json')
  .then((response) => response.json())
  .then((items) => {
    state.items = items;
    renderFilters();
    renderGallery();
  })
  .catch((error) => {
    console.error('Failed to load items', error);
    emptyState.hidden = false;
    emptyState.textContent = 'Could not load the visual science library.';
  });
