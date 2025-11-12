# Architecture Decision Records (ADR) Backlog

This document tracks all Architecture Decision Records (ADRs) for the Bang Perp Exchange project, with a focus on documenting divergences from organization-wide standards.

## Purpose

This ADR backlog provides:
- Transparent documentation of architectural decisions
- Clear rationale for divergences from organization standards
- Historical context for future maintainers
- Alignment tracking with organizational policies

## Quick Links

- **ADR Template**: [docs/adr/0000-template.md](./adr/0000-template.md)
- **All ADRs**: [docs/adr/](./adr/)
- **Organization Standards**: [Internal Standards Documentation]

## ADR Index

### Active ADRs

| ID | Title | Status | Date | Diverges from Org Standard |
|----|-------|--------|------|---------------------------|
| [0001](./adr/0001-use-blockchain-storage-instead-of-database.md) | Use Blockchain Storage Instead of Database | Adopted | 2025-11-12 | ✅ Yes - Uses blockchain instead of PostgreSQL |
| [0002](./adr/0002-frontend-only-architecture.md) | Frontend-Only Architecture Without Backend API | Adopted | 2025-11-12 | ✅ Yes - No backend API server |

### Proposed ADRs

| ID | Title | Status | Date | Diverges from Org Standard |
|----|-------|--------|------|---------------------------|
| - | - | - | - | - |

### Deprecated ADRs

| ID | Title | Status | Date | Superseded By |
|----|-------|--------|------|---------------|
| - | - | - | - | - |

## Divergences from Organization Standards Summary

### Database Layer
- **Org Standard**: PostgreSQL for all data persistence
- **This Project**: Blockchain-based storage via Solana smart contracts
- **Rationale**: Non-custodial architecture requirement, no backend needed
- **ADR**: [0001](./adr/0001-use-blockchain-storage-instead-of-database.md)

### Backend Architecture
- **Org Standard**: Three-tier architecture with backend API
- **This Project**: Frontend-only SPA with direct blockchain interaction
- **Rationale**: Decentralization, cost reduction, standard dApp pattern
- **ADR**: [0002](./adr/0002-frontend-only-architecture.md)

## Process for Creating New ADRs

### When to Create an ADR

Create an ADR when:
1. Making architectural decisions that affect multiple components
2. Diverging from organization-wide standards
3. Choosing between multiple viable architectural approaches
4. Making decisions with long-term implications
5. Documenting decisions that future maintainers should understand

### How to Create an ADR

1. **Copy the template**:
   ```bash
   cp docs/adr/0000-template.md docs/adr/XXXX-your-decision-title.md
   ```

2. **Assign a number**: Use the next sequential number (0003, 0004, etc.)

3. **Fill out all sections**:
   - Clearly state the context and problem
   - Document the decision made
   - Explicitly note any divergence from org standards
   - List consequences (pros and cons)
   - Document alternatives considered
   - Add relevant references and links

4. **Set initial status**: Start with "Proposed"

5. **Get review**: 
   - Share with team for discussion
   - Reference in PR description
   - Link to relevant GitHub issues/discussions

6. **Update status**: Change to "Adopted" when approved

7. **Update this backlog**: Add entry to the appropriate section

### ADR Status Lifecycle

```
Proposed → Adopted → [Deprecated or Superseded]
```

- **Proposed**: Decision is under discussion
- **Adopted**: Decision is approved and implemented
- **Deprecated**: Decision is no longer recommended but still in use
- **Superseded**: Decision has been replaced by another ADR

## Review Schedule

ADRs should be reviewed:
- **Quarterly**: Review all active ADRs for continued relevance
- **Before major releases**: Ensure all architectural decisions are documented
- **When org standards change**: Assess impact on existing ADRs

## Key Architectural Principles

Based on our ADRs, these are the key principles guiding this project:

1. **Non-Custodial First**: Users always control their funds and private keys
2. **Decentralization**: Minimize centralized components
3. **Transparency**: All business logic visible and auditable
4. **Cost Efficiency**: Leverage blockchain to reduce infrastructure costs
5. **User Control**: Users sign all transactions explicitly
6. **Standard dApp Patterns**: Follow established Web3 best practices

## Alignment Strategy

While this project diverges from traditional organization standards, we maintain alignment through:

1. **Documentation**: All divergences are explicitly documented
2. **Rationale**: Clear business and technical justification provided
3. **Reversibility**: Consider migration paths where applicable
4. **Communication**: Regular updates to stakeholders
5. **Best Practices**: Follow industry standards for blockchain applications

## Questions or Concerns?

If you have questions about any architectural decisions or need clarification:

1. **Check the specific ADR**: Each ADR has detailed context and rationale
2. **Open a GitHub Discussion**: For general questions about architecture
3. **Open a GitHub Issue**: For concerns or suggestions
4. **Propose a new ADR**: If you think a decision should be reconsidered

## Contributing to ADRs

We welcome contributions to our architectural documentation:

- Suggest new ADRs for undocumented decisions
- Propose updates to existing ADRs
- Identify areas where ADRs would be beneficial
- Challenge decisions with well-reasoned alternatives

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Last Updated**: 2025-11-12  
**Document Owner**: Development Team  
**Review Frequency**: Quarterly
