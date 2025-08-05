// client/src/pages/bots/PushBot.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../state/useUserStore';
import axios from 'axios';
import {
  MegaphoneIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function PushBot() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenMint, setTokenMint] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleStart = async () => {
    if (!tokenMint) {
      setStatus({ type: 'warning', text: 'Token mint is required' });
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
        setStatus({ type: 'success', text: 'PushBot started!' });
      } else {
        setStatus({ type: 'error', text: 'Failed to start PushBot.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'PushBot API error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="flex items-center text-2xl font-bold mb-4">
        <MegaphoneIcon className="w-6 h-6 mr-2" /> PushBot
      </h1>

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
          className="w-full bg-orange-600 hover:bg-orange-700 py-2 rounded mt-2 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <BoltIcon className="w-5 h-5 animate-pulse" /> Starting...
            </>
          ) : (
            <>
              <BoltIcon className="w-5 h-5" /> Start PushBot
            </>
          )}
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
