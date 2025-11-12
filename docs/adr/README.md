# Architecture Decision Records (ADR)

This directory contains Architecture Decision Records (ADRs) for the Bang Perp Exchange project.

## What are ADRs?

Architecture Decision Records are documents that capture important architectural decisions made during the project, along with their context and consequences. They help:

- **Future developers** understand why things are the way they are
- **Current team** align on architectural approach
- **Stakeholders** track divergences from organizational standards
- **Everyone** learn from past decisions

## Structure

Each ADR follows a standard template and includes:

- **Context**: Why was this decision needed?
- **Decision**: What did we decide?
- **Consequences**: What are the pros and cons?
- **Alternatives**: What else did we consider?
- **Divergences**: How does this differ from org standards?

## Index

### Template
- [0000-template.md](./0000-template.md) - Use this as a starting point for new ADRs

### Active ADRs
- [0001-use-blockchain-storage-instead-of-database.md](./0001-use-blockchain-storage-instead-of-database.md) - Why we use blockchain instead of traditional databases
- [0002-frontend-only-architecture.md](./0002-frontend-only-architecture.md) - Why we don't have a backend API

## Creating a New ADR

1. Copy the template:
   ```bash
   cp 0000-template.md XXXX-your-decision-title.md
   ```

2. Use the next sequential number (e.g., 0003, 0004)

3. Fill in all sections with thoughtful detail

4. Start with status "Proposed"

5. Update [../adr-backlog.md](../adr-backlog.md) with the new ADR

6. Submit as part of a PR for review

## ADR Naming Convention

Format: `XXXX-short-descriptive-title.md`

Examples:
- `0001-use-blockchain-storage-instead-of-database.md`
- `0002-frontend-only-architecture.md`
- `0003-adopt-typescript-for-type-safety.md`

## More Information

For more details, see the [ADR Backlog](../adr-backlog.md).
