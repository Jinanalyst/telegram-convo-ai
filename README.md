# Convoai Chat-to-Earn Bot

Telegram bot that rewards verified users after depositing **10 TON** to a static wallet.

## Features

1. **Static TON Wallet** – Users deposit to a fixed address (text + QR).
2. **Automatic Deposit Verification** – Bot checks TX history and marks users *Verified*.
3. **Restricted Access** – Only verified users can access the chat functionality.
4. **Admin Panel** – Simple commands to list verified users.

## Setup

1. Clone & install dependencies:

```bash
npm install
```

2. Copy the sample env file and fill in values:

```bash
cp env.sample .env
```

| Var | Description |
|-----|-------------|
| `BOT_TOKEN` | Telegram Bot API token |
| `TON_WALLET` | Wallet that receives deposits |
| `TON_API_KEY` | (Optional) TON API key for higher rate limits |
| `ADMIN_IDS` | Comma-separated Telegram user IDs with admin rights |
| `WEBAPP_URL` | Public HTTPS URL of the Telegram Mini App |
| `API_BASE_URL` | Public HTTPS base URL where the Express bot server exposes /api/* |

3. Start the bot:

```bash
npm run dev
```

## License
MIT 