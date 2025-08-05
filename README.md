# Cobra DevTools 🐍

A stealth-grade Web3 toolkit for launching, simulating, and managing Solana token lifecycles.

## Stack
- Frontend: Vite + React + TailwindCSS
- Backend: Node.js (Express) + MongoDB + @solana/web3.js
- Telegram Bot: Telegraf + nacl signature login

## Setup
```bash
chmod +x setup.sh
./setup.sh
```

Then:
```bash
cd client && npm run dev           # frontend on localhost:5173
cd ../backend && node index.js     # backend API on localhost:4000
cd ../telegram && node bot.js      # telegram bot
```

## Env Setup
Copy and edit:
```
cp .env.example .env
```

## Folder Structure
- `client/` — Frontend UI
- `backend/` — API + Token logic
- `telegram/` — Login Bot
