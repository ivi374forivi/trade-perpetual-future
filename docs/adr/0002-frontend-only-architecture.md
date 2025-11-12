# ADR-0002: Frontend-Only Architecture Without Backend API

**Status**: Adopted  
**Date**: 2025-11-12  
**Deciders**: Development Team, Technical Lead  
**Related Issues/PRs**: N/A

## Context

Organization standards typically mandate a three-tier architecture with:
- Frontend (React/Vue)
- Backend API (Node.js/Express or similar)
- Database layer (PostgreSQL)

This ensures:
- Separation of concerns
- Business logic in backend
- Security through server-side validation
- Standardized API patterns across projects

However, Bang Perp Exchange is a decentralized application (dApp) that interacts directly with blockchain smart contracts.

## Decision

We have decided to build a **fully client-side application** without a traditional backend API server. All blockchain interactions happen directly from the browser using Solana Web3.js and Drift Protocol SDK.

## Divergence from Organization Standards

**Organization Standard**: Three-tier architecture with backend API (e.g., Express.js REST API)  
**This Project**: Single-page application (SPA) with direct blockchain interaction  
**Rationale**:
- Non-custodial requirement means no server should have access to user funds
- Smart contracts provide all business logic
- Wallet adapters handle authentication
- Reduces infrastructure costs (no server hosting)
- Faster development cycle
- Eliminates server as single point of failure
- Standard pattern for decentralized applications

## Consequences

### Pros
- True decentralization (no centralized server)
- Lower operational costs (static hosting only)
- Simplified deployment (CDN/GitHub Pages/Vercel)
- Automatic scaling via CDN
- No server maintenance required
- Faster time to market
- Users interact directly with blockchain (transparency)
- No API rate limiting from own servers

### Cons
- All business logic exposed in frontend code
- Cannot implement server-side features like:
  - Complex analytics processing
  - Scheduled jobs/cron tasks
  - Email notifications
  - Server-side data aggregation
- Limited ability to cache blockchain data
- Dependent on RPC endpoint availability
- Cannot implement traditional authentication flows

### Relationship to Org Standards
- Major architectural divergence from standard three-tier pattern
- Aligns with Web3/blockchain architecture best practices
- May not be suitable for hybrid Web2/Web3 applications
- Sets precedent for future dApp projects in organization

## Alternatives Considered

1. **Hybrid Architecture with Optional Backend**: Build backend API for analytics and caching while keeping core trading client-side
   - Rejected for MVP: Adds complexity without clear immediate benefit
   - Could be added later if analytics features are needed
   - Would still keep trading logic client-side

2. **Backend Proxy for RPC Calls**: Route all blockchain calls through backend proxy
   - Rejected: Creates centralization point
   - Adds latency
   - No significant benefit for current use case

3. **Serverless Functions for Non-Critical Features**: Use AWS Lambda/Vercel Functions for optional features
   - Under consideration for future features like:
     - Email notifications
     - Price alerts
     - Historical data analysis
   - Not needed for core trading functionality

## References

- [JAMstack Architecture](https://jamstack.org/)
- [Decentralized Application (dApp) Architecture](https://ethereum.org/en/developers/docs/dapps/)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- Organization Standards: Three-Tier Architecture Guidelines

## Notes

- This decision is reversible for non-critical features
- Core trading logic must remain client-side to maintain non-custodial guarantee
- Consider serverless functions if features like price alerts are added
- Static hosting significantly reduces costs compared to traditional hosting
- Security focus shifts from server hardening to smart contract security and frontend validation
- Consider implementing service worker for offline support in future iterations
