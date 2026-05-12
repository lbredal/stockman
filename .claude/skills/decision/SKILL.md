---
description: Record an architecture decision for Stockman as a lightweight ADR (Architecture Decision Record). Use when making a non-obvious technical choice that future developers should understand.
---

Record an architecture decision.

## When to write one
- Choosing one approach over a reasonable alternative (e.g. REST vs tRPC, zod vs joi)
- Deciding to NOT do something (e.g. no ORM, no TypeScript in v1)
- Constraints that aren't obvious from the code (e.g. why tenant_id is on every table instead of using schemas)

## Steps

### 1. Create `docs/decisions/<NNN>-<slug>.md`
Number sequentially (001, 002, …). Slug is short kebab-case title.

### 2. Use this template
```markdown
# <NNN>. <Title>

**Date**: YYYY-MM-DD
**Status**: Accepted

## Context
What situation or problem led to this decision? What constraints exist?

## Decision
What did we decide to do?

## Consequences
What becomes easier or harder as a result? What are the trade-offs?
```

### 3. Keep it short
An ADR should be readable in 2 minutes. No need for exhaustive analysis.

## Example decisions worth recording for Stockman
- Why Postgres over SQLite (multi-tenancy, concurrent users)
- Why no ORM (raw pg queries, one file per entity)
- Why REST over tRPC or GraphQL
- Why tenant isolation via `tenant_id` column instead of Postgres row-level security
- Auth deferred to v2 (Supabase Auth)

## Notes
- ADRs are immutable — never edit a past decision. If you change course, write a new ADR that supersedes the old one.
- Link related ADRs with "Supersedes ADR-002" or "Related to ADR-004"
