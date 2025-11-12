# Contributing to Bang Perp Exchange

Thank you for your interest in contributing to Bang Perp Exchange! This document provides guidelines and instructions for contributing.

## 📚 Quick Links

- **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Community standards and behavior expectations
- **[Security Policy](./SECURITY.md)** - How to report security vulnerabilities
- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Complete guide to all project documentation
- **[Architecture](./ARCHITECTURE.md)** - Technical architecture overview

## 🎯 Code of Conduct

All contributors must follow our [Code of Conduct](./CODE_OF_CONDUCT.md). Be respectful, inclusive, and professional. We're building something cool together!

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- A Solana wallet (Phantom or Solflare) for testing
- Basic knowledge of React, TypeScript, and Solana

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/trading-perpetual-futures.git
   cd trading-perpetual-futures
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local`**
   ```ini
   VITE_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_DRIFT_ENV=devnet
   VITE_DRIFT_BUILDER_CODE=
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm run lint
   npm run build
   ```

## 📝 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Lint your code
npm run lint

# Build to check for errors
npm run build

# Test in development
npm run dev
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add position closing functionality"
git commit -m "fix: resolve wallet connection issue"
git commit -m "docs: update README with new examples"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Detailed description of what and why
- Screenshots for UI changes
- Reference any related issues

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use enums for constants

```typescript
// Good
interface TradeParams {
  amount: number
  leverage: number
  direction: PositionDirection
}

// Avoid
function trade(params: any) { }
```

### React Components

- Use functional components with hooks
- Keep components focused and small
- Use meaningful prop names
- Add prop types with TypeScript

```typescript
// Good
interface TradePanelProps {
  onTradeComplete?: (txSig: string) => void
}

function TradePanel({ onTradeComplete }: TradePanelProps) {
  // ...
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Use DaisyUI components when possible
- Keep custom CSS minimal
- Maintain the meme-style aesthetic

```tsx
// Good
<button className="btn btn-primary btn-lg">
  💥 Trade
</button>

// Avoid inline styles unless necessary
<button style={{ backgroundColor: 'red' }}>Trade</button>
```

### File Organization

```
src/
├── components/      # Reusable UI components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript types/interfaces
└── constants/      # Constants and configs
```

## 🐛 Bug Reports

### Before Reporting

1. Check if the issue already exists
2. Test on the latest version
3. Verify it's not an environment issue

### What to Include

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, wallet
- **Screenshots**: If applicable
- **Console Logs**: Any error messages

Example:

```markdown
**Bug**: Wallet connection fails on Firefox

**Steps to Reproduce**:
1. Open app in Firefox
2. Click "Select Wallet"
3. Choose Phantom

**Expected**: Wallet connects successfully
**Actual**: Connection timeout error

**Environment**:
- Firefox 120
- Phantom v23.17.0
- macOS 14.0

**Error**: `Connection timeout after 30s`
```

## 💡 Feature Requests

### What Makes a Good Feature Request

- **Clear Use Case**: Why is this needed?
- **User Benefit**: Who benefits and how?
- **Technical Feasibility**: Is it technically possible?
- **Scope**: Is it focused and well-defined?

Example:

```markdown
**Feature**: Add stop-loss orders

**Use Case**: Users want to automatically close positions at a specific price to limit losses

**Benefits**:
- Risk management for traders
- Reduces need for constant monitoring
- Standard feature in trading platforms

**Proposed Implementation**:
- Add stop-loss price input in TradePanel
- Use Drift Protocol's trigger orders
- Display active stop-loss orders in position list
```

## 🔒 Security

### Reporting Security Issues

**Do NOT create public issues for security vulnerabilities.**

Instead:
1. Email security concerns to the maintainers
2. Provide detailed information
3. Allow time for a fix before disclosure

### Security Best Practices

- Never commit private keys or secrets
- Validate all user inputs
- Sanitize data before display
- Use environment variables for sensitive data
- Keep dependencies updated

## 📚 Documentation

### What to Document

- New features
- API changes
- Configuration options
- Complex algorithms
- Deployment procedures

### Documentation Style

- Use clear, simple language
- Include code examples
- Add screenshots for UI features
- Keep it up to date

## ✅ Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows the style guidelines
- [ ] All linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are tested locally
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear
- [ ] PR description is detailed
- [ ] Screenshots included for UI changes

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in commits

## 📞 Getting Help

### Resources

- [Drift Protocol Docs](https://docs.drift.trade/)
- [Solana Developer Docs](https://docs.solana.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community

- GitHub Discussions
- GitHub Issues
- Drift Protocol Discord

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Bang Perp Exchange! 💥**

Your contributions help make decentralized trading better for everyone.