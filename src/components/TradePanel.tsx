import { useState, useEffect } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  DriftClient,
  MarketType,
  PositionDirection,
  User,
  BN,
  convertToNumber,
  QUOTE_PRECISION,
  OrderTriggerCondition,
  OrderType,
  calculateBidAskPrice
} from '@drift-labs/sdk'
import { markets } from '../utils/markets'

interface TradePanelProps {
  onDriftClientChange?: (client: DriftClient | null, user: User | null) => void
}

function TradePanel({ onDriftClientChange }: TradePanelProps) {
  const { connection } = useConnection()
  const { publicKey, signTransaction, signAllTransactions } = useWallet()

  const [driftClient, setDriftClient] = useState<DriftClient | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [amount, setAmount] = useState('')
  const [leverage, setLeverage] = useState('5')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [selectedMarket, setSelectedMarket] = useState(0)
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market')
  const [limitPrice, setLimitPrice] = useState('')
  const [triggerPrice, setTriggerPrice] = useState('')

  // Real-time price data
  const [oraclePrice, setOraclePrice] = useState<string | null>(null)
  const [bidPrice, setBidPrice] = useState<string | null>(null)
  const [askPrice, setAskPrice] = useState<string | null>(null)

  // Initialize Drift Client when wallet connects
  useEffect(() => {
    if (publicKey && connection && signTransaction && signAllTransactions && !driftClient) {
      initializeDrift()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection, signTransaction, signAllTransactions])

  // Update real-time prices
  useEffect(() => {
    if (driftClient && markets.length > 0) {
      const updatePrices = () => {
        try {
          const market = markets[selectedMarket]
          const marketAccount = driftClient.getPerpMarketAccount(market.marketIndex)
          if (!marketAccount) return

          const oracleData = driftClient.getOracleDataForPerpMarket(market.marketIndex)

          // Create MMOraclePriceData format for calculateBidAskPrice
          const mmOracleData = {
            price: oracleData.price,
            slot: oracleData.slot,
            confidence: oracleData.confidence,
            hasSufficientNumberOfDataPoints: oracleData.hasSufficientNumberOfDataPoints,
            twap: oracleData.twap,
            twapConfidence: oracleData.twapConfidence,
            isMMOracleActive: false // Default to false for standard oracle
          }

          const [bid, ask] = calculateBidAskPrice(marketAccount.amm, mmOracleData)

          setOraclePrice(convertToNumber(oracleData.price, QUOTE_PRECISION).toFixed(2))
          setBidPrice(convertToNumber(bid, QUOTE_PRECISION).toFixed(2))
          setAskPrice(convertToNumber(ask, QUOTE_PRECISION).toFixed(2))
        } catch (error) {
          console.error('Error updating prices:', error)
        }
      }

      updatePrices()
      const interval = setInterval(updatePrices, 2000) // Update every 2 seconds
      return () => clearInterval(interval)
    }
  }, [selectedMarket, driftClient])

  // Notify parent component when drift client changes
  useEffect(() => {
    if (onDriftClientChange) {
      onDriftClientChange(driftClient, user)
    }
  }, [driftClient, user, onDriftClientChange])

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
    if (!driftClient || !user || !amount) {
      setStatus('Please connect wallet and enter amount')
      return
    }

    setLoading(true)
    const directionText = direction === PositionDirection.LONG ? 'LONG' : 'SHORT'
    setStatus(`Opening ${directionText} ${orderType} order...`)

    try {
      const baseAmount = new BN(parseFloat(amount) * 1_000_000)
      const leverageMultiplier = parseFloat(leverage)
      const positionSize = new BN(baseAmount.toNumber() * leverageMultiplier)
      const marketIndex = markets[selectedMarket].marketIndex

      let txSig: string

      if (orderType === 'market') {
        // Market order
        txSig = await driftClient.placeAndTakePerpOrder({
          orderType: OrderType.MARKET,
          marketIndex,
          direction,
          baseAssetAmount: positionSize,
          marketType: MarketType.PERP,
        })
      } else if (orderType === 'limit') {
        // Limit order
        if (!limitPrice) {
          setStatus('❌ Please enter a limit price')
          setLoading(false)
          return
        }
        const limitPriceBN = new BN(parseFloat(limitPrice) * QUOTE_PRECISION.toNumber())

        txSig = await driftClient.placePerpOrder({
          orderType: OrderType.LIMIT,
          marketIndex,
          direction,
          baseAssetAmount: positionSize,
          price: limitPriceBN,
        })
      } else {
        // Stop market order
        if (!triggerPrice) {
          setStatus('❌ Please enter a trigger price')
          setLoading(false)
          return
        }
        const triggerPriceBN = new BN(parseFloat(triggerPrice) * QUOTE_PRECISION.toNumber())
        const triggerCondition = direction === PositionDirection.LONG
          ? OrderTriggerCondition.BELOW
          : OrderTriggerCondition.ABOVE

        txSig = await driftClient.placePerpOrder({
          orderType: OrderType.TRIGGER_MARKET,
          marketIndex,
          direction,
          baseAssetAmount: positionSize,
          triggerPrice: triggerPriceBN,
          triggerCondition,
        })
      }

      setStatus(`✅ ${directionText} ${orderType} order placed! TX: ${txSig.slice(0, 8)}...`)
      setAmount('')
      setTimeout(() => setStatus(''), 5000)
    } catch (error) {
      console.error('Error opening position:', error)
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Failed to open position'}`)
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
                <span className="label-text font-bold">Select Market</span>
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

            {/* Real-time Price Display */}
            {oraclePrice && (
              <div className="stats shadow w-full my-4">
                <div className="stat">
                  <div className="stat-title">Oracle Price</div>
                  <div className="stat-value text-lg">${oraclePrice}</div>
                  <div className="stat-desc">Market price</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Bid</div>
                  <div className="stat-value text-lg text-success">${bidPrice}</div>
                  <div className="stat-desc">Buy price</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Ask</div>
                  <div className="stat-value text-lg text-error">${askPrice}</div>
                  <div className="stat-desc">Sell price</div>
                </div>
              </div>
            )}

            {/* Order Type Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Order Type</span>
              </label>
              <div className="join w-full">
                <button
                  className={`btn join-item flex-1 ${orderType === 'market' ? 'btn-active btn-primary' : ''}`}
                  onClick={() => setOrderType('market')}
                >
                  Market
                </button>
                <button
                  className={`btn join-item flex-1 ${orderType === 'limit' ? 'btn-active btn-primary' : ''}`}
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </button>
                <button
                  className={`btn join-item flex-1 ${orderType === 'stop' ? 'btn-active btn-primary' : ''}`}
                  onClick={() => setOrderType('stop')}
                >
                  Stop Market
                </button>
              </div>
            </div>

            {/* Limit Price Input */}
            {orderType === 'limit' && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Limit Price ($)</span>
                  <span className="label-text-alt">Current: ${oraclePrice || 'N/A'}</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter limit price"
                  className="input input-bordered w-full"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            )}

            {/* Stop Trigger Price Input */}
            {orderType === 'stop' && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Trigger Price ($)</span>
                  <span className="label-text-alt">Current: ${oraclePrice || 'N/A'}</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter trigger price"
                  className="input input-bordered w-full"
                  value={triggerPrice}
                  onChange={(e) => setTriggerPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <label className="label">
                  <span className="label-text-alt">Order triggers when price crosses this level</span>
                </label>
              </div>
            )}

            {/* Amount Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Amount (USDC)</span>
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="input input-bordered w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Leverage Slider */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Leverage: {leverage}x</span>
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
                <span>2x</span>
                <span>3x</span>
                <span>4x</span>
                <span>5x</span>
                <span>6x</span>
                <span>7x</span>
                <span>8x</span>
                <span>9x</span>
                <span>10x</span>
              </div>
            </div>

            {/* Trade Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                className="btn btn-success btn-lg"
                onClick={() => openPosition(PositionDirection.LONG)}
                disabled={loading || !driftClient || !amount}
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
                disabled={loading || !driftClient || !amount}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>📉 SHORT</>
                )}
              </button>
            </div>

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
