# 🏗️ Technical Architecture - Bang Perp Exchange

This document provides a detailed technical overview of the Bang Perp Exchange architecture.

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Integration Points](#integration-points)
7. [Deployment Architecture](#deployment-architecture)

## System Overview

Bang Perp Exchange is a **non-custodial** perpetual futures trading platform built on Solana. It acts as a user interface layer that connects users' wallets to the Drift Protocol smart contracts.

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Bang Perp Exchange (React SPA)              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │  App.tsx │─▶│TradePanel│─▶│ RiskWarning.tsx  │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────▼───────────────────────────────┐  │
│  │      Solana Wallet Adapter (React Context)            │  │
│  │  ┌──────────────────┐  ┌──────────────────┐         │  │
│  │  │ Phantom Adapter  │  │ Solflare Adapter │         │  │
│  │  └──────────────────┘  └──────────────────┘         │  │
│  └───────────────────────┬───────────────────────────────┘  │
└────────────────────────┬─┴───────────────────────────────────┘
                         │
                         │ JSON-RPC
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Solana Blockchain                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Drift Protocol Smart Contracts             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ User Account │  │  Perp Market │  │ Order Book │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Non-Custodial**: Users always control their private keys and funds
2. **Thin Client**: Minimal business logic in the frontend
3. **Protocol-First**: All trading logic handled by Drift Protocol
4. **Stateless**: No backend server required
5. **Progressive Enhancement**: Works without JavaScript for basic content

## Technology Stack

### Frontend Layer

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 18.2.0 | UI component library |
| **Language** | TypeScript | 5.2.2 | Type-safe development |
| **Build Tool** | Vite | 5.2.0 | Fast builds and HMR |
| **Styling** | Tailwind CSS | 3.4.3 | Utility-first CSS |
| **UI Components** | DaisyUI | 4.11.1 | Styled component library |

### Blockchain Layer

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Blockchain** | Solana | - | Layer 1 blockchain |
| **RPC Client** | @solana/web3.js | 1.95.2 | Solana interaction |
| **Wallet Adapter** | @solana/wallet-adapter-react | 0.15.35 | Wallet integration |
| **Trading Protocol** | @drift-labs/sdk | 2.92.0 | Drift Protocol SDK |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |
| **Autoprefixer** | CSS vendor prefixes |
| **TypeScript Compiler** | Type checking |

## Component Architecture

### Component Hierarchy

```
App.tsx (Root)
├── Header
│   └── WalletMultiButton (from @solana/wallet-adapter-react-ui)
├── Hero Section
│   └── Branding & Description
├── RiskWarning.tsx
│   └── Terms of Service & Risk Disclosure
├── TradePanel.tsx (Core Trading Interface)
│   ├── Market Selector
│   ├── Amount Input
│   ├── Leverage Slider
│   ├── Long/Short Buttons
│   └── Position Info Display
└── Footer
    └── Links & Disclaimers
```

### Component Details

#### App.tsx
**Responsibility**: Root component, layout, and navigation
- Renders overall page structure
- Provides context from Wallet Adapter
- Manages global UI state (theme, etc.)

```typescript
function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <RiskWarning />
      <TradePanel />
      <Footer />
    </div>
  )
}
```

#### TradePanel.tsx
**Responsibility**: Core trading functionality
- State Management:
  - `driftClient`: DriftClient instance
  - `user`: Drift User account
  - `amount`: Trade amount
  - `leverage`: Selected leverage
  - `selectedMarket`: Current market
  - `loading`: Transaction loading state
  - `status`: User feedback messages

- Lifecycle:
  1. Wallet connection detected
  2. Initialize Drift Client
  3. Subscribe to user account
  4. Enable trading

- Key Functions:
  - `initializeDrift()`: Setup Drift SDK
  - `openPosition()`: Execute trades

#### RiskWarning.tsx
**Responsibility**: Legal compliance and user education
- Collapsible disclaimer section
- Terms of Service
- Risk disclosures
- Non-custodial explanation

## Data Flow

### Wallet Connection Flow

```
1. User clicks "Select Wallet"
   ↓
2. WalletModalProvider shows wallet options
   ↓
3. User selects Phantom/Solflare
   ↓
4. Wallet extension prompts for approval
   ↓
5. User approves connection
   ↓
6. publicKey available in React context
   ↓
7. TradePanel.useEffect triggered
   ↓
8. initializeDrift() called
```

### Trade Execution Flow

```
1. User enters trade parameters:
   - Market (SOL-PERP, BTC-PERP, ETH-PERP)
   - Amount (USDC)
   - Leverage (1x-10x)
   ↓
2. User clicks LONG or SHORT button
   ↓
3. openPosition() function called
   ↓
4. Calculate position size (amount × leverage)
   ↓
5. Create order parameters:
   - orderType: 0 (market)
   - marketIndex: selected market
   - direction: LONG/SHORT
   - baseAssetAmount: calculated size
   ↓
6. Call driftClient.placeAndTakePerpOrder()
   ↓
7. Drift SDK creates transaction
   ↓
8. Wallet prompts user to sign
   ↓
9. User signs transaction
   ↓
10. Transaction sent to Solana
    ↓
11. Transaction confirmed
    ↓
12. Position opened on Drift Protocol
    ↓
13. Success message displayed
```

### State Management

We use **React Hooks** for state management:

```typescript
// Local component state
const [driftClient, setDriftClient] = useState<DriftClient | null>(null)
const [user, setUser] = useState<User | null>(null)
const [amount, setAmount] = useState('')
const [leverage, setLeverage] = useState('5')

// Global wallet state from Context
const { publicKey, signTransaction, signAllTransactions } = useWallet()
const { connection } = useConnection()
```

No Redux or external state library needed - keeps architecture simple.

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────┐
│ Layer 1: User Control (Private Keys)                │
│ - User holds private keys in wallet extension       │
│ - App never has access to private keys              │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ Layer 2: Transaction Signing                        │
│ - All transactions signed by user in wallet         │
│ - User can review transaction details before sign   │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ Layer 3: Smart Contract Security (Drift Protocol)   │
│ - Audited smart contracts                           │
│ - Program authority controls                        │
│ - Built-in risk checks                              │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ Layer 4: Solana Blockchain Security                 │
│ - Proof of History + Proof of Stake                 │
│ - 400ms block time                                  │
│ - Immutable transaction ledger                      │
└─────────────────────────────────────────────────────┘
```

### Security Best Practices Implemented

1. **No Private Key Storage**: Private keys never leave the wallet
2. **Input Validation**: All user inputs validated before use
3. **TypeScript**: Type safety prevents many bugs
4. **Environment Variables**: Sensitive config in `.env.local`
5. **HTTPS Only**: Enforced in production
6. **Content Security Policy**: Restricts resource loading
7. **Dependencies**: Regular security audits

### Attack Surface Analysis

| Vector | Risk | Mitigation |
|--------|------|------------|
| **XSS** | Low | React auto-escapes, CSP headers |
| **CSRF** | None | No cookies/sessions used |
| **Phishing** | Medium | Clear branding, wallet verification |
| **Supply Chain** | Medium | npm audit, dependency scanning |
| **Smart Contract** | Low | Using audited Drift Protocol |
| **Front-running** | Medium | Inherent to blockchain, slippage protection |

## Integration Points

### 1. Solana Wallet Adapter

**Interface**: `@solana/wallet-adapter-react`

Provides React hooks and components for wallet interaction:

```typescript
// Hooks provided
const wallet = useWallet()
const connection = useConnection()

// Available properties
wallet.publicKey        // User's public key
wallet.connected        // Connection status
wallet.signTransaction  // Sign single transaction
wallet.signAllTransactions // Sign multiple transactions
wallet.disconnect()     // Disconnect wallet
```

### 2. Drift Protocol SDK

**Interface**: `@drift-labs/sdk`

Main integration points:

```typescript
// Initialize client
const driftClient = new DriftClient({
  connection,
  wallet,
  env: 'devnet' | 'mainnet-beta'
})

// Subscribe to updates
await driftClient.subscribe()

// Place order
await driftClient.placeAndTakePerpOrder({
  orderType: 0,
  marketIndex: 0,
  direction: PositionDirection.LONG,
  baseAssetAmount: new BN(amount)
})
```

### 3. Solana RPC Endpoint

**Interface**: JSON-RPC over HTTPS

Communication with Solana blockchain:

```typescript
// Default: https://api.devnet.solana.com
// Production: Use premium RPC (QuickNode, Helius)

const connection = new Connection(
  process.env.VITE_RPC_ENDPOINT,
  'confirmed'
)

// Used for:
// - Fetching account data
// - Sending transactions
// - Subscribing to updates
```

## Deployment Architecture

### Static Site Deployment

```
┌──────────────────────────────────────────────────────┐
│                   Developer                          │
│                git push to main                      │
└───────────────────┬──────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────┐
│              GitHub Actions (CI/CD)                  │
│  1. npm install                                      │
│  2. npm run build                                    │
│  3. Upload to CDN                                    │
└───────────────────┬──────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────┐
│         CDN (GitHub Pages / Vercel / Netlify)        │
│  ┌────────────────────────────────────────────────┐  │
│  │  Static Files:                                 │  │
│  │  - index.html                                  │  │
│  │  - JavaScript bundles                          │  │
│  │  - CSS                                         │  │
│  │  - Assets                                      │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────┐
│                User's Browser                        │
│  - Downloads static files                            │
│  - Executes React application                        │
│  - Connects directly to Solana RPC                   │
└──────────────────────────────────────────────────────┘
```

### No Backend Required

This is a **fully client-side application**:
- No API server needed
- No database needed
- No authentication server needed
- Scales automatically with CDN

### Environment-Specific Configurations

| Environment | RPC Endpoint | Drift Env | Purpose |
|-------------|--------------|-----------|---------|
| **Development** | http://localhost:8899 | localnet | Local testing |
| **Staging** | https://api.devnet.solana.com | devnet | Integration testing |
| **Production** | https://api.mainnet-beta.solana.com | mainnet-beta | Live trading |

## Performance Optimization

### Bundle Size Optimization

Current bundle sizes:
- Main bundle: ~6MB (includes all Solana/Drift libs)
- Initial load: ~1.3MB gzipped

**Optimization strategies**:
1. Code splitting (future)
2. Tree shaking (enabled)
3. Minification (enabled)
4. Gzip compression (CDN level)

### Runtime Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 3s
- **Wallet Connection**: < 500ms
- **Transaction Signing**: User-dependent

## Monitoring & Observability

### Recommended Monitoring Stack

```
Frontend Error Tracking: Sentry
├── JavaScript errors
├── React errors
└── Transaction failures

Uptime Monitoring: UptimeRobot
├── HTTP health checks
├── SSL certificate monitoring
└── Response time tracking

Analytics: Plausible / Google Analytics
├── User sessions
├── Page views
└── Trading events

RPC Monitoring: Custom
├── Request latency
├── Success rate
└── Endpoint health
```

## Future Architecture Improvements

### Planned Enhancements

1. **Code Splitting**: Reduce initial bundle size
2. **Service Worker**: Offline support
3. **WebSocket**: Real-time price updates
4. **Optimistic UI**: Instant feedback before confirmation
5. **Account Abstraction**: Gasless transactions
6. **Multi-chain**: Expand beyond Solana

### Scalability Considerations

Current architecture scales well because:
- Stateless application
- No backend bottleneck
- CDN distribution
- Blockchain handles state

**Bottlenecks**:
- RPC endpoint rate limits → Use premium RPC
- Browser memory → Implement cleanup
- Bundle size → Code splitting

## Conclusion

Bang Perp Exchange demonstrates a modern, secure, non-custodial trading platform architecture:

✅ Simple, maintainable codebase
✅ Clear separation of concerns
✅ Security-first design
✅ Scalable deployment
✅ Comprehensive testing

The architecture prioritizes user security and control while providing a seamless trading experience.

---

**For questions about the architecture, open an issue on GitHub.**