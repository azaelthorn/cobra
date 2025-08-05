// client/src/pages/bots/Mixer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../../state/useUserStore';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Mixer = () => {
  const { telegramId } = useUserStore();
  const [totalSol, setTotalSol] = useState('');
  const [count, setCount] = useState(30);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const runMixer = async () => {
    if (!telegramId) return toast.error('Login required via Telegram');
    if (!totalSol || isNaN(totalSol)) return toast.error('Enter valid SOL amount');

    setLoading(true);
    try {
      const res = await axios.post('/api/bots/mixer', {
        telegramId,
        totalSol: parseFloat(totalSol),
        count: parseInt(count)
      });

      toast.success(res.data.message || 'Mixer started');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Mixer error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-12 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700">
      <h1 className="text-2xl font-bold mb-4">🌀 Stealth Mixer</h1>

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
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Mixing...' : 'Run Mixer 🔄'}
        </button>
      </div>
    </div>
  );
};

export default Mixer;
