import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DriftClient, MarketType, PositionDirection, User, BN } from '@drift-labs/sdk';
import { markets } from '../utils/markets';

interface TradePanelProps {
  driftClient: DriftClient | null;
  user: User | null;
  isInitializing: boolean;
  status: string;
}

function TradePanel({ driftClient, user, isInitializing, status: appStatus }: TradePanelProps) {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('5');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(0);

  const openPosition = async (direction: PositionDirection) => {
    if (!driftClient || !user || !amount) {
      setStatus('Please connect wallet and enter amount');
      return;
    }

    setLoading(true);
    const directionText = direction === PositionDirection.LONG ? 'LONG' : 'SHORT';
    setStatus(`Opening ${directionText} position...`);

    try {
      const baseAmount = new BN(parseFloat(amount) * 1_000_000);
      const leverageMultiplier = parseFloat(leverage);
      const positionSize = new BN(baseAmount.toNumber() * leverageMultiplier);
      const marketIndex = markets[selectedMarket].index;

      const txSig = await driftClient.placeAndTakePerpOrder({
        orderType: 0,
        marketIndex,
        direction,
        baseAssetAmount: positionSize,
        marketType: MarketType.PERP,
      });

      setStatus(`✅ ${directionText} position opened! TX: ${txSig.slice(0, 8)}...`);
      setAmount('');
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      console.error('Error opening position:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to open position'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          🎯 Trade Perpetual Futures
        </h2>

        {!publicKey ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Please connect your wallet to start trading</span>
          </div>
        ) : isInitializing ? (
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-4">Initializing Drift Protocol...</span>
          </div>
        ) : (
          <>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Select Market</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(parseInt(e.target.value))}
              >
                {markets.map((market, idx) => (
                  <option key={idx} value={idx}>
                    {market.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Amount (USDC)</span>
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Leverage: {leverage}x</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="range range-primary"
                step="1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>1x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                className="btn btn-success btn-lg"
                onClick={() => openPosition(PositionDirection.LONG)}
                disabled={loading || !driftClient || !amount}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>📈 LONG</>
                )}
              </button>
              <button
                className="btn btn-error btn-lg"
                onClick={() => openPosition(PositionDirection.SHORT)}
                disabled={loading || !driftClient || !amount}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>📉 SHORT</>
                )}
              </button>
            </div>

            {(status || appStatus) && (
              <div className={`alert ${status.includes('❌') || appStatus.includes('❌') ? 'alert-error' : status.includes('✅') || appStatus.includes('✅') ? 'alert-success' : 'alert-info'} mt-4`}>
                <span>{status || appStatus}</span>
              </div>
            )}

            {amount && leverage && (
              <div className="stats shadow mt-4">
                <div className="stat">
                  <div className="stat-title">Position Size</div>
                  <div className="stat-value text-sm">
                    ${(parseFloat(amount) * parseFloat(leverage)).toFixed(2)}
                  </div>
                  <div className="stat-desc">
                    ${amount} × {leverage}x leverage
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TradePanel;
