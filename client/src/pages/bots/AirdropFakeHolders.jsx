// client/src/pages/bots/AirdropFakeHolders.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../state/useUserStore';
import axios from 'axios';
import {
  GiftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function AirdropFakeHolders() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenMint, setTokenMint] = useState('');
  const [decimals, setDecimals] = useState(6);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAirdrop = async () => {
    if (!tokenMint || decimals === '') {
      setStatus({ type: 'warning', text: 'Fill in all fields' });
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
        setStatus({ type: 'success', text: 'Airdrop started! Check chart soon.' });
      } else {
        setStatus({ type: 'error', text: 'Failed to trigger airdrop.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Error while sending request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="flex items-center text-2xl font-bold mb-4">
        <GiftIcon className="w-6 h-6 mr-2" /> Fake Holder Airdrop
      </h1>

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
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded mt-2 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Sending...' : <><GiftIcon className="w-5 h-5" /> Airdrop to 100+ Wallets</>}
        </button>

        {status.text && (
          <div
            className={`text-sm mt-2 flex items-center gap-2 ${
              status.type === 'success'
                ? 'text-green-400'
                : status.type === 'error'
                ? 'text-red-400'
                : 'text-yellow-400'
            }`}
          >
            {status.type === 'success' && <CheckCircleIcon className="w-4 h-4" />}
            {status.type !== 'success' && <ExclamationTriangleIcon className="w-4 h-4" />}
            <span>{status.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
