// client/src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navItem = (to, label) => (
    <Link
      to={to}
      className={`block px-4 py-2 rounded hover:bg-gray-700 transition ${
        location.pathname === to ? 'bg-gray-700 text-white' : 'text-gray-300'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">🐍 Cobra DevTools</h2>
      <nav className="space-y-2">
        {navItem('/dashboard', 'Dashboard')}
        {navItem('/launch', 'Launch Token')}
        {navItem('/bots/volume', 'Volume Bot')}
        {navItem('/bots/airdrop', 'Fake Airdrop')}
        {navItem('/bots/sell', 'Stealth Sell')}
        {navItem('/bots/push', 'Push Bot')}
        {navItem('/bots/mixer', 'Mixer Engine')}
        {navItem('/bots/status', 'Monitor Bots')}
      </nav>
    </div>
  );
};

export default Sidebar;
