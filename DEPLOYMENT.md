# 🚀 Bang Perp Exchange - Deployment Guide

Quick deployment guide for Bang Perp Exchange v2.0. Choose your preferred platform below.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ Built the application locally (`npm run build`)
- ✅ Tested on Devnet
- ✅ Created a Drift user account
- ✅ (Optional) Registered for Drift Builder Code
- ⚠️ Decided on environment (Devnet for testing, Mainnet for production)

---

## 🎯 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest) ⭐

**Deployment Time**: ~2 minutes

1. **Push to GitHub** (already done ✅)

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub account
   - Select `ivi374forivi/trade-perpetual-future` repository

3. **Configure Environment Variables**
   ```
   VITE_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_DRIFT_ENV=devnet
   VITE_DRIFT_BUILDER_CODE=<your-builder-code>
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait ~1 minute
   - Your site is live! 🎉

**URL**: `https://your-project.vercel.app`

---

### Option 2: Netlify (Also Easy) ⭐

**Deployment Time**: ~3 minutes

1. **Push to GitHub** (already done ✅)

2. **Go to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_RPC_ENDPOINT=https://api.devnet.solana.com
     VITE_DRIFT_ENV=devnet
     VITE_DRIFT_BUILDER_CODE=<your-builder-code>
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait ~2 minutes
   - Your site is live! 🎉

**URL**: `https://your-project.netlify.app`

---

### Option 3: GitHub Pages (Free) 💰

**Deployment Time**: ~5 minutes

Your repository already has GitHub Actions set up!

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" (left sidebar)
   - Under "Build and deployment":
     - Source: "GitHub Actions"

2. **Add Environment Secrets**
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add these secrets:
     ```
     VITE_RPC_ENDPOINT = https://api.devnet.solana.com
     VITE_DRIFT_ENV = devnet
     VITE_DRIFT_BUILDER_CODE = <your-builder-code>
     ```

3. **Deploy**
   - Push to `main` branch (or manually trigger workflow)
   ```bash
   git checkout main
   git merge claude/consolidate-and-plan-01LhJ4t8tdXYN45iPLm2mUFu
   git push origin main
   ```
   - GitHub Actions will automatically build and deploy
   - Check Actions tab for progress

4. **Access Your Site**
   - After ~3 minutes, visit:
   - `https://ivi374forivi.github.io/trade-perpetual-future/`

---

## 🔧 Environment Configuration

### For Devnet Testing (Recommended First)

```bash
VITE_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_DRIFT_ENV=devnet
VITE_DRIFT_BUILDER_CODE=  # Optional for testing
```

### For Mainnet Production

```bash
VITE_RPC_ENDPOINT=https://your-premium-rpc.com  # Use QuickNode, Helius, etc.
VITE_DRIFT_ENV=mainnet-beta
VITE_DRIFT_BUILDER_CODE=<your-registered-builder-code>
```

**Important for Mainnet**:
- ⚠️ Use a premium RPC endpoint (not public)
- ⚠️ Register Drift Builder Code first
- ⚠️ Test thoroughly on Devnet before switching

---

## 🔑 Getting a Drift Builder Code

1. Visit [Drift Protocol Documentation](https://docs.drift.trade/partnerships/DBC)
2. Read the Builder Code partnership information
3. Apply for a Builder Code
4. Once approved, add it to your environment variables
5. You'll earn 10-15% of trading fees automatically!

---

## 🎯 Post-Deployment Steps

### 1. Verify Deployment ✅

Visit your deployed URL and check:
- ✅ Site loads correctly
- ✅ Wallet connects (Phantom/Solflare)
- ✅ Drift initializes
- ✅ Can place test trades
- ✅ Real-time prices updating
- ✅ All tabs working (Trade, Positions, Orders, Analytics)

### 2. Test on Devnet 🧪

Before going to mainnet:
- Connect your wallet
- Get devnet SOL from [faucet](https://faucet.solana.com)
- Create Drift account at [drift.trade](https://drift.trade)
- Get devnet USDC from Drift faucet
- Place test orders (Market, Limit, Stop)
- Verify position management works
- Check order history
- Review P&L analytics

### 3. Monitor Performance 📊

- Check browser console for errors
- Monitor transaction success rate
- Verify all features working
- Test on different devices/browsers

---

## 🔄 Continuous Deployment

All platforms support automatic deployment on git push:

**Vercel/Netlify**:
- Push to `main` branch
- Auto-deploys in ~1-2 minutes

**GitHub Pages**:
- Push to `main` branch
- GitHub Actions builds and deploys
- Check Actions tab for status

---

## 🆘 Troubleshooting

### Build Fails

**Issue**: Build fails with TypeScript errors
**Solution**:
```bash
npm install
npm run build
```
Fix any TypeScript errors locally first

### Environment Variables Not Working

**Issue**: Site loads but wallet/trading doesn't work
**Solution**:
- Verify environment variables are set in platform settings
- Check they start with `VITE_` prefix
- Redeploy after adding variables

### RPC Errors

**Issue**: "RPC request failed" errors
**Solution**:
- Use a premium RPC endpoint for mainnet
- Devnet public RPC can be rate-limited
- Consider QuickNode, Helius, or Alchemy

### Drift Initialization Fails

**Issue**: "Drift user account not found"
**Solution**:
- Create account at [drift.trade](https://drift.trade) first
- Ensure you're on correct network (devnet/mainnet)
- Check RPC endpoint is correct

---

## 📊 Deployment Comparison

| Platform | Speed | Cost | Auto-Deploy | Custom Domain | Best For |
|----------|-------|------|-------------|---------------|----------|
| **Vercel** | ⚡⚡⚡ | Free | ✅ | ✅ | Production |
| **Netlify** | ⚡⚡ | Free | ✅ | ✅ | Production |
| **GitHub Pages** | ⚡ | Free | ✅ | ✅ | Testing/Demo |

**Recommendation**: Use Vercel for best performance and easiest setup.

---

## 🎉 You're Live!

Once deployed, your professional trading platform is live and ready to:
- ✅ Accept real traders
- ✅ Execute real trades
- ✅ Earn referral fees (with Builder Code)
- ✅ Scale automatically

**Next**: Share your platform URL and start onboarding users!

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ivi374forivi/trade-perpetual-future/issues)
- **Drift Support**: [Drift Discord](https://discord.gg/driftprotocol)
- **Documentation**: [FEATURES.md](./FEATURES.md), [README.md](./README.md)

---

**Good luck with your deployment! 🚀**

**Remember**: Start with Devnet, test thoroughly, then move to Mainnet!
