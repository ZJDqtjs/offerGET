const form = document.querySelector('#profileForm');
const toast = document.querySelector('#toast');
const importInput = document.querySelector('#importInput');
const nav = document.querySelector('#profileNav');

const simpleFields = [...form.querySelectorAll('[data-group]')];
const repeaters = [...form.querySelectorAll('[data-repeater]')];
const sections = [...form.querySelectorAll('.form-section')];

let currentProfile = {};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function createEntryCard(name, entry = {}) {
  const template = document.querySelector(`#tpl-${name}`);
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelectorAll('[data-field]').forEach((input) => {
    input.value = entry[input.dataset.field] ?? '';
  });
  return card;
}

function renumber(container) {
  container.querySelectorAll('.entry-card').forEach((card, index) => {
    card.querySelector('.entry-index').textContent = `#${index + 1}`;
  });
}

function renderRepeater(name, entries) {
  const container = form.querySelector(`[data-repeater="${name}"]`);
  const list = Array.isArray(entries) && entries.length ? entries : [{}];
  container.replaceChildren();
  list.forEach((entry) => container.append(createEntryCard(name, entry)));
  renumber(container);
}

function writeForm(profile) {
  simpleFields.forEach((field) => {
    const group = profile[field.dataset.group] || {};
    field.value = group[field.dataset.key || field.id] ?? '';
  });
  repeaters.forEach((container) => renderRepeater(container.dataset.repeater, profile[container.dataset.repeater] || []));
}

function collectProfile() {
  const profile = structuredClone(currentProfile);
  simpleFields.forEach((field) => {
    const group = field.dataset.group;
    if (!profile[group] || typeof profile[group] !== 'object' || Array.isArray(profile[group])) profile[group] = {};
    profile[group][field.dataset.key || field.id] = field.value.trim();
  });
  repeaters.forEach((container) => {
    profile[container.dataset.repeater] = [...container.querySelectorAll('.entry-card')]
      .map((card) => {
        const entry = {};
        card.querySelectorAll('[data-field]').forEach((input) => { entry[input.dataset.field] = input.value.trim(); });
        return entry;
      })
      .filter((entry) => Object.values(entry).some(Boolean));
  });
  profile.schemaVersion = OFFERGET_SCHEMA_VERSION;
  return profile;
}

const navItems = new Map();

function buildNav() {
  sections.forEach((section, index) => {
    const heading = section.querySelector('h2');
    const number = heading.querySelector('span')?.textContent.trim() || String(index + 1).padStart(2, '0');
    section.id = `section-${number}`;

    const item = document.createElement('a');
    item.className = 'nav-item';
    item.href = `#${section.id}`;

    const indexEl = document.createElement('span');
    indexEl.className = 'nav-index';
    indexEl.textContent = number;

    const labelEl = document.createElement('span');
    labelEl.className = 'nav-label';
    labelEl.textContent = heading.textContent.replace(number, '').trim();

    item.append(indexEl, labelEl);
    nav.append(item);
    navItems.set(section.id, item);
  });
}

function trackActiveSection() {
  let queued = false;
  const update = () => {
    queued = false;
    let active = sections[0]?.id;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 140) active = section.id;
    });
    navItems.forEach((item, id) => item.classList.toggle('active', id === active));
  };
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

form.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    const container = form.querySelector(`[data-repeater="${addButton.dataset.add}"]`);
    container.append(createEntryCard(addButton.dataset.add));
    renumber(container);
    return;
  }
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    const card = removeButton.closest('.entry-card');
    const container = card.parentElement;
    card.remove();
    if (!container.querySelector('.entry-card')) container.append(createEntryCard(container.dataset.repeater));
    renumber(container);
  }
});

document.querySelector('#saveButton').addEventListener('click', async () => {
  currentProfile = collectProfile();
  await chrome.storage.local.set({ profile: currentProfile });
  showToast('资料已保存到本地');
});

document.querySelector('#exportButton').addEventListener('click', () => {
  currentProfile = collectProfile();
  const blob = new Blob([JSON.stringify(currentProfile, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'offerget-profile.json';
  anchor.click();
  URL.revokeObjectURL(url);
});

document.querySelector('#importButton').addEventListener('click', () => importInput.click());
importInput.addEventListener('change', async () => {
  const file = importInput.files[0];
  if (!file) return;
  try {
    currentProfile = migrateProfile(JSON.parse(await file.text()));
    writeForm(currentProfile);
    await chrome.storage.local.set({ profile: currentProfile });
    showToast('JSON 已导入');
  } catch {
    showToast('JSON 格式无法读取');
  }
  importInput.value = '';
});

async function loadProfile() {
  const stored = await chrome.storage.local.get('profile');
  currentProfile = migrateProfile(stored.profile);
  writeForm(currentProfile);
}

buildNav();
trackActiveSection();
loadProfile();