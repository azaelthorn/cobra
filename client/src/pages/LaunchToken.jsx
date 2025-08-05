// client/src/pages/LaunchToken.jsx
import { useState } from 'react';
import { useUserStore } from '../state/useUserStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const launchpadOptions = [
  { id: 'pumpfun', name: 'Pump.fun' },
  { id: 'bonk', name: 'LetsBonk.fun' },
  { id: 'meteora', name: 'Meteora' },
  { id: 'launchlab', name: 'LaunchLab' }
];

export default function LaunchToken() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [tokenName, setTokenName] = useState('');
  const [supply, setSupply] = useState('');
  const [launchpad, setLaunchpad] = useState('pumpfun');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLaunch = async () => {
    if (!tokenName || !supply || !launchpad) {
      setStatus({ type: 'warning', text: 'Please fill all fields' });
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await axios.post(`${API_BASE}/api/launch`, {
        telegramId: user.telegramId,
        publicKey: user.publicKey,
        tokenName,
        supply,
        launchpad
      });

      if (res.data.success) {
        setStatus({ type: 'success', text: `Token launched via ${launchpad}! TX: ${res.data.tx}` });
      } else {
        setStatus({ type: 'error', text: 'Failed to launch token' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Launch error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="flex items-center text-2xl font-bold mb-4">
        <RocketLaunchIcon className="w-6 h-6 mr-2" /> Launch Token
      </h1>

      <div className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Token Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            placeholder="ex: MoonPump"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Total Supply</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            placeholder="ex: 1000000"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Launchpad</label>
          <select
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700"
            value={launchpad}
            onChange={(e) => setLaunchpad(e.target.value)}
          >
            {launchpadOptions.map(lp => (
              <option key={lp.id} value={lp.id}>{lp.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLaunch}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded mt-4 transition-colors"
        >
          {loading ? 'Launching...' : 'Launch Token'}
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
            {status.type === 'error' && <XCircleIcon className="w-4 h-4" />}
            {status.type === 'warning' && <ExclamationTriangleIcon className="w-4 h-4" />}
            <span>{status.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
