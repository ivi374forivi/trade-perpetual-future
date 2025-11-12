import { User, convertToNumber, QUOTE_PRECISION } from '@drift-labs/sdk';

const DashboardPanel = ({ user }: { user: User | null }) => {
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
        <div className="stat-value">${convertToNumber(totalCollateral, QUOTE_PRECISION).toFixed(2)}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Net USD Value</div>
        <div className="stat-value">${convertToNumber(netUsdValue, QUOTE_PRECISION).toFixed(2)}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Unrealized PNL</div>
        <div className={`stat-value ${unrealizedPnl.isNeg() ? 'text-error' : 'text-success'}`}>
          ${convertToNumber(unrealizedPnl, QUOTE_PRECISION).toFixed(4)}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Leverage</div>
        <div className="stat-value">{convertToNumber(leverage, QUOTE_PRECISION).toFixed(2)}x</div>
      </div>
    </div>
  );
};

export default DashboardPanel;
