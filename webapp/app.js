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
let navEl = document.getElementById('nav');
if (!navEl) {
  navEl = document.createElement('div');
  navEl.id = 'nav';
  document.body.appendChild(navEl);
}

const PAGES = {
  chat: renderChat,
  withdraw: renderWithdraw,
  dashboard: renderDashboard,
  deposits: renderDeposits,
};
let currentPage = 'chat';

const REWARD_TON = 0.05; // keep in sync with backend

if(tg && tg.colorScheme==='light') document.body.classList.add('light');

function renderNav() {
  navEl.innerHTML = `
    <div class="navbar">
      <button id="tab-chat">Chat</button>
      <button id="tab-withdraw">Withdraw</button>
      <button id="tab-dashboard">Dashboard</button>
      <button id="tab-deposits">Deposits</button>
      <button id="themeToggle">☾</button>
    </div>`;
  document.getElementById('themeToggle').onclick=()=>{
    document.body.classList.toggle('light');
    localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark');
  };
  ['chat','withdraw','dashboard','deposits'].forEach((p)=>{
    document.getElementById(`tab-${p}`).onclick = () => navigate(p);
  });
  updateActiveTab();
}

function updateActiveTab() {
  const buttons = navEl.querySelectorAll('button');
  buttons.forEach(b=>b.classList.remove('active'));
  const active = document.getElementById(`tab-${currentPage}`);
  if (active) active.classList.add('active');
}

async function navigate(page) {
  currentPage = page;
  updateActiveTab();
  const status = await fetchStatus();
  PAGES[page](status);
}

// Placeholder pages
function renderWithdraw(status){
  appEl.innerHTML=`<div class="container"><h2>Withdraw TON</h2>
    <p>Withdrawable: <strong id="wdAvail">${status.earned} TON</strong></p>
    <input id="wdAddr" placeholder="Your TON wallet address" style="width:100%;margin-bottom:8px" />
    <button id="wdBtn">Withdraw</button>
    <p id="wdMsg" style="margin-top:8px;color:#ffa500"></p>
  </div>`;
  const wdBtn=document.getElementById('wdBtn');
  const wdAddr=document.getElementById('wdAddr');
  const wdMsg=document.getElementById('wdMsg');
  wdBtn.onclick=async()=>{
    const addr=wdAddr.value.trim();
    if(!addr){wdMsg.textContent='Address required';return;}
    if(!/^[EU][A-Za-z0-9_-]{46,48}$/.test(addr)){wdMsg.textContent='Invalid TON address';return;}
    wdBtn.disabled=true; wdMsg.textContent='Processing…';
    try{
      const res=await fetch(`${API_BASE}/api/withdraw`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:userId,address:addr})});
      const data=await res.json();
      if(res.ok){
         wdMsg.style.color='#0f0';
         wdMsg.textContent=`Success! Withdrawn ${data.withdrawn} TON.`;
         document.getElementById('wdAvail').textContent='0 TON';
      }else{wdMsg.style.color='#f00'; wdMsg.textContent=data.error||'Error';}
    }catch(e){wdMsg.style.color='#f00'; wdMsg.textContent='Network error';}
    wdBtn.disabled=false;
  };
}
function renderDashboard(status){
  appEl.innerHTML=`<div class="container"><h2>Dashboard (coming soon)</h2></div>`;
}
function renderDeposits(status){
  appEl.innerHTML=`<div class="container"><h2>Deposit History (coming soon)</h2></div>`;
}

async function fetchStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/status/${userId}`);
    if (!res.ok) throw new Error('status ' + res.status);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('fetchStatus error', e);
    // fallback empty status
    return { verified: false, earned: 0, messages: 0 };
  }
}

function renderDeposit(status) {
  appEl.innerHTML = `
    <div class="container">
      <h2>Deposit 10 TON to unlock chat</h2>
      <p>Send at least 10 TON to:</p>
      <code id="walletAddr">UQCpjI3LzlAcvJz_4d1q1AiT5CJVY1onmpBsNO-7yEpZJyU8</code>
      <button id="copyAddr">Copy</button>
      <br/>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=UQCpjI3LzlAcvJz_4d1q1AiT5CJVY1onmpBsNO-7yEpZJyU8" alt="QR" width="180" />
      <p>Status: <strong>${status.verified ? '✅ Deposit confirmed' : 'Waiting for deposit...'}</strong></p>
      <button id="refresh">Refresh</button>
    </div>`;

  document.getElementById('copyAddr').onclick = () => {
    navigator.clipboard.writeText('UQCpjI3LzlAcvJz_4d1q1AiT5CJVY1onmpBsNO-7yEpZJyU8');
    alert('Address copied!');
  };

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
    <div class="container chat-wrapper">
      <div id="chat"></div>
      <div style="display:flex;gap:4px;">
        <input id="input" placeholder="Type a message..." style="flex:1" />
        <button id="send">Send</button>
      </div>
      <p>Earned: <span id="earned">${status.earned} TON</span> <button id="viewRewards">Rewards</button></p>
    </div>`;

  const chatEl = document.getElementById('chat');
  const inputEl = document.getElementById('input');
  const earnedEl = document.getElementById('earned');

  const rewardSound = new Audio('data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAeAAACABBAAAACAfQ//uQxAABAAAAAQAAAP/+5DEAAEAAAABAAAA//7kMQAAQAAAAEAAAD//uQxAABAAAAAQAAAP/+5DEAAEAAAABAAAA');

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    addMessage('user', text);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, message: text }),
      });
      const data = await res.json();
      addMessage('ai', data.reply);
      earnedEl.textContent = data.totalEarned + ' TON';
      showToast(`+${REWARD_TON} TON`);
      rewardSound.play().catch(()=>{});
    } catch (e) {
      addMessage('ai', 'Error, please try again later.');
    }
  }

  function addMessage(type, text) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(()=> toast.remove(), 2000);
  }

  document.getElementById('send').onclick = sendMessage;
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  document.getElementById('viewRewards').onclick = async () => {
    const latest = await fetchStatus();
    renderRewards(latest);
  };
}

function renderRewards(status) {
  appEl.innerHTML = `
    <div class="container">
      <h2>Your Rewards</h2>
      <p>Messages sent: <strong>${status.messages}</strong></p>
      <p>Total earned: <strong>${status.earned} TON</strong></p>
      <button id="backToChat">Back to Chat</button>
    </div>`;

  document.getElementById('backToChat').onclick = () => {
    renderChat(status);
  };
}

(async () => {
  if (!userId) {
    appEl.innerHTML = '<p>Error: cannot detect Telegram user.</p>';
    return;
  }
  const status = await fetchStatus();
  renderNav();
  if (status.verified) {
    renderChat(status);
  } else {
    renderDeposit(status);
  }
})(); 