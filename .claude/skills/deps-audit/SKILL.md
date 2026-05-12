---
description: Audit Stockman npm dependencies for known vulnerabilities and outdated packages. Run before a release or after installing new packages.
---

Audit npm dependencies for vulnerabilities and outdated packages.

## Steps

### 1. Run the built-in audit
```bash
npm audit
```
Review the output. Fix critical and high severity issues immediately. Note medium and low for later.

### 2. Fix automatically where safe
```bash
npm audit fix
```
Do NOT use `--force` without reviewing what it changes — it may introduce breaking changes.

### 3. Check for outdated packages
```bash
npm outdated
```
List packages where a newer version is available. Prioritize:
- Security-related packages (auth, crypto, HTTP)
- Direct dependencies over transitive ones

### 4. Review major version upgrades separately
Major version bumps (e.g. `express` 4 → 5) may have breaking changes. Do not update major versions automatically — create a dedicated PR for each one.

### 5. Report findings
```
[CRITICAL] lodash@4.17.15 — prototype pollution (CVE-XXXX). Fix: update to 4.17.21
[OUTDATED] pg@8.7.0 → 8.11.3 available (minor, safe to update)
[MAJOR]    react@18 → 19 available (review breaking changes before updating)
```

## Notes
- Run `npm audit` in CI to catch new vulnerabilities automatically
- Never commit `package-lock.json` changes from `npm audit fix --force` without review
