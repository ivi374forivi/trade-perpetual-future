# ⚡ Quick Start Guide - Bang Perp Exchange

Get trading in 5 minutes! 💥

## 🎯 What You Need

- **Node.js** (version 18 or higher)
- **Solana Wallet** (Phantom or Solflare browser extension)
- **5 minutes** of your time

## 🚀 3-Step Setup

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/ivi374forivi/trading-perpetual-futures.git
cd trading-perpetual-futures

# Install dependencies
npm install
```

### Step 2: Configure Environment

Create a `.env.local` file in the root directory:

```ini
VITE_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_DRIFT_ENV=devnet
VITE_DRIFT_BUILDER_CODE=
```

**Note**: You can leave `VITE_DRIFT_BUILDER_CODE` empty for testing. To earn revenue, register for a [Drift Builder Code](https://docs.drift.trade/partnerships/DBC).

### Step 3: Start Trading!

```bash
# Start the development server
npm run dev
```

Open your browser to **http://localhost:5173** 🎉

## 📱 First Trade Walkthrough

### 1. Setup Your Wallet

**Get Devnet SOL**:
- Visit [Solana Faucet](https://faucet.solana.com/)
- Enter your wallet address
- Request 1 SOL (free for devnet)

**Create Drift Account**:
- Go to [drift.trade](https://drift.trade)
- Switch to Devnet (top right)
- Connect your wallet
- Create a user account
- Get some USDC from Drift's faucet

### 2. Connect Your Wallet

- Click **"Select Wallet"** button (top right)
- Choose **Phantom** or **Solflare**
- Approve the connection

### 3. Execute Your First Trade

1. **Select Market**: Choose SOL-PERP, BTC-PERP, or ETH-PERP
2. **Enter Amount**: Start with a small amount (e.g., 10 USDC)
3. **Choose Leverage**: Start with 1x or 2x for safety
4. **Pick Direction**:
   - 📈 **LONG** if you think price will go UP
   - 📉 **SHORT** if you think price will go DOWN
5. **Approve Transaction**: Sign in your wallet
6. **Done!** 💥 Your position is now open

## 🎮 Understanding the Interface

### Trading Panel

```
┌─────────────────────────────────┐
│ 🎯 Trade Perpetual Futures      │
├─────────────────────────────────┤
│ Market: [SOL-PERP ▼]            │
│ Amount: [10] USDC               │
│ Leverage: [••••••] 5x           │
│                                 │
│  [📈 LONG]    [📉 SHORT]        │
│                                 │
│ Position Size: $50.00           │
│ ($10 × 5x leverage)             │
└─────────────────────────────────┘
```

### Key Elements

- **Market Selector**: Choose which asset to trade
- **Amount Input**: How much USDC to use
- **Leverage Slider**: Multiply your position (1x-10x)
- **LONG/SHORT Buttons**: Execute trades
- **Position Size**: Shows your total exposure

## 💡 Trading Tips

### For Beginners

1. **Start Small**: Use small amounts while learning
2. **Low Leverage**: Stick to 1x-2x initially
3. **Understand Risk**: You can lose money
4. **Practice First**: Test thoroughly on Devnet
5. **Do Research**: Learn about perpetual futures

### Understanding Leverage

- **1x**: No leverage (1:1 exposure)
- **5x**: 5× your position size (5× potential profit/loss)
- **10x**: 10× your position size (⚠️ high risk)

**Example**:
- You deposit: $10 USDC
- Leverage: 5x
- Position size: $50
- If market moves 1%, you gain/lose: $0.50 (5% of your deposit)

### Risk Management

⚠️ **Important Reminders**:
- Only trade what you can afford to lose
- Higher leverage = higher risk
- Markets are volatile
- Past performance ≠ future results
- This is experimental software

## 🛠️ Troubleshooting

### Wallet Won't Connect

- ✅ Check browser extension is installed
- ✅ Refresh the page
- ✅ Try a different wallet
- ✅ Clear browser cache

### "Drift user account not found"

- ✅ Visit [drift.trade](https://drift.trade)
- ✅ Switch to Devnet
- ✅ Create a user account first

### Transaction Fails

- ✅ Check you have SOL for transaction fees
- ✅ Verify you have enough USDC
- ✅ Try lowering the amount
- ✅ Check Drift Protocol status

### Build Errors

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 What's Next?

### Learn More
- Read the full [README.md](./README.md)
- Review [ROADMAP.md](./ROADMAP.md) for project vision and development timeline
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production
- Review [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

### Customize
- Change the theme in `tailwind.config.js`
- Modify markets in `TradePanel.tsx`
- Add your branding to `App.tsx`

### Deploy
- Deploy to [GitHub Pages](./DEPLOYMENT_GUIDE.md#-github-pages-deployment)
- Deploy to [Vercel](./DEPLOYMENT_GUIDE.md#-vercel-deployment)
- Deploy to [Netlify](./DEPLOYMENT_GUIDE.md#-netlify-deployment)

### Earn Revenue
1. Register for [Drift Builder Code](https://docs.drift.trade/partnerships/DBC)
2. Add code to `.env.local`
3. Earn 10-15% of trading fees automatically!

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Drift Protocol** | https://drift.trade |
| **Builder Code** | https://docs.drift.trade/partnerships/DBC |
| **Solana Faucet** | https://faucet.solana.com |
| **Solana Explorer** | https://explorer.solana.com/?cluster=devnet |
| **Phantom Wallet** | https://phantom.app |
| **Solflare Wallet** | https://solflare.com |

## 💬 Need Help?

- **GitHub Issues**: [Open an issue](https://github.com/ivi374forivi/trading-perpetual-futures/issues)
- **Drift Discord**: [Join community](https://discord.gg/driftprotocol)
- **Documentation**: Read the [full docs](./README.md)

## 🎉 You're Ready!

Now you know how to:
- ✅ Setup the development environment
- ✅ Connect your wallet
- ✅ Execute trades on Drift Protocol
- ✅ Manage risk
- ✅ Troubleshoot issues

**Happy trading! 💥**

---

**⚠️ Disclaimer**: This is for educational purposes. Trading involves risk. Only trade what you can afford to lose. Not financial advice.