---
description: Draft a changelog entry for Stockman from recent git commits. Use before tagging a release or writing a PR description.
---

Draft a changelog entry from recent git commits.

## Steps

### 1. Get recent commits since the last tag or base branch
```bash
git log main..HEAD --oneline
# or since last tag:
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

### 2. Group commits by type
- **Added** — new features, new entities, new routes
- **Changed** — modifications to existing behaviour
- **Fixed** — bug fixes
- **Removed** — deleted features or endpoints
- **Security** — security-related fixes
- **Internal** — refactors, dependency updates, tooling (usually omit from user-facing changelog)

### 3. Write the entry in `CHANGELOG.md`
Follow Keep a Changelog format:
```markdown
## [Unreleased]

### Added
- Batch CSV export endpoint (`GET /api/batches/export.csv`)
- Pagination support for Products and Batches

### Fixed
- Batch list no longer returns data from other tenants when status filter is applied
```

### 4. Use plain language
Write for a producer using the app, not a developer reading the code. Avoid technical jargon where possible.

## Notes
- Create `CHANGELOG.md` at the root if it doesn't exist
- Add the new entry at the top, below `## [Unreleased]`
- When cutting a release, replace `[Unreleased]` with the version number and date
