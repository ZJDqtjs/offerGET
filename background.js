importScripts('profile-model.js');

const profileUrl = chrome.runtime.getURL('profile.html');

async function seedStore() {
  const store = await loadProfileStore();
  if (store.profiles.length) {
    await saveProfileStore(store);
    return;
  }
  const response = await fetch(chrome.runtime.getURL('profile.json'));
  const profile = await response.json();
  const seeded = normalizeProfileStore({ profiles: [{ ...profile, name: '配置 1' }] });
  await saveProfileStore(seeded);
}

chrome.runtime.onInstalled.addListener(async () => {
  await seedStore();
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'open-profile') {
    chrome.tabs.create({ url: profileUrl });
  }
});