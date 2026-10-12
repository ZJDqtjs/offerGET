const form = document.querySelector('#profileForm');
const toast = document.querySelector('#toast');
const importInput = document.querySelector('#importInput');
const nav = document.querySelector('#profileNav');
const configSelect = document.querySelector('#configSelect');
const configName = document.querySelector('#configName');
const newConfigButton = document.querySelector('#newConfigButton');
const duplicateConfigButton = document.querySelector('#duplicateConfigButton');
const deleteConfigButton = document.querySelector('#deleteConfigButton');

const simpleFields = [...form.querySelectorAll('[data-group]')];
const repeaters = [...form.querySelectorAll('[data-repeater]')];
const sections = [...form.querySelectorAll('.form-section')];

let store = { profiles: [], activeProfileId: '' };
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

function activeProfile() {
  return getActiveProfile(store);
}

function renderConfigBar() {
  configSelect.replaceChildren();
  store.profiles.forEach((profile) => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profile.name;
    configSelect.append(option);
  });
  configSelect.value = store.activeProfileId;
  configName.value = activeProfile()?.name || '';
  deleteConfigButton.disabled = store.profiles.length <= 1;
}

function showProfile(profile) {
  currentProfile = profile;
  writeForm(currentProfile);
  renderConfigBar();
}

function syncCurrentIntoStore() {
  const index = store.profiles.findIndex((profile) => profile.id === store.activeProfileId);
  if (index >= 0) store.profiles[index] = currentProfile;
}

async function persistActive() {
  currentProfile = collectProfile();
  syncCurrentIntoStore();
  await saveProfileStore(store);
  renderConfigBar();
}

function downloadJson(data, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

document.querySelector('#saveButton').addEventListener('click', async () => {
  await persistActive();
  showToast(`「${currentProfile.name}」已保存`);
});

configSelect.addEventListener('change', async () => {
  const nextId = configSelect.value;
  if (nextId === store.activeProfileId) return;
  await persistActive();
  store.activeProfileId = nextId;
  await saveProfileStore(store);
  showProfile(activeProfile());
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`已切换到「${currentProfile.name}」`);
});

configName.addEventListener('change', async () => {
  const name = configName.value.trim();
  if (!name) {
    configName.value = currentProfile.name;
    return;
  }
  currentProfile = collectProfile();
  currentProfile.name = name;
  syncCurrentIntoStore();
  await saveProfileStore(store);
  renderConfigBar();
  showToast('配置名称已更新');
});

newConfigButton.addEventListener('click', async () => {
  await persistActive();
  const profile = { id: offergetNewId(), name: `配置 ${store.profiles.length + 1}`, schemaVersion: OFFERGET_SCHEMA_VERSION };
  store.profiles.push(profile);
  store.activeProfileId = profile.id;
  await saveProfileStore(store);
  showProfile(profile);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('已新建空白配置');
});

duplicateConfigButton.addEventListener('click', async () => {
  await persistActive();
  const copy = { ...structuredClone(currentProfile), id: offergetNewId(), name: `${currentProfile.name} 副本` };
  store.profiles.push(copy);
  store.activeProfileId = copy.id;
  await saveProfileStore(store);
  showProfile(copy);
  showToast('已复制当前配置');
});

deleteConfigButton.addEventListener('click', async () => {
  if (store.profiles.length <= 1) return;
  const index = store.profiles.findIndex((profile) => profile.id === store.activeProfileId);
  const name = store.profiles[index].name;
  if (!confirm(`确定删除「${name}」？该配置下的资料会一并移除。`)) return;
  store.profiles.splice(index, 1);
  store.activeProfileId = store.profiles[Math.min(index, store.profiles.length - 1)].id;
  await saveProfileStore(store);
  showProfile(activeProfile());
  showToast(`已删除「${name}」`);
});

document.querySelector('#exportButton').addEventListener('click', async () => {
  await persistActive();
  downloadJson({ profiles: store.profiles, activeProfileId: store.activeProfileId }, 'offerget-profiles.json');
});

document.querySelector('#importButton').addEventListener('click', () => importInput.click());
importInput.addEventListener('change', async () => {
  const file = importInput.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (Array.isArray(parsed.profiles)) {
      if (!confirm(`导入将替换当前的 ${store.profiles.length} 个配置，确定继续？`)) return;
      store = normalizeProfileStore(parsed);
    } else {
      const [profile] = normalizeProfileStore({ profiles: [parsed] }).profiles;
      store.profiles.push(profile);
      store.activeProfileId = profile.id;
    }
    await saveProfileStore(store);
    showProfile(activeProfile());
    showToast('JSON 已导入');
  } catch {
    showToast('JSON 格式无法读取');
  } finally {
    importInput.value = '';
  }
});

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== 'local' || !changes.activeProfileId) return;
  const nextId = changes.activeProfileId.newValue;
  if (!nextId || nextId === store.activeProfileId) return;

  const previousId = store.activeProfileId;
  currentProfile = collectProfile();
  const refreshed = await loadProfileStore();
  const index = refreshed.profiles.findIndex((profile) => profile.id === previousId);
  if (index >= 0) refreshed.profiles[index] = currentProfile;
  refreshed.activeProfileId = nextId;
  store = refreshed;
  await saveProfileStore(store);
  showProfile(activeProfile());
  showToast('已同步其他页面的切换');
});

async function init() {
  store = await loadProfileStore();
  if (!store.profiles.length) {
    const profile = { id: offergetNewId(), name: '配置 1', schemaVersion: OFFERGET_SCHEMA_VERSION };
    store.profiles.push(profile);
    store.activeProfileId = profile.id;
    await saveProfileStore(store);
  }
  showProfile(activeProfile());
}

buildNav();
trackActiveSection();
init();