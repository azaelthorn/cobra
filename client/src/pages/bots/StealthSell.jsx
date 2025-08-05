// client/src/pages/bots/StealthSell.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../state/useUserStore';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function StealthSell() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenMint, setTokenMint] = useState('');
  const [decimals, setDecimals] = useState(6);
  const [targetMcap, setTargetMcap] = useState(30000);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleStart = async () => {
    if (!tokenMint || decimals === '' || targetMcap === '') {
      setStatus('⚠️ All fields are required');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await axios.post(`${API_BASE}/api/bots/sell`, {
        telegramId: user.telegramId,
        tokenMint,
        decimals: parseInt(decimals),
        targetMcap: parseInt(targetMcap)
      });

      if (res.data.success) {
        setStatus(`✅ Stealth Sell Bot started. Watching for $${targetMcap} MCAP`);
      } else {
        setStatus('❌ Failed to start bot.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ API error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">💸 Smart Stealth Sell</h1>

      <div className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Token Mint</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            value={tokenMint}
            onChange={(e) => setTokenMint(e.target.value)}
            placeholder="Your token mint address..."
          />
        </div>

        <div>
          <label className="block mb-1">Token Decimals</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            placeholder="Usually 6 or 9"
          />
        </div>

        <div>
          <label className="block mb-1">Target Marketcap (USD)</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            value={targetMcap}
            onChange={(e) => setTargetMcap(e.target.value)}
            placeholder="ex: 50000"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded mt-2"
        >
          {loading ? 'Watching Chart...' : '🚨 Start Stealth Sell Bot'}
        </button>

        {status && (
          <div className="text-sm mt-2 text-yellow-400">{status}</div>
        )}
      </div>
    </div>
  );
}
