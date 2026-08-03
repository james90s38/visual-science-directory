const state = {
  items: [],
  activeFilter: 'All',
  query: '',
};

const gallery = document.querySelector('#gallery');
const filters = document.querySelector('#filters');
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
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

function getFilters(items) {
  const set = new Set(['All']);
  items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
  return [...set];
}

function renderFilters() {
  filters.innerHTML = '';
  getFilters(state.items).forEach((label) => {
    const button = document.createElement('button');
    button.className = 'chip';
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(state.activeFilter === label));
    button.addEventListener('click', () => {
      state.activeFilter = label;
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
  const visible = state.items.filter(matches);
  gallery.innerHTML = '';
  emptyState.hidden = visible.length > 0;

  visible.forEach((item) => {
    const card = document.createElement('button');
    card.className = 'topic-card';
    card.type = 'button';
    card.setAttribute('aria-label', `Open ${item.title}`);
    card.innerHTML = `
      <img class="card-image" src="${item.images.thumb}" alt="${item.alt}" loading="lazy" decoding="async" width="640" height="954">
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
  renderGallery();
});

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
