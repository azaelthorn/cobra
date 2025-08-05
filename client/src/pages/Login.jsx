// client/src/pages/Login.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const telegramId = query.get('telegramId');
    const username = query.get('username');
    const signature = query.get('signature');
    const pubkey = query.get('pubkey');

    if (!telegramId || !username || !signature || !pubkey) {
      setError('Missing Telegram auth parameters.');
      setLoading(false);
      return;
    }

    const loginUser = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/wallet/generate`, {
          telegramId,
          username
        });

        // Save to localStorage
        localStorage.setItem('cobraUser', JSON.stringify(res.data.wallet));
        navigate('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
        setError('Login failed. Try again.');
      } finally {
        setLoading(false);
      }
    };

    loginUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      {loading ? (
        <div className="text-lg">🔐 Logging you in via Telegram...</div>
      ) : error ? (
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <a
            href="https://t.me/CobraDEVTools_Bot"
            className="underline text-blue-400"
          >
            Retry Login
          </a>
        </div>
      ) : null}
    </div>
  );
}
