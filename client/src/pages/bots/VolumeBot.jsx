// client/src/pages/bots/VolumeBot.jsx
import { useState } from 'react';
import { useUserStore } from '../../../state/useUserStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function VolumeBot() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenMint, setTokenMint] = useState('');
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const startBot = async () => {
    if (!tokenMint) {
      setStatus('⚠️ Token mint required');
      return;
    }

    try {
      setStatus('⏳ Starting bot...');
      const res = await axios.post(`${API_BASE}/api/bots/volume/start`, {
        telegramId: user.telegramId,
        tokenMint
      });

      if (res.data.success) {
        setRunning(true);
        setStatus(`✅ Bot started for ${tokenMint}`);
      } else {
        setStatus('❌ Failed to start bot');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ API error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📈 Volume Bot</h1>

      <div className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Your Token Mint</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            placeholder="Enter token mint..."
            value={tokenMint}
            onChange={(e) => setTokenMint(e.target.value)}
          />
        </div>

        <button
          onClick={startBot}
          disabled={running}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-2"
        >
          {running ? '🔄 Running...' : '🚀 Start Volume Bot'}
        </button>

        {status && (
          <div className="text-sm mt-2 text-yellow-400">{status}</div>
        )}
      </div>
    </div>
  );
}
