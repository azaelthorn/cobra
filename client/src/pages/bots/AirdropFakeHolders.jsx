// client/src/pages/bots/AirdropFakeHolders.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../state/useUserStore';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function AirdropFakeHolders() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenMint, setTokenMint] = useState('');
  const [decimals, setDecimals] = useState(6);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAirdrop = async () => {
    if (!tokenMint || decimals === '') {
      setStatus('⚠️ Fill in all fields');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await axios.post(`${API_BASE}/api/bots/airdrop`, {
        telegramId: user.telegramId,
        tokenMint,
        decimals: parseInt(decimals)
      });

      if (res.data.success) {
        setStatus(`✅ Airdrop started! Check chart in a few minutes.`);
      } else {
        setStatus('❌ Failed to trigger airdrop.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error while sending request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🪂 Fake Holder Airdrop</h1>

      <div className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Token Mint Address</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            placeholder="So111111111..."
            value={tokenMint}
            onChange={(e) => setTokenMint(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Token Decimals</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
          />
        </div>

        <button
          onClick={handleAirdrop}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded mt-2"
        >
          {loading ? 'Sending...' : '🪂 Airdrop to 100+ Wallets'}
        </button>

        {status && (
          <div className="text-sm mt-2 text-yellow-400">{status}</div>
        )}
      </div>
    </div>
  );
}
