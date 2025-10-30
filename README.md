# Bang Perp Exchange

Bang Perp Exchange - A meme-style Solana perpetual trading site. Users connect wallets (Phantom/Solflare) and trade perps via Drift Protocol. Non-custodial architecture with Builder Code revenue. Built with React + Vite + TypeScript.

![Bang Perp Exchange](https://github.com/user-attachments/assets/cea3bbaa-2386-4d2e-b04f-1f0074b56b1e)

## Features

- 🚀 **Solana Perpetual Futures Trading** - Powered by Drift Protocol
- 👛 **Multi-Wallet Support** - Phantom and Solflare wallets
- 💰 **Non-Custodial** - You control your keys and sign your own transactions
- 🎨 **Meme-Style UI** - Black and gold theme with Tailwind CSS
- 🔧 **Modern Stack** - React 19 + Vite 7 + TypeScript
- 🧪 **Devnet Ready** - Connected to Solana Devnet for testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Solana wallet (Phantom or Solflare browser extension)
- Some SOL on Devnet (get from [Solana Faucet](https://faucet.solana.com/))

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Blockchain**: Solana (Devnet)
- **Wallet Integration**: @solana/wallet-adapter
- **Trading Protocol**: Drift Protocol (@drift-labs/sdk-browser)

## Architecture

- **Non-Custodial**: All transactions are signed by the user's wallet
- **Devnet**: Currently configured for Solana Devnet
- **Builder Code**: Includes Drift Builder Code "BANGPERP" for fee collection

## Usage

1. Click "Select Wallet" to connect your Phantom or Solflare wallet
2. Ensure you're connected to Solana Devnet
3. Enter the amount of SOL you want to trade
4. Set your desired leverage (1-10x)
5. Click "LONG" to go long or "SHORT" to go short
6. Confirm the transaction in your wallet

## Deployment

This project can be deployed to:
- **GitHub Pages**: Use `npm run build` and deploy the `dist` folder
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect your repository

## License

MIT
