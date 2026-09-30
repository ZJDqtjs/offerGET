const profileUrl = chrome.runtime.getURL('profile.html');

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get('profile');
  if (!existing.profile) {
    const response = await fetch(chrome.runtime.getURL('profile.json'));
    const profile = await response.json();
    await chrome.storage.local.set({ profile });
  }
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'open-profile') {
    chrome.tabs.create({ url: profileUrl });
  }
});
