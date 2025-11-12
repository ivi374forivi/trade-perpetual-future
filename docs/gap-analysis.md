# 📊 Gap Analysis Template

## Purpose

This template is designed to perform gap analysis between a project's current state and the organization's reference architecture and engineering guidelines. Use this template to identify and categorize gaps, prioritize implementation work, and align projects with organizational standards.

## How to Use This Template

1. **List Current Features/Components**: Document what currently exists in the project
2. **Compare with Organization Standards**: Review against org-wide architecture and engineering guidelines
3. **Categorize Each Gap**: Assign priority labels to each item
4. **Create Action Plan**: Develop a roadmap based on priorities

## Priority Categories

| Priority | Description | Action Timeline |
|----------|-------------|-----------------|
| **Core** | Critical features/components that must meet org security and architecture standards. These are required for production deployment. | Immediate - Must be addressed before launch |
| **Nice-to-have** | Optional enhancements that improve quality, user experience, or maintainability but are not blocking. | Post-launch - Schedule based on capacity |
| **Deferred** | Items planned for future phases or versions. Important but not currently prioritized. | Future - Revisit in next planning cycle |

## Gap Analysis Checklist

### Initial Assessment
- [ ] List all current features/components
- [ ] Review organization-wide architecture guidelines
- [ ] Review organization-wide engineering standards
- [ ] Review security requirements
- [ ] Review compliance requirements
- [ ] Review documentation standards

### Gap Identification
- [ ] Compare current state with architecture reference
- [ ] Identify missing security features
- [ ] Identify missing compliance features
- [ ] Identify documentation gaps
- [ ] Identify testing gaps
- [ ] Identify monitoring and observability gaps

### Categorization
- [ ] Label all items with priority ('core', 'nice-to-have', 'deferred')
- [ ] Validate priorities with stakeholders
- [ ] Estimate effort for each core item
- [ ] Create implementation roadmap

### Deliverable
- [ ] Complete gap analysis document
- [ ] Share with team and stakeholders
- [ ] Create tracking issues for core gaps
- [ ] Schedule regular reviews

---

## Gap Analysis: [Project Name]

**Project**: _[Enter project name]_  
**Date**: _[YYYY-MM-DD]_  
**Reviewer**: _[Your name/team]_  
**Version**: _[Project version]_

### Executive Summary

_Provide a brief overview of the current state, key gaps identified, and high-level recommendations._

---

## Current State Overview

### Existing Features/Components

_List the major features, components, and capabilities currently implemented in the project._

- Feature/Component 1
- Feature/Component 2
- Feature/Component 3
- ...

### Technology Stack

_Document the current technology stack._

| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| Frontend | | | |
| Backend | | | |
| Database | | | |
| Infrastructure | | | |

---

## Organization Standards Reference

### Architecture Standards
- [ ] Reference architecture document reviewed
- [ ] Design patterns documented
- [ ] Component structure guidelines

### Engineering Standards
- [ ] Code quality standards
- [ ] Testing requirements
- [ ] Documentation requirements
- [ ] Security requirements
- [ ] Performance requirements

---

## Detailed Gap Analysis

### Security & Compliance

| Feature/Component | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|-------------------|----------------|-----|----------|-------|-------|-------------|
| Authentication | Implemented | Must meet org SSO standards | Core | Need to integrate with corporate IdP | Security Team | 2 weeks |
| Authorization | Partial | RBAC not implemented | Core | Required for compliance | Backend Team | 1 week |
| Audit Logging | Missing | All actions must be logged | Core | Compliance requirement | Backend Team | 3 days |
| Data Encryption | Partial | At-rest encryption missing | Core | Security standard | Infra Team | 1 week |
| Security Scanning | Missing | SAST/DAST required | Nice-to-have | Best practice | DevOps | 2 days |
| Penetration Testing | Not Scheduled | Annual pen test required | Core | Schedule for Q2 | Security Team | 1 week |

### Architecture & Design

| Feature/Component | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|-------------------|----------------|-----|----------|-------|-------|-------------|
| API Design | Implemented | Doesn't follow org REST standards | Core | Need to refactor endpoints | Backend Team | 1 week |
| Service Layer | Missing | Business logic in controllers | Core | Architecture standard | Backend Team | 2 weeks |
| Error Handling | Partial | Inconsistent error responses | Nice-to-have | UX improvement | Full Stack | 3 days |
| Caching Strategy | Missing | Performance optimization needed | Nice-to-have | Scale consideration | Backend Team | 1 week |
| Database Migrations | Manual | Need automated migration system | Core | Deployment requirement | DevOps | 3 days |

### Code Quality & Testing

| Feature/Component | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|-------------------|----------------|-----|----------|-------|-------|-------------|
| Unit Tests | 45% coverage | Org standard is 80% minimum | Core | CI will block deploys | All Teams | 2 weeks |
| Integration Tests | Missing | Required for critical paths | Core | Quality gate | QA Team | 1 week |
| E2E Tests | Missing | Needed for UI flows | Nice-to-have | Prevents regressions | QA Team | 1 week |
| Code Linting | Configured | Need to match org ESLint config | Nice-to-have | Code consistency | Frontend Team | 1 day |
| Performance Tests | Missing | Required for high-traffic APIs | Deferred | Plan for v2.0 | QA Team | 1 week |

### Documentation

| Feature/Component | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|-------------------|----------------|-----|----------|-------|-------|-------------|
| API Documentation | Partial | Need OpenAPI/Swagger spec | Core | Developer experience | Backend Team | 3 days |
| Architecture Docs | Missing | Required for onboarding | Core | Team knowledge | Tech Lead | 1 week |
| Runbooks | Missing | Operational documentation | Core | On-call support | DevOps | 3 days |
| User Guides | Partial | Need to expand for all features | Nice-to-have | User adoption | Product | 1 week |
| Code Comments | Sparse | Complex logic needs documentation | Nice-to-have | Maintainability | All Teams | Ongoing |

### Infrastructure & Operations

| Feature/Component | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|-------------------|----------------|-----|----------|-------|-------|-------------|
| CI/CD Pipeline | Basic | Need automated testing stages | Core | Deployment safety | DevOps | 1 week |
| Monitoring | Basic | Need APM and custom metrics | Core | Observability requirement | DevOps | 1 week |
| Alerting | Missing | Need on-call alert system | Core | Incident response | DevOps | 3 days |
| Log Aggregation | Missing | Centralized logging required | Core | Debugging and compliance | DevOps | 3 days |
| Backup & Recovery | Manual | Automated backup required | Core | Business continuity | DevOps | 3 days |
| Disaster Recovery | Missing | DR plan and testing needed | Nice-to-have | Risk mitigation | DevOps | 2 weeks |
| Auto-scaling | Missing | Required for production load | Deferred | Performance optimization | Infra Team | 1 week |

### Performance & Scalability

| Feature/Component | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|-------------------|----------------|-----|----------|-------|-------|-------------|
| Load Testing | Not Done | Must validate 10k concurrent users | Core | Launch requirement | QA/DevOps | 1 week |
| Database Indexing | Basic | Query optimization needed | Nice-to-have | Performance improvement | Backend Team | 3 days |
| CDN Integration | Missing | Static assets optimization | Nice-to-have | User experience | Frontend Team | 2 days |
| API Rate Limiting | Missing | Prevent abuse | Core | Security + stability | Backend Team | 2 days |
| Caching Headers | Missing | Browser caching optimization | Nice-to-have | Performance | Frontend Team | 1 day |

### User Experience

| Feature/Component | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|-------------------|----------------|-----|----------|-------|-------|-------------|
| Responsive Design | Partial | Mobile optimization needed | Nice-to-have | User base is 40% mobile | Frontend Team | 1 week |
| Accessibility | Not Tested | WCAG 2.1 AA compliance required | Core | Legal requirement | Frontend Team | 2 weeks |
| Internationalization | Missing | Multi-language support planned | Deferred | Phase 2 feature | Frontend Team | 3 weeks |
| Dark Mode | Missing | User-requested feature | Nice-to-have | User preference | Frontend Team | 3 days |
| Loading States | Inconsistent | Better UX for async operations | Nice-to-have | Polish | Frontend Team | 2 days |

---

## Compliance & Legal

| Requirement | Current Status | Gap | Priority | Notes | Owner | Est. Effort |
|------------|----------------|-----|----------|-------|-------|-------------|
| GDPR Compliance | Partial | Need data deletion API | Core | EU users | Backend Team | 1 week |
| Terms of Service | Draft | Legal review pending | Core | Launch blocker | Legal/Product | 1 week |
| Privacy Policy | Draft | Legal review pending | Core | Launch blocker | Legal/Product | 1 week |
| Cookie Consent | Missing | Required for EU users | Core | GDPR requirement | Frontend Team | 2 days |
| Data Residency | Not Addressed | May need EU data center | Deferred | Cost consideration | Infra Team | TBD |

---

## Priority Summary

### Core Items (Must Fix Before Production)

**Total Core Items**: _[Count]_  
**Estimated Total Effort**: _[Sum of estimates]_

1. _[List all core priority items]_
2. _[...]_
3. _[...]_

**Recommended Action**: These items must be completed before production launch. Consider delaying launch if cannot be completed in time.

### Nice-to-have Items (Post-Launch Improvements)

**Total Nice-to-have Items**: _[Count]_  
**Estimated Total Effort**: _[Sum of estimates]_

1. _[List all nice-to-have items]_
2. _[...]_
3. _[...]_

**Recommended Action**: Schedule these items in the first maintenance sprint after launch. Prioritize based on user feedback and business impact.

### Deferred Items (Future Phases)

**Total Deferred Items**: _[Count]_

1. _[List all deferred items]_
2. _[...]_
3. _[...]_

**Recommended Action**: Add to product backlog for future consideration. Revisit during next major version planning.

---

## Implementation Roadmap

### Phase 1: Critical Gaps (Before Production)
**Timeline**: _[Weeks]_  
**Focus**: Core security, compliance, and stability items

- [ ] Item 1 (2 weeks)
- [ ] Item 2 (1 week)
- [ ] Item 3 (3 days)

### Phase 2: Quality Improvements (Post-Launch)
**Timeline**: _[Weeks]_  
**Focus**: Nice-to-have items that improve quality and UX

- [ ] Item 1 (1 week)
- [ ] Item 2 (3 days)
- [ ] Item 3 (2 days)

### Phase 3: Future Enhancements (Next Version)
**Timeline**: _[Months]_  
**Focus**: Deferred items for major version releases

- [ ] Item 1 (TBD)
- [ ] Item 2 (TBD)

---

## Risks & Blockers

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| _[e.g., Legal review delays]_ | High | Medium | _[e.g., Start review early]_ | _[Legal]_ |
| _[e.g., Third-party dependency]_ | Medium | Low | _[e.g., Have fallback ready]_ | _[Backend Team]_ |

---

## Recommendations

### Immediate Actions
1. _[e.g., Schedule architecture review meeting]_
2. _[e.g., Begin security audit]_
3. _[e.g., Create tracking tickets for all core items]_

### Process Improvements
1. _[e.g., Implement architecture review in planning phase]_
2. _[e.g., Add gap analysis to definition of done]_
3. _[e.g., Regular compliance check-ins]_

### Resource Needs
- _[e.g., Need 1 security engineer for 2 weeks]_
- _[e.g., Budget for penetration testing]_
- _[e.g., Legal review time allocation]_

---

## Sign-off

**Prepared by**: _________________ **Date**: _________

**Reviewed by**: _________________ **Date**: _________

**Approved by**: _________________ **Date**: _________

---

## Appendix

### A. References
- Organization Architecture Guidelines: _[Link]_
- Engineering Standards: _[Link]_
- Security Requirements: _[Link]_
- Compliance Checklist: _[Link]_

### B. Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| _[YYYY-MM-DD]_ | 1.0 | Initial gap analysis | _[Name]_ |
| _[YYYY-MM-DD]_ | 1.1 | Updated after review | _[Name]_ |

---

**Note**: This is a living document. Update regularly as gaps are addressed and new requirements emerge. Schedule quarterly reviews to ensure continued alignment with organizational standards.
