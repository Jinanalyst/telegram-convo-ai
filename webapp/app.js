const tg = window.Telegram.WebApp;
const paramUid = new URLSearchParams(window.location.search).get('uid');
const user = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || {};

// Attempt to derive the Telegram user ID from multiple sources
// 1. initDataUnsafe.user.id (preferred)
// 2. "uid" query parameter
// 3. initDataUnsafe.start_param (when the WebApp is opened via `web_app` button and query params are stripped)

let userId = user.id || paramUid;

// Fallback: try to extract uid from start_param if still undefined
if (!userId && tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) {
  const startParam = tg.initDataUnsafe.start_param;
  // Handle cases like "uid=123456" or plain numeric "123456"
  const match = startParam.match(/uid=(\d+)/);
  if (match) {
    userId = match[1];
  } else if (/^\d+$/.test(startParam)) {
    userId = startParam;
  }
}

// Determine backend API base URL
const params = new URLSearchParams(window.location.search);
const API_BASE = params.get('api') || '';

const appEl = document.getElementById('app');

async function fetchStatus() {
  const res = await fetch(`${API_BASE}/api/status/${userId}`);
  return res.json();
}

function renderDeposit(status) {
  appEl.innerHTML = `
    <div class="container">
      <h2>Deposit 10 TON to unlock chat</h2>
      <p>Send at least 10 TON to:</p>
      <code>UQCpjI3LzlAcvJz_4d1q1AiT5CJVY1onmpBsNO-7yEpZJyU8</code>
      <br/>
      <img src="/qr.png" alt="QR" width="180" />
      <p>Status: <strong>${status.verified ? '✅ Deposit confirmed' : 'Waiting for deposit...'}</strong></p>
      <button id="refresh">Refresh</button>
    </div>`;

  document.getElementById('refresh').onclick = async () => {
    const newStatus = await fetchStatus();
    if (newStatus.verified) {
      renderChat(newStatus);
    } else {
      renderDeposit(newStatus);
    }
  };
}

function renderChat(status) {
  appEl.innerHTML = `
    <div class="container">
      <div id="chat"></div>
      <input id="input" placeholder="Type a message..." style="width:80%" />
      <button id="send">Send</button>
      <p>Earned: <span id="earned">${status.earned} TON</span></p>
    </div>`;

  const chatEl = document.getElementById('chat');
  const inputEl = document.getElementById('input');
  const earnedEl = document.getElementById('earned');

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addMessage('user', text);

    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, message: text }),
    });
    const data = await res.json();
    addMessage('ai', data.reply);
    earnedEl.textContent = data.totalEarned + ' TON';
  }

  function addMessage(type, text) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  document.getElementById('send').onclick = sendMessage;
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

(async () => {
  if (!userId) {
    appEl.innerHTML = '<p>Error: cannot detect Telegram user.</p>';
    return;
  }
  const status = await fetchStatus();
  if (status.verified) {
    renderChat(status);
  } else {
    renderDeposit(status);
  }
})(); 