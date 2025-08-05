// client/src/pages/bots/PushBot.jsx
import { useState } from 'react';
import axios from 'axios';
import useUserStore from '../../state/useUserStore';

const PushBot = () => {
  const { telegramId } = useUserStore();
  const [tokenMint, setTokenMint] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const handlePushBot = async () => {
    if (!tokenMint) {
      return alert('Please enter a token mint address.');
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/bots/push', {
        telegramId,
        tokenMint
      });

      setResponseMsg(res.data.message || 'PushBot triggered!');
    } catch (err) {
      console.error(err);
      setResponseMsg('❌ Failed to start PushBot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">📢 PushBot Emoji Spammer</h2>
      <p className="text-sm text-gray-400 mb-4">
        Simulate emoji spam (🔥🚀💎) from multiple wallets on DexScreener.
      </p>

      <div className="mb-4">
        <label className="block text-sm mb-1">Token Mint</label>
        <input
          type="text"
          placeholder="e.g. 7n7EV4E...Zq9"
          className="w-full px-3 py-2 border border-gray-700 rounded bg-black text-white"
          value={tokenMint}
          onChange={(e) => setTokenMint(e.target.value)}
        />
      </div>

      <button
        onClick={handlePushBot}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        {loading ? 'Sending Emojis...' : 'Start PushBot'}
      </button>

      {responseMsg && (
        <p className="mt-4 text-sm text-green-400">{responseMsg}</p>
      )}
    </div>
  );
};

export default PushBot;
