const form = document.querySelector('#profileForm');
const toast = document.querySelector('#toast');
const importInput = document.querySelector('#importInput');

const fields = [...form.querySelectorAll('[data-group]')];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function readForm() {
  return fields.reduce((profile, field) => {
    const group = field.dataset.group;
    const key = field.dataset.key || field.id;
    profile[group] ||= {};
    profile[group][key] = field.value.trim();
    return profile;
  }, {});
}

function writeForm(profile) {
  fields.forEach((field) => {
    const group = profile[field.dataset.group] || {};
    const key = field.dataset.key || field.id;
    field.value = group[key] || '';
  });
}

async function loadProfile() {
  const stored = await chrome.storage.local.get('profile');
  if (stored.profile) writeForm(stored.profile);
}

document.querySelector('#saveButton').addEventListener('click', async () => {
  await chrome.storage.local.set({ profile: readForm() });
  showToast('资料已保存到本地');
});

document.querySelector('#exportButton').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(readForm(), null, 2)], { type: 'application/json' });
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
    const profile = JSON.parse(await file.text());
    writeForm(profile);
    await chrome.storage.local.set({ profile });
    showToast('JSON 已导入');
  } catch {
    showToast('JSON 格式无法读取');
  }
  importInput.value = '';
});

loadProfile();
