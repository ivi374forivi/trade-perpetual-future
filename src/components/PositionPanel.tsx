import { useState, useEffect } from 'react';
import { User, PerpPosition, QUOTE_PRECISION, BASE_PRECISION, DriftClient, PositionDirection, convertToNumber } from '@drift-labs/sdk';

const PositionPanel = ({ user, driftClient, markets }: { user: User | null, driftClient: DriftClient | null, markets: any[] }) => {
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
    }
  }, [user]);

  const getMarketName = (marketIndex: number) => {
    const market = markets.find((m) => m.index === marketIndex);
    return market ? market.name : 'Unknown';
  };

  const handleClosePosition = async (position: PerpPosition) => {
    if (!driftClient) return;

    setClosingPosition(position.marketIndex);
    setStatus('Closing position...');
    try {
      const direction = position.baseAssetAmount.isNeg() ? PositionDirection.LONG : PositionDirection.SHORT;
      await driftClient.placePerpOrder({
        orderType: 0,
        marketIndex: position.marketIndex,
        direction,
        baseAssetAmount: position.baseAssetAmount.abs(),
        reduceOnly: true,
      });
      setStatus('✅ Position closed!');
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

  if (loading) {
    return <div>Loading positions...</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          Open Positions
        </h2>
        {status && (
          <div className={`alert ${status.includes('❌') ? 'alert-error' : 'alert-success'} mt-4`}>
            <span>{status}</span>
          </div>
        )}
        {positions.length === 0 ? (
          <p>No open positions.</p>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => {
                  const pnl = user.getUnrealizedPNL(true, position.marketIndex);
                  const currentPosition = user.getPerpPosition(position.marketIndex);
                  const entryPrice = currentPosition?.quoteAssetAmount.div(currentPosition.baseAssetAmount);

                  return (
                    <tr key={position.marketIndex}>
                      <td>{getMarketName(position.marketIndex)}</td>
                      <td>{position.baseAssetAmount.isNeg() ? 'Short' : 'Long'}</td>
                      <td>{convertToNumber(position.baseAssetAmount.abs(), BASE_PRECISION)}</td>
                      <td>${convertToNumber(entryPrice || 0, QUOTE_PRECISION)}</td>
                      <td className={pnl.isNeg() ? 'text-error' : 'text-success'}>
                        ${convertToNumber(pnl, QUOTE_PRECISION).toFixed(4)}
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
                            'Close'
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
