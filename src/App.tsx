import { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import TradePanel from './components/TradePanel'
import RiskWarning from './components/RiskWarning'

function App() {
  const [termsAccepted, setTermsAccepted] = useState(false)

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
        <RiskWarning onAccept={setTermsAccepted} />

        {/* Trading Panel */}
        <TradePanel termsAccepted={termsAccepted} />

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
