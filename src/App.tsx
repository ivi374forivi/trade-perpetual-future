import { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { DriftClient, User } from '@drift-labs/sdk'
import TradePanel from './components/TradePanel'
import RiskWarning from './components/RiskWarning'
import DashboardPanel from './components/DashboardPanel'
import PositionPanel from './components/PositionPanel'
import OrderHistory from './components/OrderHistory'
import PnLAnalytics from './components/PnLAnalytics'

function App() {
  const [driftClient, setDriftClient] = useState<DriftClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'trade' | 'positions' | 'orders' | 'analytics'>('trade')

  const handleDriftClientChange = (client: DriftClient | null, userAccount: User | null) => {
    setDriftClient(client)
    setUser(userAccount)
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
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
              <h1 className="text-5xl font-bold mb-4">
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

        {/* Dashboard Panel - Shows account stats */}
        <DashboardPanel user={user} />

        {/* Tab Navigation */}
        {user && (
          <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-4">
            <a
              className={`tab tab-lg ${activeTab === 'trade' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('trade')}
            >
              🎯 Trade
            </a>
            <a
              className={`tab tab-lg ${activeTab === 'positions' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('positions')}
            >
              📊 Positions
            </a>
            <a
              className={`tab tab-lg ${activeTab === 'orders' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 Orders
            </a>
            <a
              className={`tab tab-lg ${activeTab === 'analytics' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </a>
          </div>
        )}

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === 'trade' && (
          <TradePanel onDriftClientChange={handleDriftClientChange} />
        )}

        {activeTab === 'positions' && (
          <PositionPanel user={user} driftClient={driftClient} />
        )}

        {activeTab === 'orders' && (
          <OrderHistory user={user} />
        )}

        {activeTab === 'analytics' && (
          <PnLAnalytics user={user} />
        )}

        {/* Show TradePanel by default if no user connected */}
        {!user && (
          <TradePanel onDriftClientChange={handleDriftClientChange} />
        )}

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
  )
}

export default App
