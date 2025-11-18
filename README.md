# Sol-Trade-Perpetual_Future_a-Trading-Platform

None-Custodial perpetual futures trading website on blockchain, powered by Drift Protocol. Users can connect their wallets (Phantom, Solflare) and trade real money through Drift Protocol integration - earning referral fees legally without custodying funds.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Solana](https://img.shields.io/badge/Solana-Devnet-purple)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production%20Ready-success)

## 🎯 Features

### 🚀 **NEW v2.0 - Professional Trading Platform!**

Bang Perp Exchange has been upgraded to a comprehensive professional trading platform with advanced features:

### Core Features ✅
- **🔐 Solana Wallet Connection** - Support for Phantom and Solflare wallets
- **📊 Advanced Order Types** - Market, Limit, and Stop Market orders
- **⚡ Real-Time Market Data** - Live oracle prices, bid/ask updates every 2 seconds
- **📈 Position Management** - View and close positions with one click
- **📋 Order History** - Complete order tracking with status filtering
- **💰 P&L Analytics** - Comprehensive performance tracking and analytics
- **🎯 Tab Navigation** - Intuitive interface: Trade | Positions | Orders | Analytics
- **💼 Account Dashboard** - Real-time collateral, PNL, and leverage tracking
- **🌐 Multi-Market Support** - SOL-PERP, BTC-PERP, ETH-PERP
- **📊 1x-10x Leverage** - Flexible leverage control with visual slider
- **🔒 Non-Custodial** - You control your funds and sign all transactions
- **🎨 Professional UI** - Clean, modern interface with DaisyUI dark theme
- **⚠️ Risk Warnings** - Clear Terms of Service and trading risk disclosures

### 🆕 What's New in v2.0
- ✅ **Limit Orders** - Set your desired entry/exit price
- ✅ **Stop Market Orders** - Automated risk management with trigger prices
- ✅ **Real-Time Prices** - Live oracle, bid, and ask prices
- ✅ **Position Panel** - View all positions and close with one click
- ✅ **Order History** - Track all orders with filtering (open/filled/cancelled)
- ✅ **P&L Analytics** - Comprehensive performance dashboard
- ✅ **Tab Navigation** - Easy switching between Trade, Positions, Orders, Analytics
- ✅ **Dashboard Stats** - Real-time account statistics display
- ✅ **Auto-Refresh** - All data updates automatically

### 📚 Documentation
- **[⚡ QUICKSTART.md](./QUICKSTART.md)** - 5-minute getting started guide
- **[🚀 FEATURES.md](./FEATURES.md)** - Complete feature documentation
- **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture
- **[🚢 DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment instructions

### Upcoming Features 🚧
- TradingView chart integration
- Historical P&L charts
- Cancel/modify open orders
- Advanced order types (OCO, Trailing Stop)
- Export trade history (CSV)
- Mobile app (React Native)
- Social trading features
- Leaderboard system

## 🏗️ Architecture

### Non-Custodial Trading Platform
```
┌─────────────────────────────────────────────────┐
│              Bang Perp Exchange                 │
│         (React Frontend Interface)              │
└──────────────┬──────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│     Solana Wallet Adapter                        │
│  (Phantom, Solflare - User Signs Transactions)  │
└──────────────┬───────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│         Drift Protocol Smart Contracts           │
│     (All Trading Logic + Fund Management)        │
└──────────────────────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│              Solana Blockchain                   │
│         (Transaction Settlement)                 │
└──────────────────────────────────────────────────┘
```

**Revenue Model**: Builder Code / Referral system through Drift Protocol (10-15% of trading fees, paid automatically on-chain)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Solana wallet (Phantom or Solflare browser extension)
- SOL for transaction fees (get from [Solana Faucet](https://faucet.solana.com/) for Devnet)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ivi374forivi/trading-perpetual-futures.git
   cd trading-perpetual-futures
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```ini
   VITE_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_DRIFT_ENV=devnet
   # Optional: Register for a Drift Builder Code at https://docs.drift.trade/partnerships/DBC
   VITE_DRIFT_BUILDER_CODE=
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Usage Guide

### 1. Connect Your Wallet
- Click the "Select Wallet" button in the top right
- Choose Phantom or Solflare
- Approve the connection in your wallet

### 2. Initialize Drift Protocol
- Once wallet is connected, the app will automatically initialize Drift Protocol
- **Important**: You must have a Drift user account. Create one at [drift.trade](https://drift.trade) first if needed

### 3. Trade Perpetual Futures
- Select a market (SOL-PERP, BTC-PERP, ETH-PERP)
- Enter the amount in USDC
- Choose leverage (1x-10x)
- Click **📈 LONG** (bet price goes up) or **📉 SHORT** (bet price goes down)
- Approve the transaction in your wallet

### 4. Monitor Your Position
- Transaction signatures will be displayed
- Check your positions on [drift.trade](https://drift.trade)

## 🛠️ Technical Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend Framework** | React 18 + Vite | Fast, modern web app |
| **Language** | TypeScript | Type safety |
| **Blockchain** | Solana (Devnet → Mainnet) | Fast, low-cost transactions |
| **Trading Protocol** | Drift Protocol SDK | Perpetual futures trading |
| **Wallet Integration** | @solana/wallet-adapter | Wallet connectivity |
| **Styling** | Tailwind CSS + DaisyUI | Meme-style UI |
| **Build Tool** | Vite | Fast builds and HMR |

## 📁 Project Structure

```
trading-perpetual-futures/
├── src/
│   ├── main.tsx                 # App entry point with wallet providers
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Global styles with Tailwind
│   ├── vite-env.d.ts            # TypeScript environment types
│   └── components/
│       ├── TradePanel.tsx       # Trading interface with Drift integration
│       └── RiskWarning.tsx      # Terms of Service and risk warnings
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration with polyfills
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind + DaisyUI config
├── postcss.config.js            # PostCSS configuration
└── .env.local                   # Environment variables (create this)
```

## 🔒 Security & Compliance

### Security Measures ✅
- ✅ No private key storage
- ✅ Users sign all transactions
- ✅ Input validation on all forms
- ✅ HTTPS only in production
- ✅ Environment variables secured

### Legal & Compliance 📋
- ✅ Terms of Service displayed
- ✅ Risk warnings on trading UI
- ✅ Non-custodial architecture (users control funds)
- ✅ Builder Code revenue model (referral fees only)

**Important**: This is a **NON-CUSTODIAL** platform. Users control their funds at all times. Drift Protocol handles compliance. We only earn referral fees through the Builder Code system.

## 💰 Revenue Model - Drift Builder Code

### How It Works
1. Register for a Drift Builder Code via [Drift Protocol Dashboard](https://docs.drift.trade/partnerships/DBC)
2. Receive a percentage of trading fees (typically 10-15%)
3. All revenue is paid on-chain automatically
4. No fund custody required
5. Fully compliant affiliate model

### Setup Steps
1. Visit Drift Protocol docs: https://docs.drift.trade/partnerships/DBC
2. Register for Builder Code
3. Obtain your public key
4. Add to `.env.local` as `VITE_DRIFT_BUILDER_CODE`
5. Verify attribution in Drift dashboard

## 🧪 Testing on Devnet

1. **Get Devnet SOL**
   - Visit [Solana Faucet](https://faucet.solana.com/)
   - Airdrop SOL to your wallet address

2. **Create Drift Account**
   - Visit [drift.trade](https://drift.trade) (switch to Devnet)
   - Create a user account
   - Get some USDC from Drift's faucet

3. **Test Trading**
   - Open the Bang Perp Exchange app
   - Connect your wallet
   - Try opening a small position
   - Verify the transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

## 🚢 Deployment

### Deploy to GitHub Pages

1. Update `vite.config.ts` with base path:
   ```typescript
   export default defineConfig({
     base: '/trading-perpetual-futures/',
     // ... rest of config
   })
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Deploy dist/ folder to GitHub Pages
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Production Checklist

Before deploying to mainnet:
- [ ] Switch `VITE_RPC_ENDPOINT` to mainnet RPC
- [ ] Update `VITE_DRIFT_ENV` to `mainnet-beta`
- [ ] Add your Drift Builder Code
- [ ] Test all features thoroughly
- [ ] Add analytics tracking
- [ ] Setup error monitoring
- [ ] Perform security audit
- [ ] Verify legal compliance in your jurisdiction

## 📚 Resources

### Documentation
- [Drift Protocol Docs](https://docs.drift.trade/)
- [Drift SDK](https://www.npmjs.com/package/@drift-labs/sdk)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Builder Code Info](https://docs.drift.trade/partnerships/DBC)
- [Solana Developer Docs](https://docs.solana.com/)

### Tools
- [Drift Protocol App](https://drift.trade)
- [Solana Explorer](https://explorer.solana.com/)
- [Solana Faucet](https://faucet.solana.com/)

## ⚠️ Risk Disclaimer

**IMPORTANT: Please Read Carefully**

Trading perpetual futures involves substantial risk of loss and is not suitable for everyone. Key risks include:

- **High Volatility**: Crypto markets are extremely volatile
- **Leverage Risk**: Leverage amplifies both gains and losses
- **Liquidation Risk**: You may lose more than your initial investment
- **Smart Contract Risk**: Despite audits, smart contract risks exist
- **Network Risk**: Blockchain congestion may affect execution

**Only trade with funds you can afford to lose completely.**

This platform is for educational and experimental purposes. Not financial advice. Do your own research. Consult a financial advisor before trading.

## 👥 Team

- **Project Lead**: 4444JPP
- **Repository**: ivi374forivi/trading-perpetual-futures

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ivi374forivi/trading-perpetual-futures/issues)
- **Drift Support**: [Drift Discord](https://discord.gg/driftprotocol)

---

**Status**: 🟢 Production Ready
**Version**: 2.0.0
**Last Updated**: 2025-11-18

**Built with ❤️ on Solana**
