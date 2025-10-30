import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState } from 'react'
import { DriftClient, initialize, PositionDirection, MarketType, getMarketOrderParams, getOrderParams } from '@drift-labs/sdk-browser'
import { BN } from '@coral-xyz/anchor'

// Drift Builder Code for fee collection (example - replace with your actual builder code)
const DRIFT_BUILDER_CODE = 'BANGPERP'

export default function TradingPanel() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const [amount, setAmount] = useState('0.1')
  const [leverage, setLeverage] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleTrade = async (direction: 'long' | 'short') => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      setMessage('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Initialize Drift SDK
      await initialize({ env: 'devnet' })
      
      const driftClient = new DriftClient({
        connection,
        wallet: {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        env: 'devnet',
        // Add builder code for fee collection
        // @ts-expect-error - builderCode property may not exist in DriftClient constructor options types
        builderCode: DRIFT_BUILDER_CODE,
      })

      await driftClient.subscribe()

      // Get SOL-PERP market (market index 0 is typically SOL-PERP on Drift)
      const marketIndex = 0
      const baseAssetAmount = parseFloat(amount) * 1_000_000_000 // Convert to lamports (SOL has 9 decimals)
      const leverageAmount = parseFloat(leverage)

      // Place a market order using the helper function
      const optionalOrderParams = getMarketOrderParams({
        marketIndex,
        direction: direction === 'long' ? PositionDirection.LONG : PositionDirection.SHORT,
        baseAssetAmount: new BN(Math.floor(baseAssetAmount * leverageAmount)),
        marketType: MarketType.PERP,
      })

      const orderParams = getOrderParams(optionalOrderParams)

      const tx = await driftClient.placeOrders([orderParams])
      
      setMessage(`✅ ${direction.toUpperCase()} order placed! TX: ${tx}`)
      
      await driftClient.unsubscribe()
    } catch (error) {
      console.error('Trading error:', error)
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-2 text-gold animate-pulse">
            💥 BANG PERP 💥
          </h1>
          <p className="text-gold-light text-xl">
            Solana Perpetual Trading - To The Moon! 🚀
          </p>
        </div>

        {/* Wallet Connect */}
        <div className="flex justify-center mb-8">
          <WalletMultiButton className="!bg-gold !text-black hover:!bg-gold-light !font-bold !rounded-lg !px-6 !py-3" />
        </div>

        {/* Trading Panel */}
        {publicKey ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-gold rounded-2xl p-8 shadow-2xl shadow-gold/20">
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-gold font-bold mb-2 text-lg">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.1"
                  min="0.1"
                  className="w-full bg-black border-2 border-gold text-white text-xl p-4 rounded-lg focus:outline-none focus:border-gold-light"
                  placeholder="0.1"
                />
              </div>

              {/* Leverage Input */}
              <div>
                <label className="block text-gold font-bold mb-2 text-lg">
                  Leverage (x)
                </label>
                <input
                  type="number"
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  step="1"
                  min="1"
                  max="10"
                  className="w-full bg-black border-2 border-gold text-white text-xl p-4 rounded-lg focus:outline-none focus:border-gold-light"
                  placeholder="1"
                />
              </div>

              {/* Trading Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleTrade('long')}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-6 px-8 rounded-lg text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? '⏳' : '📈'} LONG
                </button>
                <button
                  onClick={() => handleTrade('short')}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-6 px-8 rounded-lg text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? '⏳' : '📉'} SHORT
                </button>
              </div>

              {/* Status Message */}
              {message && (
                <div className="mt-4 p-4 bg-gray-800 border-2 border-gold rounded-lg">
                  <p className="text-white text-center break-all">{message}</p>
                </div>
              )}

              {/* Info */}
              <div className="mt-6 p-4 bg-gray-900 border border-gold-dark rounded-lg">
                <p className="text-gold-light text-sm text-center">
                  ⚡ Non-custodial trading via Drift Protocol on Solana Devnet ⚡
                </p>
                <p className="text-gold-dark text-xs text-center mt-2">
                  You sign your own transactions. Your keys, your crypto! 🔑
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-gold rounded-2xl p-12 text-center">
            <p className="text-gold text-2xl font-bold mb-4">
              👆 Connect Your Wallet to Start Trading! 👆
            </p>
            <p className="text-gold-light">
              Phantom or Solflare supported 🎯
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
