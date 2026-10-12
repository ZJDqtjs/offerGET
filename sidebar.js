const fillButton = document.querySelector('#fillButton');
const profileButton = document.querySelector('#profileButton');
const statusLine = document.querySelector('#statusLine');
const configSelect = document.querySelector('#configSelect');

let store = { profiles: [], activeProfileId: '' };

function setStatus(message, kind = '') {
  statusLine.className = `status-line ${kind}`;
  statusLine.querySelector('span:last-child').textContent = message;
}

function renderConfigs() {
  configSelect.replaceChildren();
  store.profiles.forEach((profile) => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profile.name;
    configSelect.append(option);
  });
  configSelect.value = store.activeProfileId;

  const active = getActiveProfile(store);
  setStatus(active ? `将使用「${active.name}」填充` : '还没有可用的资料配置');
}

async function loadConfigs() {
  store = await loadProfileStore();
  renderConfigs();
}

configSelect.addEventListener('change', async () => {
  store.activeProfileId = configSelect.value;
  await saveProfileStore(store);
  renderConfigs();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && (changes.profiles || changes.activeProfileId)) loadConfigs();
});

fillButton.addEventListener('click', async () => {
  fillButton.disabled = true;
  setStatus('正在扫描当前页面…');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'fill-form' });
    setStatus(result?.filled ? `已填充 ${result.filled} 个字段` : '没有找到可识别的字段', result?.filled ? 'success' : 'warning');
  } catch {
    setStatus('当前页面暂不支持填充', 'warning');
  } finally {
    fillButton.disabled = false;
  }
});

profileButton.addEventListener('click', () => chrome.runtime.sendMessage({ type: 'open-profile' }));

document.querySelector('#version').textContent = `v${chrome.runtime.getManifest().version}`;
loadConfigs();