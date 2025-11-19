import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { DriftClient, MarketType, PositionDirection, User, BN } from '@drift-labs/sdk'

interface TradePanelProps {
  termsAccepted: boolean
}

function TradePanel({ termsAccepted }: TradePanelProps) {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()

  const [driftClient, setDriftClient] = useState<DriftClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState('')
  const [leverage, setLeverage] = useState('5')
  const [slippageTolerance, setSlippageTolerance] = useState(0.5) // 0.5% default
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [selectedMarket, setSelectedMarket] = useState(0) // 0 = SOL-PERP, 1 = BTC-PERP, etc.

  // Market information
  const markets = [
    { name: 'SOL-PERP', index: 0, symbol: 'SOL' },
    { name: 'BTC-PERP', index: 1, symbol: 'BTC' },
    { name: 'ETH-PERP', index: 2, symbol: 'ETH' },
  ]

  // Validation constants
  const MAX_POSITION_SIZE_USDC = 100_000 // $100k max per trade
  const MIN_POSITION_SIZE_USDC = 1 // $1 minimum

  // Input validation helper
  const validateAmount = (value: string): { valid: boolean; error?: string } => {
    if (!value || value.trim() === '') {
      return { valid: false, error: 'Amount required' }
    }

    if (value.includes('e') || value.includes('E')) {
      return { valid: false, error: 'Scientific notation not allowed' }
    }

    const num = parseFloat(value)

    if (isNaN(num)) {
      return { valid: false, error: 'Invalid number' }
    }

    if (num < 0) {
      return { valid: false, error: 'Amount must be positive' }
    }

    if (num < MIN_POSITION_SIZE_USDC) {
      return { valid: false, error: `Minimum ${MIN_POSITION_SIZE_USDC} USDC` }
    }

    if (num > MAX_POSITION_SIZE_USDC) {
      return { valid: false, error: `Maximum ${MAX_POSITION_SIZE_USDC} USDC` }
    }

    const decimalPlaces = (value.split('.')[1] || '').length
    if (decimalPlaces > 2) {
      return { valid: false, error: 'Maximum 2 decimal places' }
    }

    return { valid: true }
  }

  // User-friendly error messages
  const getUserFriendlyError = (error: any): string => {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('insufficient funds') || message.includes('insufficient lamports')) {
      return 'Insufficient balance. Please add more USDC or SOL.'
    }
    if (message.includes('slippage')) {
      return 'Price moved too much. Try increasing slippage tolerance.'
    }
    if (message.includes('User rejected') || message.includes('rejected')) {
      return 'Transaction cancelled by user.'
    }
    if (message.includes('simulation failed')) {
      return 'Transaction validation failed. Check your inputs and balance.'
    }
    if (message.includes('timeout')) {
      return 'Transaction timeout. Please try again.'
    }

    return `Error: ${message}`
  }

  // Initialize Drift Client when wallet connects
  // Note: driftClient is intentionally excluded from deps to prevent re-initialization loop
  // This effect should only run when wallet connection changes
  useEffect(() => {
    if (publicKey && connection && signTransaction && signAllTransactions && !driftClient) {
      initializeDrift()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection, signTransaction, signAllTransactions])

  // Cleanup subscriptions on unmount or when drift client/user changes
  useEffect(() => {
    return () => {
      if (driftClient) {
        driftClient.unsubscribe().catch((err) => {
          console.error('Error unsubscribing driftClient:', err)
        })
      }
      if (user) {
        user.unsubscribe().catch((err) => {
          console.error('Error unsubscribing user:', err)
        })
      }
    }
  }, [driftClient, user])

  // Cleanup when wallet disconnects
  useEffect(() => {
    if (!publicKey && driftClient) {
      driftClient.unsubscribe().catch(console.error)
      setDriftClient(null)

      if (user) {
        user.unsubscribe().catch(console.error)
        setUser(null)
      }

      setStatus('Wallet disconnected')
    }
  }, [publicKey, driftClient, user])

  const initializeDrift = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) return
    
    setIsInitializing(true)
    setStatus('Initializing Drift Protocol...')
    
    try {
      // Get environment from .env
      const driftEnv = import.meta.env.VITE_DRIFT_ENV || 'devnet'
      
      // Initialize Drift Client
      const client = new DriftClient({
        connection,
        wallet: {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        env: driftEnv as 'devnet' | 'mainnet-beta',
      })

      await client.subscribe()
      setDriftClient(client)
      
      // Initialize or get user account
      const userAccountPublicKey = await client.getUserAccountPublicKey()
      const userAccountExists = await connection.getAccountInfo(userAccountPublicKey)
      
      if (!userAccountExists) {
        setStatus('⚠️ Drift user account not found. Please create one at drift.trade first.')
        setIsInitializing(false)
        return
      }
      
      const driftUser = new User({
        driftClient: client,
        userAccountPublicKey,
      })
      
      await driftUser.subscribe()
      setUser(driftUser)
      
      setStatus('✅ Connected to Drift Protocol!')
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      console.error('Error initializing Drift:', error)
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to initialize'}`)
    } finally {
      setIsInitializing(false)
    }
  }

  const openPosition = async (direction: PositionDirection) => {
    if (!driftClient || !user || !amount || !termsAccepted) {
      setStatus('Please connect wallet, enter amount, and accept terms')
      return
    }

    // Validate amount
    const validation = validateAmount(amount)
    if (!validation.valid) {
      setStatus(`❌ ${validation.error}`)
      return
    }

    setLoading(true)
    const directionText = direction === PositionDirection.LONG ? 'LONG' : 'SHORT'

    try {
      // Calculate position size using BN math to avoid overflow
      const baseAmount = new BN(Math.floor(parseFloat(amount) * 1_000_000))
      const leverageMultiplier = new BN(Math.floor(parseFloat(leverage)))
      const positionSize = baseAmount.mul(leverageMultiplier) // Use BN.mul instead of JS number math

      const marketIndex = markets[selectedMarket].index

      // Transaction parameters with slippage protection
      const orderParams = {
        orderType: 0, // Market order
        marketIndex,
        direction,
        baseAssetAmount: positionSize,
        marketType: MarketType.PERP,
        maxSlippageBps: new BN(Math.floor(slippageTolerance * 100)), // Convert to basis points
      }

      // Simulate transaction before signing
      setStatus('🔍 Validating transaction...')

      // Note: Drift SDK's placeAndTakePerpOrder internally handles simulation
      // For more explicit control, we could build and simulate the transaction separately
      // For now, we rely on the SDK's built-in checks

      setStatus(`Opening ${directionText} position...`)

      // Execute the trade
      const txSig = await driftClient.placeAndTakePerpOrder(orderParams)

      // Wait for confirmation
      setStatus('⏳ Transaction submitted, waiting for confirmation...')

      const confirmation = await connection.confirmTransaction(txSig, 'confirmed')

      // Check if transaction actually succeeded
      if (confirmation.value.err) {
        throw new Error('Transaction failed on-chain')
      }

      setStatus(`✅ ${directionText} position opened! TX: ${txSig.slice(0, 8)}...`)

      // Clear form
      setAmount('')
      setAmountError('')

      // Clear success message after delay
      setTimeout(() => setStatus(''), 5000)
    } catch (error) {
      console.error('Error opening position:', error)
      const userMessage = getUserFriendlyError(error)
      setStatus(`❌ ${userMessage}`)
    } finally {
      setLoading(false)
    }
  }

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
            {/* Market Selection */}
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

            {/* Amount Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Amount (USDC)</span>
                <span className="label-text-alt">
                  Min: ${MIN_POSITION_SIZE_USDC} | Max: ${MAX_POSITION_SIZE_USDC.toLocaleString()}
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter amount"
                className={`input input-bordered w-full ${amountError ? 'input-error' : ''}`}
                value={amount}
                onChange={(e) => {
                  const value = e.target.value
                  setAmount(value)
                  const validation = validateAmount(value)
                  setAmountError(validation.error || '')
                }}
              />
              {amountError && (
                <label className="label">
                  <span className="label-text-alt text-error">{amountError}</span>
                </label>
              )}
            </div>

            {/* Leverage Slider */}
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

            {/* Slippage Tolerance */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Max Slippage: {slippageTolerance}%</span>
                <span className="label-text-alt">
                  {slippageTolerance > 2 && '⚠️ High slippage'}
                </span>
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                value={slippageTolerance}
                onChange={(e) => setSlippageTolerance(parseFloat(e.target.value))}
                className="range range-secondary"
                step="0.1"
              />
              <div className="w-full flex justify-between text-xs px-2 mt-1">
                <span>0.1%</span>
                <span>2.5%</span>
                <span>5%</span>
              </div>
            </div>

            {/* Trade Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                className="btn btn-success btn-lg"
                onClick={() => openPosition(PositionDirection.LONG)}
                disabled={loading || !driftClient || !amount || !termsAccepted || amountError !== ''}
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
                disabled={loading || !driftClient || !amount || !termsAccepted || amountError !== ''}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>📉 SHORT</>
                )}
              </button>
            </div>

            {/* Terms Warning if not accepted */}
            {!termsAccepted && publicKey && (
              <div className="alert alert-warning mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>You must read and accept the terms above before trading</span>
              </div>
            )}

            {/* Status Message */}
            {status && (
              <div className={`alert ${status.includes('❌') ? 'alert-error' : status.includes('✅') ? 'alert-success' : 'alert-info'} mt-4`}>
                <span>{status}</span>
              </div>
            )}

            {/* Position Info */}
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
  )
}

export default TradePanel
