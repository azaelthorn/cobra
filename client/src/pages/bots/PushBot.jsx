// client/src/pages/bots/PushBot.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../state/useUserStore';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function PushBot() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenMint, setTokenMint] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleStart = async () => {
    if (!tokenMint) {
      setStatus('⚠️ Token mint is required');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await axios.post(`${API_BASE}/api/bots/push`, {
        telegramId: user.telegramId,
        tokenMint
      });

      if (res.data.success) {
        setStatus(`🚀 PushBot started! Spamming on-chain micro TXs...`);
      } else {
        setStatus('❌ Failed to start PushBot.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ PushBot API error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">📢 PushBot</h1>

      <div className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Token Mint Address</label>
          <input
            type="text"
            value={tokenMint}
            onChange={(e) => setTokenMint(e.target.value)}
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            placeholder="Token Mint (SPL)"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 py-2 rounded mt-2"
        >
          {loading ? 'Starting...' : '🔥 Start PushBot'}
        </button>

        {status && (
          <div className="text-sm mt-2 text-yellow-400">{status}</div>
        )}
      </div>
    </div>
  );
}
