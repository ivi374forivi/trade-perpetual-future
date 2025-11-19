# 🚀 Implementation Plan: Bang Perp Exchange Evolution

**Generated:** 2025-11-19
**Status:** Roadmap to Production
**Timeline:** 6-8 weeks to production-ready

---

## 📋 Table of Contents

1. [Critical Path (Week 1)](#critical-path-week-1)
2. [High Priority (Week 2-3)](#high-priority-week-2-3)
3. [Medium Priority (Week 4-6)](#medium-priority-week-4-6)
4. [Future Enhancements (Post-Launch)](#future-enhancements-post-launch)
5. [Issue Tracking](#issue-tracking)

---

## 🔴 CRITICAL PATH (Week 1)

**Goal:** Fix catastrophic bugs that could cause financial loss

### Issue #1: Fix Position Size Integer Overflow
**Priority:** CRITICAL
**File:** `src/components/TradePanel.tsx:99-103`
**Severity:** Financial data corruption
**Estimated Time:** 2 hours

**Problem:**
```typescript
const baseAmount = new BN(parseFloat(amount) * 1_000_000)
const positionSize = new BN(baseAmount.toNumber() * leverageMultiplier)
```
Converting BN → number → BN loses precision and can overflow.

**Solution:**
```typescript
const baseAmount = new BN(parseFloat(amount) * 1_000_000)
const leverageMultiplier = new BN(Math.floor(parseFloat(leverage)))
const positionSize = baseAmount.mul(leverageMultiplier)
```

**Acceptance Criteria:**
- [ ] BN multiplication used instead of number conversion
- [ ] Test with large amounts (1,000,000 USDC)
- [ ] Test with 10x leverage
- [ ] No precision loss
- [ ] Unit test added

---

### Issue #2: Add Slippage Protection
**Priority:** CRITICAL
**File:** `src/components/TradePanel.tsx:107-113`
**Severity:** Unlimited loss exposure
**Estimated Time:** 3 hours

**Problem:**
Market orders have no price limits. During volatility, users can get filled at any price.

**Solution:**
```typescript
// Add slippage tolerance state
const [slippageTolerance, setSlippageTolerance] = useState(0.5) // 0.5% default

// In openPosition function
await driftClient.placeAndTakePerpOrder({
  orderType: 0,
  marketIndex,
  direction,
  baseAssetAmount: positionSize,
  marketType: MarketType.PERP,
  maxSlippageBps: new BN(slippageTolerance * 100), // Convert to basis points
})
```

**UI Changes:**
- Add slippage tolerance input (0.1% to 5%)
- Show estimated fill price
- Show max acceptable price based on slippage

**Acceptance Criteria:**
- [ ] Slippage tolerance configurable
- [ ] Default 0.5% for all orders
- [ ] UI shows max acceptable price
- [ ] Transaction reverts if slippage exceeded
- [ ] Warning if user sets >2% slippage

---

### Issue #3: Implement Transaction Confirmation
**Priority:** CRITICAL
**File:** `src/components/TradePanel.tsx:107-121`
**Severity:** False success messages
**Estimated Time:** 4 hours

**Problem:**
```typescript
const txSig = await driftClient.placeAndTakePerpOrder(...)
setStatus(`✅ position opened!`) // WRONG - not confirmed yet
```

**Solution:**
```typescript
try {
  const txSig = await driftClient.placeAndTakePerpOrder(...)

  setStatus('⏳ Transaction submitted, waiting for confirmation...')

  // Wait for confirmation
  const confirmation = await connection.confirmTransaction(txSig, 'confirmed')

  if (confirmation.value.err) {
    throw new Error('Transaction failed on-chain')
  }

  setStatus(`✅ ${directionText} position opened! TX: ${txSig.slice(0, 8)}...`)
} catch (error) {
  setStatus(`❌ Error: ${getUserFriendlyError(error)}`)
}
```

**Additional:**
- Add timeout handling (30 seconds)
- Add retry logic for RPC failures
- Show block explorer link

**Acceptance Criteria:**
- [ ] Waits for 'confirmed' commitment level
- [ ] Checks confirmation.value.err
- [ ] Shows "pending" state during confirmation
- [ ] Timeout after 30 seconds with clear message
- [ ] Link to Solana Explorer for pending tx

---

### Issue #4: Add Comprehensive Input Validation
**Priority:** CRITICAL
**File:** `src/components/TradePanel.tsx:170-183`
**Severity:** Invalid transactions, UX issues
**Estimated Time:** 3 hours

**Problem:**
- No max amount validation
- Can enter scientific notation (1e10)
- No decimal precision limits
- No balance checks

**Solution:**
```typescript
const MAX_POSITION_SIZE_USDC = 100_000 // $100k max
const MIN_POSITION_SIZE_USDC = 1 // $1 min

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

  if (num < MIN_POSITION_SIZE_USDC) {
    return { valid: false, error: `Minimum ${MIN_POSITION_SIZE_USDC} USDC` }
  }

  if (num > MAX_POSITION_SIZE_USDC) {
    return { valid: false, error: `Maximum ${MAX_POSITION_SIZE_USDC} USDC` }
  }

  // Check decimal places (max 2 for USDC)
  const decimalPlaces = (value.split('.')[1] || '').length
  if (decimalPlaces > 2) {
    return { valid: false, error: 'Max 2 decimal places' }
  }

  return { valid: true }
}

// Add to input handler
const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setAmount(value)

  const validation = validateAmount(value)
  setAmountError(validation.error || '')
}
```

**UI Changes:**
- Show validation error below input
- Disable trade buttons if invalid
- Show helpful hints (min/max amounts)

**Acceptance Criteria:**
- [ ] Rejects scientific notation
- [ ] Enforces min/max limits
- [ ] Limits decimal precision to 2 places
- [ ] Shows clear error messages
- [ ] Prevents negative values
- [ ] Unit tests for all edge cases

---

### Issue #5: Fix Memory Leaks (Cleanup Drift Subscriptions)
**Priority:** CRITICAL
**File:** `src/components/TradePanel.tsx:28-84`
**Severity:** Browser crashes on extended use
**Estimated Time:** 2 hours

**Problem:**
No cleanup when component unmounts or wallet disconnects. WebSocket connections remain open.

**Solution:**
```typescript
// Add cleanup effect
useEffect(() => {
  return () => {
    // Cleanup on unmount
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

// Also cleanup on wallet disconnect
useEffect(() => {
  if (!publicKey && driftClient) {
    // Wallet disconnected, cleanup
    driftClient.unsubscribe().catch(console.error)
    setDriftClient(null)

    if (user) {
      user.unsubscribe().catch(console.error)
      setUser(null)
    }
  }
}, [publicKey])
```

**Acceptance Criteria:**
- [ ] Subscriptions cleaned up on unmount
- [ ] Subscriptions cleaned up on wallet disconnect
- [ ] No console errors during cleanup
- [ ] Memory usage stable over 1 hour session
- [ ] Test connect/disconnect cycle 20+ times

---

### Issue #6: Require Explicit Terms Acceptance
**Priority:** CRITICAL
**File:** `src/components/TradePanel.tsx`, `src/components/RiskWarning.tsx`
**Severity:** Legal liability
**Estimated Time:** 2 hours

**Problem:**
- Risk warning collapsed by default
- No explicit acceptance required
- Users can trade without reading terms

**Solution:**

**Update RiskWarning.tsx:**
```typescript
function RiskWarning({ onAccept }: { onAccept: (accepted: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(true) // Default OPEN
  const [accepted, setAccepted] = useState(false)

  const handleAcceptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccepted(e.target.checked)
    onAccept(e.target.checked)
  }

  return (
    <div className="collapse collapse-arrow bg-warning text-warning-content mb-8">
      {/* ... existing content ... */}

      <div className="form-control mt-4">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            checked={accepted}
            onChange={handleAcceptChange}
            className="checkbox checkbox-error"
          />
          <span className="label-text font-bold">
            I have read and understand the risks, and accept the Terms of Service
          </span>
        </label>
      </div>
    </div>
  )
}
```

**Update TradePanel.tsx:**
```typescript
const [termsAccepted, setTermsAccepted] = useState(false)

// Disable trading if not accepted
disabled={loading || !driftClient || !amount || !termsAccepted}
```

**Update App.tsx:**
```typescript
const [termsAccepted, setTermsAccepted] = useState(false)

<RiskWarning onAccept={setTermsAccepted} />
<TradePanel termsAccepted={termsAccepted} />
```

**Acceptance Criteria:**
- [ ] Risk warning expanded by default
- [ ] Checkbox required before trading
- [ ] Trade buttons disabled until accepted
- [ ] Acceptance state persisted in localStorage
- [ ] Clear visual indicator of acceptance status

---

### Issue #7: Add Transaction Simulation Before Signing
**Priority:** CRITICAL
**File:** `src/components/TradePanel.tsx:87-128`
**Severity:** Users sign transactions that will fail
**Estimated Time:** 4 hours

**Problem:**
No pre-flight check. Users sign transactions that may fail due to:
- Insufficient balance
- Invalid parameters
- Market conditions

**Solution:**
```typescript
const openPosition = async (direction: PositionDirection) => {
  if (!driftClient || !user || !amount) {
    setStatus('Please connect wallet and enter amount')
    return
  }

  setLoading(true)
  const directionText = direction === PositionDirection.LONG ? 'LONG' : 'SHORT'
  setStatus(`Simulating ${directionText} position...`)

  try {
    const baseAmount = new BN(parseFloat(amount) * 1_000_000)
    const leverageMultiplier = new BN(Math.floor(parseFloat(leverage)))
    const positionSize = baseAmount.mul(leverageMultiplier)
    const marketIndex = markets[selectedMarket].index

    // Build transaction
    const tx = await driftClient.buildPlaceAndTakePerpOrderTx({
      orderType: 0,
      marketIndex,
      direction,
      baseAssetAmount: positionSize,
      marketType: MarketType.PERP,
      maxSlippageBps: new BN(slippageTolerance * 100),
    })

    // Simulate first
    setStatus('🔍 Checking transaction validity...')
    const simulation = await connection.simulateTransaction(tx)

    if (simulation.value.err) {
      throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`)
    }

    // Show estimated costs
    const estimatedFee = simulation.value.unitsConsumed
      ? (simulation.value.unitsConsumed * 0.000005).toFixed(6)
      : '0.000005'

    setStatus(`Estimated fee: ${estimatedFee} SOL. Opening ${directionText} position...`)

    // Now execute
    const txSig = await driftClient.placeAndTakePerpOrder({
      orderType: 0,
      marketIndex,
      direction,
      baseAssetAmount: positionSize,
      marketType: MarketType.PERP,
      maxSlippageBps: new BN(slippageTolerance * 100),
    })

    setStatus('⏳ Transaction submitted, waiting for confirmation...')

    const confirmation = await connection.confirmTransaction(txSig, 'confirmed')

    if (confirmation.value.err) {
      throw new Error('Transaction failed on-chain')
    }

    setStatus(`✅ ${directionText} position opened! TX: ${txSig.slice(0, 8)}...`)
    setAmount('')
    setTimeout(() => setStatus(''), 5000)

  } catch (error) {
    console.error('Error opening position:', error)
    const userMessage = getUserFriendlyError(error)
    setStatus(`❌ ${userMessage}`)
  } finally {
    setLoading(false)
  }
}

// Helper function
const getUserFriendlyError = (error: any): string => {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('insufficient funds')) {
    return 'Insufficient USDC balance'
  }
  if (message.includes('slippage')) {
    return 'Price moved too much. Try increasing slippage tolerance.'
  }
  if (message.includes('simulation failed')) {
    return 'Transaction would fail. Check your balance and position size.'
  }
  if (message.includes('User rejected')) {
    return 'Transaction cancelled'
  }

  return `Error: ${message}`
}
```

**Acceptance Criteria:**
- [ ] All transactions simulated before signing
- [ ] Simulation errors caught and displayed
- [ ] Estimated fees shown to user
- [ ] User-friendly error messages
- [ ] No failed transactions reach the blockchain

---

## 🟡 HIGH PRIORITY (Week 2-3)

### Issue #8: Implement Position Management UI
**Priority:** HIGH
**Estimated Time:** 8 hours

**Features:**
- Display current positions (from Drift user account)
- Show unrealized PnL
- Close position button
- Position size and leverage display

**Implementation:**
```typescript
// In TradePanel.tsx
const [positions, setPositions] = useState<PerpPosition[]>([])

useEffect(() => {
  if (user) {
    // Fetch positions
    const userPositions = user.getPerpPositions()
    setPositions(userPositions.filter(p => !p.baseAssetAmount.isZero()))
  }
}, [user, driftClient])

// Close position function
const closePosition = async (marketIndex: number) => {
  // Implementation
}
```

**Acceptance Criteria:**
- [ ] List all open positions
- [ ] Real-time PnL updates
- [ ] Close position functionality
- [ ] Confirmation dialog before closing
- [ ] Transaction confirmation for closes

---

### Issue #9: Add Real-Time Price Display
**Priority:** HIGH
**Estimated Time:** 6 hours

**Features:**
- Fetch current mark price from Drift oracle
- Display in trading panel
- Calculate and show liquidation price
- Show 24h price change

**Implementation:**
```typescript
const [marketPrice, setMarketPrice] = useState<number>(0)

useEffect(() => {
  if (driftClient && selectedMarket !== null) {
    const market = driftClient.getPerpMarketAccount(selectedMarket)
    const oracle = driftClient.getOracleDataForPerpMarket(selectedMarket)
    setMarketPrice(oracle.price.toNumber() / 1e6)
  }
}, [driftClient, selectedMarket])
```

**UI Updates:**
- Large price display at top of trade panel
- Price change indicator (green/red)
- Calculated liquidation price based on inputs

**Acceptance Criteria:**
- [ ] Real-time price from oracle
- [ ] Updates every 1 second
- [ ] Liquidation price calculation accurate
- [ ] Visual price change indicator

---

### Issue #10: Implement Error Tracking (Sentry)
**Priority:** HIGH
**Estimated Time:** 3 hours

**Setup:**
```bash
npm install @sentry/react @sentry/tracing
```

**Configuration:**
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_DRIFT_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Don't send rejected transactions
    if (hint.originalException?.message?.includes('User rejected')) {
      return null
    }
    return event
  }
})
```

**Acceptance Criteria:**
- [ ] All errors logged to Sentry
- [ ] User context included (wallet address)
- [ ] Transaction failures tracked
- [ ] Performance monitoring enabled
- [ ] Source maps uploaded for debugging

---

### Issue #11: Add User Balance Display
**Priority:** HIGH
**Estimated Time:** 4 hours

**Features:**
- Show USDC balance
- Show SOL balance (for fees)
- Warn if insufficient for trade
- Refresh button

**Implementation:**
```typescript
const [usdcBalance, setUsdcBalance] = useState<number>(0)
const [solBalance, setSolBalance] = useState<number>(0)

useEffect(() => {
  if (publicKey && connection) {
    fetchBalances()
  }
}, [publicKey, connection])

const fetchBalances = async () => {
  if (!publicKey) return

  // SOL balance
  const balance = await connection.getBalance(publicKey)
  setSolBalance(balance / 1e9)

  // USDC balance (if user account exists)
  if (user) {
    const collateral = user.getTotalCollateral()
    setUsdcBalance(collateral.toNumber() / 1e6)
  }
}
```

**UI:**
- Display in header or side panel
- Warning icon if SOL < 0.01
- Warning if USDC insufficient for trade

**Acceptance Criteria:**
- [ ] Accurate balance display
- [ ] Refreshes after trades
- [ ] Manual refresh button
- [ ] Warning indicators functional

---

### Issue #12: Create Legal Documentation
**Priority:** HIGH
**Estimated Time:** 8 hours (with legal review)

**Documents Needed:**
1. **TERMS_OF_SERVICE.md**
   - User agreement
   - Limitation of liability
   - Dispute resolution
   - Governing law

2. **PRIVACY_POLICY.md**
   - Data collection (wallet addresses, IP)
   - Cookie usage
   - Third-party services (RPC, Drift)
   - GDPR compliance

3. **RISK_DISCLOSURE.md**
   - Trading risks
   - Smart contract risks
   - Regulatory risks
   - Technical risks

**Integration:**
- Link from RiskWarning component
- Link in footer
- Require acceptance via checkbox

**Acceptance Criteria:**
- [ ] All three documents created
- [ ] Legal counsel review (RECOMMENDED)
- [ ] Linked from UI
- [ ] Versioned (v1.0)
- [ ] Last updated date included

---

### Issue #13: Implement RPC Endpoint Fallback
**Priority:** HIGH
**Estimated Time:** 4 hours

**Problem:**
Single RPC endpoint = single point of failure

**Solution:**
```typescript
// src/utils/rpc.ts
const RPC_ENDPOINTS = [
  import.meta.env.VITE_RPC_ENDPOINT,
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
]

export async function getConnection(): Promise<Connection> {
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const connection = new Connection(endpoint, 'confirmed')
      // Test the connection
      await connection.getVersion()
      return connection
    } catch (error) {
      console.warn(`RPC endpoint ${endpoint} failed, trying next...`)
    }
  }
  throw new Error('All RPC endpoints failed')
}
```

**Update main.tsx:**
```typescript
const [connection, setConnection] = useState<Connection | null>(null)

useEffect(() => {
  getConnection().then(setConnection).catch(console.error)
}, [])

if (!connection) return <div>Connecting...</div>

return (
  <ConnectionProvider endpoint={connection}>
    {/* ... */}
  </ConnectionProvider>
)
```

**Acceptance Criteria:**
- [ ] Multiple RPC endpoints configured
- [ ] Automatic failover on errors
- [ ] Health check before use
- [ ] User notification if all fail
- [ ] Retry logic with exponential backoff

---

### Issue #14: Add Transaction Rate Limiting
**Priority:** HIGH
**Estimated Time:** 2 hours

**Problem:**
Users can spam transactions, overwhelming wallet or causing errors

**Solution:**
```typescript
const [lastTradeTime, setLastTradeTime] = useState(0)
const COOLDOWN_MS = 3000 // 3 seconds

const openPosition = async (direction: PositionDirection) => {
  const now = Date.now()
  if (now - lastTradeTime < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (now - lastTradeTime)) / 1000)
    setStatus(`⏳ Please wait ${remaining}s before next trade`)
    return
  }

  setLastTradeTime(now)
  // ... rest of function
}
```

**UI Update:**
- Show countdown timer on button when in cooldown
- Visual feedback (disabled state)

**Acceptance Criteria:**
- [ ] 3 second cooldown between trades
- [ ] Countdown displayed to user
- [ ] Prevents rapid double-clicking
- [ ] Cooldown resets on errors
- [ ] Unit tests for cooldown logic

---

## 🟢 MEDIUM PRIORITY (Week 4-6)

### Issue #15: Implement Unit Testing
**Priority:** MEDIUM
**Estimated Time:** 16 hours

**Setup:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Test Files Needed:**
1. `src/components/TradePanel.test.tsx`
   - Input validation tests
   - Position size calculation tests
   - Error handling tests
   - Slippage calculation tests

2. `src/components/RiskWarning.test.tsx`
   - Terms acceptance tests
   - Collapse/expand tests

3. `src/utils/validation.test.ts` (if extracted)
   - Edge case tests for all validators

**Example Test:**
```typescript
// src/components/TradePanel.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TradePanel from './TradePanel'

describe('TradePanel', () => {
  it('validates amount input correctly', () => {
    // Test implementation
  })

  it('calculates position size without overflow', () => {
    // Test large numbers
  })

  it('disables trading when wallet not connected', () => {
    // Test
  })
})
```

**Coverage Goals:**
- Minimum 70% code coverage
- 100% coverage on critical paths (position sizing, validation)

**Acceptance Criteria:**
- [ ] Test suite runs with `npm test`
- [ ] All critical functions tested
- [ ] Edge cases covered
- [ ] Mocks for Drift SDK and wallet
- [ ] CI integration (GitHub Actions)

---

### Issue #16: Add Analytics Tracking
**Priority:** MEDIUM
**Estimated Time:** 4 hours

**Setup Plausible Analytics:**
```bash
npm install plausible-tracker
```

**Implementation:**
```typescript
// src/utils/analytics.ts
import Plausible from 'plausible-tracker'

const plausible = Plausible({
  domain: 'bangperp.exchange',
  apiHost: 'https://plausible.io'
})

export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  plausible.trackEvent(eventName, { props })
}

// Track important events
export const trackWalletConnect = () => trackEvent('Wallet Connected')
export const trackTrade = (direction: string, amount: number, leverage: number) => {
  trackEvent('Trade Opened', { direction, amount, leverage })
}
export const trackTradeError = (error: string) => trackEvent('Trade Error', { error })
```

**Events to Track:**
- Wallet connections
- Trade attempts (long/short)
- Trade successes
- Trade failures
- Terms acceptance
- Page views
- Time spent on site

**Acceptance Criteria:**
- [ ] Privacy-focused analytics (no PII)
- [ ] GDPR compliant
- [ ] Key events tracked
- [ ] Dashboard accessible
- [ ] Opt-out mechanism for users

---

### Issue #17: Mobile Wallet Support (WalletConnect)
**Priority:** MEDIUM
**Estimated Time:** 6 hours

**Problem:**
Currently only supports browser extension wallets

**Solution:**
```bash
npm install @solana/wallet-adapter-walletconnect
```

```typescript
// src/main.tsx
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect'

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: 'mainnet-beta',
    options: {
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    }
  }),
]
```

**Acceptance Criteria:**
- [ ] WalletConnect integrated
- [ ] QR code displayed for mobile
- [ ] Works with Phantom mobile
- [ ] Works with Solflare mobile
- [ ] Tested on iOS and Android

---

### Issue #18: Improve Mobile Responsive Design
**Priority:** MEDIUM
**Estimated Time:** 8 hours

**Current Issues:**
- Buttons may be too small on mobile
- Forms cramped on small screens
- Navigation difficult with one hand

**Improvements:**
```css
/* Larger touch targets */
.btn {
  min-height: 48px;
  min-width: 48px;
}

/* Better mobile forms */
@media (max-width: 640px) {
  .trade-panel {
    padding: 1rem;
  }

  .leverage-slider {
    height: 48px; /* Larger touch area */
  }
}
```

**Changes:**
- Larger buttons (min 48px height)
- Stacked layout on mobile
- Simplified navigation
- Bottom sheet for trade confirmation
- Swipe gestures for market selection

**Acceptance Criteria:**
- [ ] Tested on iPhone SE (small screen)
- [ ] Tested on Android (various sizes)
- [ ] All buttons easily tappable
- [ ] No horizontal scrolling
- [ ] Forms usable with one hand

---

### Issue #19: Add Transaction History
**Priority:** MEDIUM
**Estimated Time:** 10 hours

**Features:**
- List recent trades
- Filter by market
- Export to CSV for taxes
- Link to block explorer

**Implementation:**
```typescript
// Fetch from Drift user account
const [tradeHistory, setTradeHistory] = useState<OrderRecord[]>([])

useEffect(() => {
  if (user && driftClient) {
    fetchTradeHistory()
  }
}, [user, driftClient])

const fetchTradeHistory = async () => {
  const orders = await user.getOrderHistory()
  setTradeHistory(orders)
}
```

**UI:**
- Separate "History" tab
- Table with columns: Time, Market, Direction, Size, PnL, Status
- Pagination (10 per page)
- Export button

**Acceptance Criteria:**
- [ ] Shows all historical trades
- [ ] Sortable by date
- [ ] Filterable by market
- [ ] CSV export works
- [ ] Links to Solscan/Explorer

---

### Issue #20: Advanced Order Types
**Priority:** MEDIUM
**Estimated Time:** 12 hours

**New Features:**
- Limit orders
- Take-profit orders
- Stop-loss orders
- Trailing stop

**Implementation:**
```typescript
// Add order type selector
const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
const [limitPrice, setLimitPrice] = useState('')

// Modify placeOrder function
if (orderType === 'limit') {
  await driftClient.placePerpOrder({
    orderType: 1, // Limit
    marketIndex,
    direction,
    baseAssetAmount: positionSize,
    price: new BN(parseFloat(limitPrice) * 1e6),
    marketType: MarketType.PERP,
  })
}
```

**UI Changes:**
- Order type tabs (Market / Limit)
- Price input for limit orders
- TP/SL inputs (optional)
- Advanced options collapse panel

**Acceptance Criteria:**
- [ ] Limit orders functional
- [ ] TP/SL orders work
- [ ] Orders visible in order book
- [ ] Can cancel pending orders
- [ ] Proper validation for all types

---

### Issue #21: Performance Optimization
**Priority:** MEDIUM
**Estimated Time:** 8 hours

**Optimizations:**

1. **Code Splitting:**
```typescript
// Lazy load heavy components
const TradePanel = lazy(() => import('./components/TradePanel'))
const RiskWarning = lazy(() => import('./components/RiskWarning'))
```

2. **Memoization:**
```typescript
const positionSize = useMemo(() => {
  return calculatePositionSize(amount, leverage)
}, [amount, leverage])
```

3. **Bundle Analysis:**
```bash
npm install --save-dev rollup-plugin-visualizer
```

**Targets:**
- Initial bundle < 1MB gzipped
- First Contentful Paint < 1.5s
- Time to Interactive < 2.5s

**Acceptance Criteria:**
- [ ] Lighthouse score > 90
- [ ] Bundle size reduced by 20%
- [ ] No layout shift (CLS < 0.1)
- [ ] Lazy loading implemented
- [ ] Images optimized

---

### Issue #22: Educational Content & Tooltips
**Priority:** MEDIUM
**Estimated Time:** 6 hours

**Content Needed:**
- Leverage explanation
- Liquidation explainer
- Funding rates guide
- How to close positions
- Risk management tips

**Implementation:**
```typescript
// Use DaisyUI tooltips
<div className="tooltip" data-tip="Leverage multiplies both gains and losses">
  <InfoIcon />
</div>

// Create FAQ component
const FAQ = () => {
  const faqs = [
    { q: 'What is leverage?', a: '...' },
    { q: 'How does liquidation work?', a: '...' },
  ]
  // ...
}
```

**Locations:**
- Tooltips on all form fields
- FAQ page
- "Learn" section in footer
- Video tutorials (YouTube embeds)

**Acceptance Criteria:**
- [ ] Tooltips on leverage slider
- [ ] Tooltips on slippage input
- [ ] FAQ page created
- [ ] At least 10 FAQ entries
- [ ] Video tutorial embedded

---

## 🔵 FUTURE ENHANCEMENTS (Post-Launch)

### Issue #23: Internationalization (i18n)
**Priority:** LOW
**Estimated Time:** 12 hours

**Languages:**
- English (default)
- Spanish
- Chinese (Simplified)
- Japanese
- Portuguese

**Implementation:**
```bash
npm install react-i18next i18next
```

**Acceptance Criteria:**
- [ ] 5 languages supported
- [ ] Language selector in header
- [ ] All UI text translatable
- [ ] Right-to-left support for Arabic (future)

---

### Issue #24: Advanced Charting (TradingView)
**Priority:** LOW
**Estimated Time:** 16 hours

**Integration:**
```bash
npm install lightweight-charts
```

**Features:**
- Candlestick charts
- Volume bars
- Technical indicators (RSI, MACD)
- Drawing tools

---

### Issue #25: Social Features
**Priority:** LOW
**Estimated Time:** 24 hours

**Features:**
- Leaderboard (top traders)
- Copy trading
- Social sharing (Twitter integration)
- Referral program

---

### Issue #26: Mobile Native App
**Priority:** LOW
**Estimated Time:** 120 hours

**Stack:**
- React Native
- Solana Mobile Wallet Adapter
- Same backend (Drift)

---

## 📊 Issue Tracking

### GitHub Issues Template

Use this template for each issue:

```markdown
## Description
[Clear description of the problem and solution]

## Priority
- [ ] CRITICAL (Week 1)
- [ ] HIGH (Week 2-3)
- [ ] MEDIUM (Week 4-6)
- [ ] LOW (Post-launch)

## Files Changed
- `path/to/file1.tsx`
- `path/to/file2.ts`

## Estimated Time
[X hours]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Tests added
- [ ] Documentation updated

## Testing Checklist
- [ ] Unit tests pass
- [ ] Manual testing on devnet
- [ ] Code review completed
- [ ] No console errors

## Related Issues
Fixes #[issue number]
Depends on #[issue number]
```

---

## 🎯 Sprint Planning

### Sprint 1 (Week 1): Critical Bugs
**Goal:** Fix all critical bugs
- Issues #1-7
- Daily standups
- Code review required for all PRs
- Test on devnet daily

### Sprint 2 (Week 2): Core Features
**Goal:** Production-ready features
- Issues #8-11
- User testing with 5 beta users
- Performance benchmarks

### Sprint 3 (Week 3): Polish & Legal
**Goal:** Legal compliance + UX polish
- Issues #12-14
- Legal review
- Security audit (optional but recommended)

### Sprint 4-6 (Week 4-6): Enhancement
**Goal:** Competitive features
- Issues #15-22
- A/B testing
- Soft launch preparation

---

## ✅ Definition of Done

An issue is "Done" when:
- [ ] Code implemented and pushed to feature branch
- [ ] Unit tests written and passing
- [ ] Manual testing completed on devnet
- [ ] Code review approved
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Acceptance criteria met
- [ ] Merged to main branch

---

## 🚨 Blockers & Dependencies

### External Dependencies
- Legal review (Issue #12) - may need external counsel
- Sentry account setup (Issue #10)
- Plausible account (Issue #16)
- WalletConnect project ID (Issue #17)

### Technical Dependencies
- Issue #3 (confirmations) blocks Issue #8 (positions)
- Issue #4 (validation) blocks Issue #20 (advanced orders)
- Issue #10 (Sentry) should be done before Issue #19 (history)

---

## 📈 Success Metrics

### Week 1 Targets
- [ ] 0 critical bugs remaining
- [ ] 100% of trades confirmed successfully
- [ ] 0 false positive "success" messages
- [ ] Memory stable over 2-hour session

### Week 3 Targets
- [ ] Legal documentation complete
- [ ] 10 beta users actively trading
- [ ] Average trade time < 5 seconds
- [ ] Error rate < 1%

### Week 6 Targets (Launch Ready)
- [ ] 100 successful trades on devnet
- [ ] Lighthouse score > 90
- [ ] Test coverage > 70%
- [ ] Security audit passed
- [ ] All HIGH priority issues closed

---

**Generated:** 2025-11-19
**Maintained by:** Development Team
**Next Review:** After each sprint

---

## 🎯 Quick Reference

**CRITICAL (DO FIRST):**
- #1: Position size overflow
- #2: Slippage protection
- #3: Transaction confirmation
- #4: Input validation
- #5: Memory leaks
- #6: Terms acceptance
- #7: Transaction simulation

**HIGH (WEEK 2-3):**
- #8: Position management
- #9: Price display
- #10: Error tracking
- #11: Balance display
- #12: Legal docs
- #13: RPC fallback
- #14: Rate limiting

**Ready for Production When:**
- All CRITICAL issues closed
- All HIGH issues closed
- Legal review complete
- 50+ successful devnet trades
- Security audit passed (recommended)

---

**Let's build something great! 💥**
