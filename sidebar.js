const fillButton = document.querySelector('#fillButton');
const profileButton = document.querySelector('#profileButton');
const statusLine = document.querySelector('#statusLine');

function setStatus(message, kind = '') {
  statusLine.className = `status-line ${kind}`;
  statusLine.querySelector('span:last-child').textContent = message;
}

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
