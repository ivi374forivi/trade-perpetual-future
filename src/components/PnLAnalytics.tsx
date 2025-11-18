import { useState, useEffect } from 'react';
import { User, convertToNumber, QUOTE_PRECISION } from '@drift-labs/sdk';

interface PnLAnalyticsProps {
  user: User | null;
}

interface PnLData {
  totalPnL: number;
  realizedPnL: number;
  unrealizedPnL: number;
  todayPnL: number;
  winRate: number;
  totalTrades: number;
}

const PnLAnalytics = ({ user }: PnLAnalyticsProps) => {
  const [pnlData, setPnlData] = useState<PnLData>({
    totalPnL: 0,
    realizedPnL: 0,
    unrealizedPnL: 0,
    todayPnL: 0,
    winRate: 0,
    totalTrades: 0,
  });
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | 'ALL'>('1D');

  useEffect(() => {
    if (user) {
      const updatePnL = () => {
        try {
          const unrealizedPnL = user.getUnrealizedPNL();
          const totalCollateral = user.getTotalCollateral();
          const netUsdValue = user.getNetUsdValue();

          // Calculate realized PnL (simplified - actual would need historical data)
          const realizedPnL = netUsdValue.sub(totalCollateral);

          setPnlData({
            totalPnL: convertToNumber(realizedPnL.add(unrealizedPnL), QUOTE_PRECISION),
            realizedPnL: convertToNumber(realizedPnL, QUOTE_PRECISION),
            unrealizedPnL: convertToNumber(unrealizedPnL, QUOTE_PRECISION),
            todayPnL: convertToNumber(unrealizedPnL, QUOTE_PRECISION), // Simplified
            winRate: 0, // Would need historical trade data
            totalTrades: user.getActivePerpPositions().length,
          });
        } catch (error) {
          console.error('Error calculating PnL:', error);
        }
      };

      updatePnL();
      const interval = setInterval(updatePnL, 5000);
      return () => clearInterval(interval);
    }
  }, [user, timeframe]);

  if (!user) {
    return null;
  }

  const isProfitable = pnlData.totalPnL >= 0;
  const pnlPercentage = pnlData.realizedPnL !== 0
    ? ((pnlData.totalPnL / Math.abs(pnlData.realizedPnL)) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-2xl">📊 P&L Analytics</h2>

          {/* Timeframe Selector */}
          <div className="join">
            <button
              className={`btn btn-sm join-item ${timeframe === '1D' ? 'btn-active' : ''}`}
              onClick={() => setTimeframe('1D')}
            >
              1D
            </button>
            <button
              className={`btn btn-sm join-item ${timeframe === '1W' ? 'btn-active' : ''}`}
              onClick={() => setTimeframe('1W')}
            >
              1W
            </button>
            <button
              className={`btn btn-sm join-item ${timeframe === '1M' ? 'btn-active' : ''}`}
              onClick={() => setTimeframe('1M')}
            >
              1M
            </button>
            <button
              className={`btn btn-sm join-item ${timeframe === 'ALL' ? 'btn-active' : ''}`}
              onClick={() => setTimeframe('ALL')}
            >
              ALL
            </button>
          </div>
        </div>

        {/* Main PnL Display */}
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Total P&L</div>
            <div className={`stat-value text-2xl ${isProfitable ? 'text-success' : 'text-error'}`}>
              {isProfitable ? '+' : ''}${pnlData.totalPnL.toFixed(2)}
            </div>
            <div className="stat-desc">
              {isProfitable ? '📈' : '📉'} {pnlPercentage}% {isProfitable ? 'profit' : 'loss'}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Realized P&L</div>
            <div className={`stat-value text-2xl ${pnlData.realizedPnL >= 0 ? 'text-success' : 'text-error'}`}>
              {pnlData.realizedPnL >= 0 ? '+' : ''}${pnlData.realizedPnL.toFixed(2)}
            </div>
            <div className="stat-desc">Closed positions</div>
          </div>

          <div className="stat">
            <div className="stat-title">Unrealized P&L</div>
            <div className={`stat-value text-2xl ${pnlData.unrealizedPnL >= 0 ? 'text-success' : 'text-error'}`}>
              {pnlData.unrealizedPnL >= 0 ? '+' : ''}${pnlData.unrealizedPnL.toFixed(2)}
            </div>
            <div className="stat-desc">Open positions</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Today's P&L</div>
            <div className={`stat-value text-xl ${pnlData.todayPnL >= 0 ? 'text-success' : 'text-error'}`}>
              {pnlData.todayPnL >= 0 ? '+' : ''}${pnlData.todayPnL.toFixed(2)}
            </div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Total Trades</div>
            <div className="stat-value text-xl">{pnlData.totalTrades}</div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-title">Win Rate</div>
            <div className="stat-value text-xl">
              {pnlData.winRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-4 p-4 bg-base-200 rounded-lg">
          <h3 className="font-bold mb-2">Performance Chart</h3>
          <div className="flex items-center justify-center h-32 text-base-content/50">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="text-sm">
                Historical P&L chart will be displayed here
              </p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="alert alert-info mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-sm">
            P&L calculations are based on current on-chain data. Historical data tracking will be added in a future update.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PnLAnalytics;
