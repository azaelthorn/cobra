// client/src/pages/TokenDeployer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import useUserStore from '../../state/useUserStore';
import { LoaderCircle } from 'lucide-react';

const launchpads = [
  { id: 'pumpfun', name: 'Pump.fun' },
  { id: 'letsbonk', name: 'LetsBonk.fun' },
  { id: 'meteora', name: 'Meteora' },
  { id: 'launchlab', name: 'LaunchLab' }
];

const TokenDeployer = () => {
  const { telegramId, publicKey } = useUserStore();
  const [step, setStep] = useState(1);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState(6);
  const [supply, setSupply] = useState(1_000_000);
  const [selectedLaunchpad, setSelectedLaunchpad] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/launch', {
        telegramId,
        name: tokenName,
        symbol: tokenSymbol,
        decimals,
        supply,
        launchpad: selectedLaunchpad
      });
      setResult(res.data);
    } catch (err) {
      setResult({ success: false, error: err.response?.data?.error || err.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🚀 Token Launch Wizard</h1>

      {step === 1 && (
        <div className="grid gap-4 max-w-md">
          <input
            className="input"
            placeholder="Token Name (e.g. JeetX)"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Token Symbol (e.g. JTX)"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
          />
          <input
            className="input"
            placeholder="Total Supply"
            type="number"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value))}
          />
          <input
            className="input"
            placeholder="Decimals"
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
          />
          <button className="btn-primary" onClick={next} disabled={!tokenName || !tokenSymbol}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4 max-w-md">
          <p className="text-sm text-gray-400">Select Launchpad:</p>
          {launchpads.map((lp) => (
            <button
              key={lp.id}
              className={`btn ${selectedLaunchpad === lp.id ? 'bg-green-700' : 'bg-gray-800'}`}
              onClick={() => setSelectedLaunchpad(lp.id)}
            >
              {lp.name}
            </button>
          ))}

          <div className="flex gap-4 mt-4">
            <button className="btn-secondary" onClick={prev}>
              Back
            </button>
            <button
              className="btn-primary"
              onClick={handleLaunch}
              disabled={!selectedLaunchpad || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin" size={18} /> Deploying...
                </span>
              ) : (
                'Launch Now'
              )}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-gray-900 p-4 rounded shadow text-sm">
          {result.success ? (
            <div className="text-green-400">
              ✅ Token launched on {selectedLaunchpad}!
              <br />
              <a
                className="underline"
                href={result.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Token →
              </a>
            </div>
          ) : (
            <div className="text-red-400">❌ Failed: {result.error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenDeployer;
