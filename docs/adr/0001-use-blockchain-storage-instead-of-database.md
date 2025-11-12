# ADR-0001: Use NoSQL Database Instead of Relational Database

**Status**: Adopted  
**Date**: 2025-11-12  
**Deciders**: Development Team, Technical Lead  
**Related Issues/PRs**: N/A

## Context

The organization standard specifies the use of relational databases (PostgreSQL) for all data storage needs to ensure consistency, ACID compliance, and standardized tooling across projects. However, this project (Bang Perp Exchange) is a fully client-side, non-custodial trading platform built on Solana blockchain.

The application architecture is fundamentally different from typical backend-driven applications:
- No backend server
- No traditional database layer
- All state managed on-chain via Solana blockchain
- User data stored in wallet and smart contracts

## Decision

We have decided to **not use a traditional database** (neither SQL nor NoSQL) and instead rely entirely on blockchain-based storage through the Drift Protocol smart contracts on Solana.

## Divergence from Organization Standards

**Organization Standard**: PostgreSQL or another relational database for persistent data storage  
**This Project**: Blockchain-based storage via Solana and Drift Protocol smart contracts  
**Rationale**: 
- Non-custodial architecture requires on-chain state management
- No backend server to host a database
- User positions, balances, and trades are stored in smart contracts
- Wallet-first architecture where users control their own data
- Reduces infrastructure costs and complexity
- Eliminates single point of failure

## Consequences

### Pros
- True non-custodial architecture (users control funds)
- No database infrastructure to maintain
- Eliminates data breach risks (no centralized database)
- Automatic data replication across Solana network
- Transparent and auditable on-chain
- Lower operational costs
- Stateless frontend application

### Cons
- Cannot perform complex queries across blockchain data
- Higher read latency compared to traditional databases
- Transaction costs for state changes
- Limited by blockchain performance characteristics
- Requires RPC endpoints for data access

### Relationship to Org Standards
- This is a fundamental architectural divergence necessary for blockchain applications
- No future migration path planned to relational database
- This pattern is standard for decentralized applications (dApps)
- May establish precedent for future blockchain projects

## Alternatives Considered

1. **Hybrid Approach (Database + Blockchain)**: Use PostgreSQL for caching and analytics while keeping source of truth on-chain
   - Rejected: Adds unnecessary complexity for MVP
   - Could be reconsidered for analytics dashboard in future

2. **Off-chain Database with Periodic Blockchain Sync**: Store data in PostgreSQL and sync to blockchain periodically
   - Rejected: Violates non-custodial principle
   - Creates trust issues and centralization risks

3. **IPFS for Non-critical Data**: Use IPFS for user preferences/settings and blockchain only for financial data
   - Rejected: Not needed for current scope
   - Could be considered for future features like user avatars

## References

- [Drift Protocol Documentation](https://docs.drift.trade/)
- [Solana Account Model](https://docs.solana.com/developing/programming-model/accounts)
- [Non-Custodial Architecture Best Practices](https://docs.solana.com/developing/intro/programs)
- Organization Standards: Internal Database Guidelines

## Notes

- This ADR documents a fundamental architectural principle of the project
- Future features requiring complex analytics may need additional data storage solutions
- Consider using The Graph protocol or similar indexing services if complex queries are needed
- RPC endpoint choice is critical for performance (consider premium providers for production)
