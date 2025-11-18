import { User, convertToNumber, QUOTE_PRECISION } from '@drift-labs/sdk';

interface DashboardPanelProps {
  user: User | null;
}

const DashboardPanel = ({ user }: DashboardPanelProps) => {
  if (!user) {
    return null;
  }

  const totalCollateral = user.getTotalCollateral();
  const netUsdValue = user.getNetUsdValue();
  const unrealizedPnl = user.getUnrealizedPNL();
  const leverage = user.getLeverage();

  return (
    <div className="stats shadow w-full mb-4">
      <div className="stat">
        <div className="stat-title">Total Collateral</div>
        <div className="stat-value text-primary">
          ${convertToNumber(totalCollateral, QUOTE_PRECISION).toFixed(2)}
        </div>
        <div className="stat-desc">Available funds</div>
      </div>

      <div className="stat">
        <div className="stat-title">Net USD Value</div>
        <div className="stat-value text-secondary">
          ${convertToNumber(netUsdValue, QUOTE_PRECISION).toFixed(2)}
        </div>
        <div className="stat-desc">Account value</div>
      </div>

      <div className="stat">
        <div className="stat-title">Unrealized PNL</div>
        <div className={`stat-value ${unrealizedPnl.isNeg() ? 'text-error' : 'text-success'}`}>
          ${convertToNumber(unrealizedPnl, QUOTE_PRECISION).toFixed(2)}
        </div>
        <div className="stat-desc">
          {unrealizedPnl.isNeg() ? '📉 Loss' : '📈 Profit'}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Current Leverage</div>
        <div className="stat-value">{convertToNumber(leverage, QUOTE_PRECISION).toFixed(2)}x</div>
        <div className="stat-desc">Active leverage</div>
      </div>
    </div>
  );
};

export default DashboardPanel;
