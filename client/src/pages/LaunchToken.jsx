// client/src/pages/LaunchToken.jsx
import { useState } from 'react';
import { useUserStore } from '../../state/useUserStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [status, setStatus] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLaunch = async () => {
    if (!tokenName || !supply || !launchpad) {
      setStatus('⚠️ Please fill all fields');
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
        setStatus(`✅ Token launched via ${launchpad}! TX: ${res.data.tx}`);
      } else {
        setStatus('❌ Failed to launch token');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Launch error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🪙 Launch Token</h1>

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
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded mt-4"
        >
          {loading ? '🚀 Launching...' : 'Launch Token'}
        </button>

        {status && (
          <div className="text-sm mt-2 text-yellow-400">{status}</div>
        )}
      </div>
    </div>
  );
}
