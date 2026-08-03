const pageSize = 12;

const state = {
  items: [],
  activeFilter: 'All',
  query: '',
  visibleCount: pageSize,
};

const filterIcons = {
  All: '✦',
  Biology: '☘',
  Chemistry: '⚗',
  Neuroscience: '◌',
  Physics: '⌁',
  Atmosphere: '☁',
  Space: '◐',
  Senses: '◍',
};

const gallery = document.querySelector('#gallery');
const filters = document.querySelector('#filters');
const searchInput = document.querySelector('#searchInput');
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
  return filterIcons[label] || '•';
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
