import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { DriftClient, User } from '@drift-labs/sdk';
import TradePanel from './components/TradePanel';
import RiskWarning from './components/RiskWarning';
import PositionPanel from './components/PositionPanel';
import DashboardPanel from './components/DashboardPanel';

function App() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [driftClient, setDriftClient] = useState<DriftClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState('');
  const [markets, setMarkets] = useState<any[]>([]);

  useEffect(() => {
    if (publicKey && connection && signTransaction && signAllTransactions && !driftClient) {
      initializeDrift();
    }
  }, [publicKey, connection, signTransaction, signAllTransactions]);

  const initializeDrift = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) return;

    setIsInitializing(true);
    setStatus('Initializing Drift Protocol...');

    try {
      const driftEnv = import.meta.env.VITE_DRIFT_ENV || 'devnet';
      const client = new DriftClient({
        connection,
        wallet: {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        env: driftEnv as 'devnet' | 'mainnet-beta',
      });

      await client.subscribe();
      setDriftClient(client);

      const perpMarkets = client.getPerpMarketAccounts();
      const spotMarkets = client.getSpotMarketAccounts();
      setMarkets([...perpMarkets, ...spotMarkets]);

      const userAccountPublicKey = await client.getUserAccountPublicKey();
      const userAccountExists = await connection.getAccountInfo(userAccountPublicKey);

      if (!userAccountExists) {
        setStatus('⚠️ Drift user account not found. Please create one at drift.trade first.');
        setIsInitializing(false);
        return;
      }

      const driftUser = new User({
        driftClient: client,
        userAccountPublicKey,
      });

      await driftUser.subscribe();
      setUser(driftUser);

      setStatus('✅ Connected to Drift Protocol!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error initializing Drift:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to initialize'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl font-bold">
            💥 Bang Perp Exchange
          </a>
        </div>
        <div className="flex-none">
          <WalletMultiButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl mb-8 p-8">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-4 animate-bang">
                💥 BANG! 💥
              </h1>
              <p className="text-xl mb-2">
                Trade Solana Perpetual Futures
              </p>
              <p className="text-sm opacity-80">
                Powered by Drift Protocol | Non-Custodial | You Control Your Funds
              </p>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <RiskWarning />

        {/* Dashboard Panel */}
        <DashboardPanel user={user} />

        {/* Trading Panel */}
        <TradePanel driftClient={driftClient} user={user} isInitializing={isInitializing} status={status} markets={markets} />

        {/* Position Panel */}
        <PositionPanel user={user} driftClient={driftClient} markets={markets} />

        {/* Footer */}
        <footer className="footer footer-center p-10 text-base-content mt-16">
          <div>
            <p className="font-bold">
              💥 Bang Perp Exchange
            </p>
            <p>Non-custodial perpetual futures trading on Solana</p>
            <p className="text-xs opacity-60">
              Powered by <a href="https://drift.trade" target="_blank" rel="noopener noreferrer" className="link">Drift Protocol</a>
            </p>
            <p className="text-xs opacity-60 mt-2">
              ⚠️ Trading involves risk. Only trade what you can afford to lose.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
