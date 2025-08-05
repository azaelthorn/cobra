// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LaunchToken from './pages/LaunchToken';
import VolumeBot from './pages/bots/VolumeBot';
import AirdropFakeHolders from './pages/bots/AirdropFakeHolders';
import StealthSell from './pages/bots/StealthSell';
import PushBot from './pages/bots/PushBot';
import Mixer from './pages/bots/Mixer';
import BotMonitor from './pages/bots/BotMonitor';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/launch" element={<LaunchToken />} />
            <Route path="/bots/volume" element={<VolumeBot />} />
            <Route path="/bots/airdrop" element={<AirdropFakeHolders />} />
            <Route path="/bots/sell" element={<StealthSell />} />
            <Route path="/bots/push" element={<PushBot />} />
            <Route path="/bots/mixer" element={<Mixer />} />
            <Route path="/bots/status" element={<BotMonitor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
