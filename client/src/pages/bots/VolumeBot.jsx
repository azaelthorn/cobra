// client/src/pages/bots/VolumeBot.jsx
import { useState } from 'react';
import { useUserStore } from '../../../state/useUserStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function VolumeBot() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenMint, setTokenMint] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [running, setRunning] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const startBot = async () => {
    if (!tokenMint) {
      setStatus({ type: 'warning', text: 'Token mint required' });
      return;
    }

    try {
      setStatus({ type: 'info', text: 'Starting bot...' });
      const res = await axios.post(`${API_BASE}/api/bots/volume/start`, {
        telegramId: user.telegramId,
        tokenMint
      });

      if (res.data.success) {
        setRunning(true);
        setStatus({ type: 'success', text: `Bot started for ${tokenMint}` });
      } else {
        setStatus({ type: 'error', text: 'Failed to start bot' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'API error' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="flex items-center text-2xl font-bold mb-4">
        <ChartBarIcon className="w-6 h-6 mr-2" /> Volume Bot
      </h1>

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
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mt-2 transition-colors flex items-center justify-center gap-2"
        >
          {running ? (
            <>
              <PlayIcon className="w-5 h-5 animate-spin" /> Running...
            </>
          ) : (
            <>
              <PlayIcon className="w-5 h-5" /> Start Volume Bot
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
