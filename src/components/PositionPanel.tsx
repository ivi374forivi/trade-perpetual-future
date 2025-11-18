import { useState, useEffect } from 'react';
import { User, PerpPosition, convertToNumber, QUOTE_PRECISION, BASE_PRECISION, DriftClient, PositionDirection } from '@drift-labs/sdk';
import { markets } from '../utils/markets';

interface PositionPanelProps {
  user: User | null;
  driftClient: DriftClient | null;
}

const PositionPanel = ({ user, driftClient }: PositionPanelProps) => {
  const [positions, setPositions] = useState<PerpPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingPosition, setClosingPosition] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      const fetchPositions = () => {
        setLoading(true);
        const perpPositions = user.getActivePerpPositions();
        setPositions(perpPositions);
        setLoading(false);
      };
      fetchPositions();

      // Refresh positions every 5 seconds
      const interval = setInterval(fetchPositions, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const getMarketName = (marketIndex: number) => {
    const market = markets.find((m) => m.marketIndex === marketIndex);
    return market ? market.name : `Market ${marketIndex}`;
  };

  const handleClosePosition = async (position: PerpPosition) => {
    if (!driftClient) return;

    setClosingPosition(position.marketIndex);
    setStatus('Closing position...');
    try {
      // To close, we need to take the opposite direction
      const direction = position.baseAssetAmount.isNeg()
        ? PositionDirection.LONG
        : PositionDirection.SHORT;

      await driftClient.placePerpOrder({
        orderType: 0, // Market order
        marketIndex: position.marketIndex,
        direction,
        baseAssetAmount: position.baseAssetAmount.abs(),
        reduceOnly: true,
      });

      setStatus('✅ Position closed successfully!');

      // Refresh positions after a short delay
      setTimeout(() => {
        if (user) {
          const perpPositions = user.getActivePerpPositions();
          setPositions(perpPositions);
        }
      }, 2000);
    } catch (error) {
      console.error('Error closing position:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to close position'}`);
    } finally {
      setClosingPosition(null);
      setTimeout(() => setStatus(''), 5000);
    }
  };

  if (!user) {
    return null;
  }

  if (loading && positions.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">📊 Open Positions</h2>
          <div className="flex justify-center items-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-4">Loading positions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          📊 Open Positions
          {positions.length > 0 && (
            <span className="badge badge-primary">{positions.length}</span>
          )}
        </h2>

        {status && (
          <div className={`alert ${status.includes('❌') ? 'alert-error' : 'alert-success'} mb-4`}>
            <span>{status}</span>
          </div>
        )}

        {positions.length === 0 ? (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No open positions. Start trading to see your positions here.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Market</th>
                  <th>Side</th>
                  <th>Size</th>
                  <th>Entry Price</th>
                  <th>PNL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const pnl = user.getUnrealizedPNL(true, position.marketIndex);
                  const perpPosition = user.getPerpPosition(position.marketIndex);
                  const entryPrice = perpPosition?.quoteAssetAmount.div(perpPosition.baseAssetAmount);
                  const isLong = !position.baseAssetAmount.isNeg();

                  return (
                    <tr key={position.marketIndex} className="hover">
                      <td className="font-bold">{getMarketName(position.marketIndex)}</td>
                      <td>
                        <span className={`badge ${isLong ? 'badge-success' : 'badge-error'}`}>
                          {isLong ? '📈 LONG' : '📉 SHORT'}
                        </span>
                      </td>
                      <td>{convertToNumber(position.baseAssetAmount.abs(), BASE_PRECISION).toFixed(4)}</td>
                      <td>${entryPrice ? convertToNumber(entryPrice, QUOTE_PRECISION).toFixed(2) : 'N/A'}</td>
                      <td className={pnl.isNeg() ? 'text-error font-bold' : 'text-success font-bold'}>
                        {pnl.isNeg() ? '-' : '+'}${convertToNumber(pnl.abs(), QUOTE_PRECISION).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleClosePosition(position)}
                          disabled={closingPosition === position.marketIndex}
                        >
                          {closingPosition === position.marketIndex ? (
                            <span className="loading loading-spinner"></span>
                          ) : (
                            'Close Position'
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionPanel;
