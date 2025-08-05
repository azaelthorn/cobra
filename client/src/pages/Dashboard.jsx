// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WrenchScrewdriverIcon,
  UserIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  GiftIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('cobraUser');
    if (!stored) {
      navigate('/login');
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('cobraUser');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-6 py-8">
      <header className="flex items-center justify-between border-b border-zinc-700 pb-4 mb-6">
        <h1 className="flex items-center text-2xl font-bold">
          <WrenchScrewdriverIcon className="w-6 h-6 mr-2" /> Cobra Dev Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <section className="mb-8">
        <h2 className="flex items-center text-xl font-semibold mb-2">
          <UserIcon className="w-5 h-5 mr-2" /> Your Dev Wallet
        </h2>
        <div className="bg-zinc-800 p-4 rounded-lg text-sm">
          <p><strong>Telegram:</strong> @{user.username}</p>
          <p><strong>Telegram ID:</strong> {user.telegramId}</p>
          <p className="break-all"><strong>Public Key:</strong> {user.publicKey}</p>
        </div>
      </section>

      <section>
        <h2 className="flex items-center text-xl font-semibold mb-3">
          <RocketLaunchIcon className="w-5 h-5 mr-2" /> Launch & Boost Toolkit
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card icon={RocketLaunchIcon} title="Launch Token" desc="Create token + push to Pump.fun / Bonk" route="/launch" />
          <Card icon={ChartBarIcon} title="Volume Bot" desc="Simulate buy/sell activity" route="/bots/volume" />
          <Card icon={CurrencyDollarIcon} title="Smart Sell" desc="Auto-sell stealth at market cap target" route="/bots/sell" />
          <Card icon={MegaphoneIcon} title="Push Bot" desc="Simulate bullish charts + reactions" route="/bots/push" />
          <Card icon={GiftIcon} title="Airdrop Fake Holders" desc="Send token to 100+ fake wallets" route="/bots/airdrop" />
          <Card icon={ArrowsRightLeftIcon} title="Mixer Engine" desc="Split SOL to hide wallet cluster" route="/tools/mixer" />
        </div>
      </section>
    </div>
  );
}

function Card({ icon, title, desc, route }) {
  const navigate = useNavigate();
  const Icon = icon;

  return (
    <div
      onClick={() => navigate(route)}
      className="bg-zinc-800 hover:bg-zinc-700 cursor-pointer p-4 rounded-lg border border-zinc-700 transition"
    >
      <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
        <Icon className="w-5 h-5" /> {title}
      </h3>
      <p className="text-sm text-zinc-300">{desc}</p>
    </div>
  );
}
