// client/src/pages/BotMonitor.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import useUserStore from '../../state/useUserStore';
import {
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const BotMonitor = () => {
  const { telegramId } = useUserStore();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/bots/status?telegramId=${telegramId}`);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error('Failed to load bot status:', err.message);
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    if (telegramId) fetchStatus();
  }, [telegramId, fetchStatus]);

  return (
    <div className="p-6">
      <h1 className="flex items-center text-3xl font-bold mb-4">
        <CpuChipIcon className="w-7 h-7 mr-2" /> Active Bot Sessions
      </h1>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="text-gray-400">No active bots found for your tokens.</div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="bg-gray-900 text-white rounded-xl shadow p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold truncate">{session.tokenMint}</h2>
                <span className="text-sm text-gray-400">
                  Updated: {new Date(session.lastUpdated).toLocaleTimeString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                {Object.entries(session.bots).map(([botName, isActive], i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${
                      isActive ? 'bg-green-800' : 'bg-gray-800'
                    }`}
                  >
                    {isActive ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="capitalize">{botName}</span>
                  </div>
                ))}
              </div>

              {session.targetMcap && (
                <div className="mt-3 text-xs text-yellow-400">
                  Sell target: ${session.targetMcap.toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BotMonitor;
