// client/src/pages/bots/Mixer.jsx
import { useState } from 'react';
import axios from 'axios';
import useUserStore from '../../state/useUserStore';

const Mixer = () => {
  const { telegramId } = useUserStore();
  const [totalSol, setTotalSol] = useState('');
  const [count, setCount] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const startMixer = async () => {
    if (!totalSol) return alert('Enter total SOL to split');
    setLoading(true);
    try {
      const res = await axios.post('/api/bots/mixer', {
        telegramId,
        totalSol: parseFloat(totalSol),
        count: parseInt(count)
      });
      setResult(res.data.message);
    } catch (err) {
      console.error(err);
      setResult('Failed to start mixer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🌀 Stealth Mixer</h2>
      <p className="mb-2 text-sm text-gray-400">
        Split your SOL across many wallets to obfuscate on-chain traces.
      </p>

      <div className="mb-4">
        <label className="block text-sm mb-1">Total SOL to Split</label>
        <input
          type="number"
          value={totalSol}
          onChange={(e) => setTotalSol(e.target.value)}
          placeholder="e.g. 2"
          className="w-full px-3 py-2 bg-black text-white border border-gray-700 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Number of Wallets</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="e.g. 30"
          className="w-full px-3 py-2 bg-black text-white border border-gray-700 rounded"
        />
      </div>

      <button
        onClick={startMixer}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Mixing...' : 'Start Mixer'}
      </button>

      {result && <p className="mt-4 text-green-400 text-sm">{result}</p>}
    </div>
  );
};

export default Mixer;
