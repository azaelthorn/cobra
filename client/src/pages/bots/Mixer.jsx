// client/src/pages/bots/Mixer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../state/useUserStore';
import { useNavigate } from 'react-router-dom';
import {
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Mixer = () => {
  const { telegramId } = useUserStore();
  const [totalSol, setTotalSol] = useState('');
  const [count, setCount] = useState(30);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const runMixer = async () => {
    if (!telegramId) {
      setStatus({ type: 'error', text: 'Login required via Telegram' });
      return;
    }
    if (!totalSol || isNaN(totalSol)) {
      setStatus({ type: 'error', text: 'Enter valid SOL amount' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/bots/mixer`, {
        telegramId,
        totalSol: parseFloat(totalSol),
        count: parseInt(count)
      });

      setStatus({ type: 'success', text: res.data.message || 'Mixer started' });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: err?.response?.data?.error || 'Mixer error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-12 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700">
      <h1 className="flex items-center text-2xl font-bold mb-4">
        <ArrowsRightLeftIcon className="w-6 h-6 mr-2" /> Stealth Mixer
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Total SOL to Obfuscate</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
            placeholder="e.g. 1.5"
            value={totalSol}
            onChange={(e) => setTotalSol(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Number of Wallets</label>
          <input
            type="number"
            min="10"
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
            placeholder="e.g. 30"
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>

        <button
          onClick={runMixer}
          disabled={loading}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Mixing...' : <><ArrowsRightLeftIcon className="w-5 h-5" /> Run Mixer</>}
        </button>

        {status.text && (
          <div
            className={`text-sm mt-3 flex items-center gap-2 ${
              status.type === 'success'
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              <ExclamationTriangleIcon className="w-4 h-4" />
            )}
            <span>{status.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mixer;
