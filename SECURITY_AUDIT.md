# Pre-Public Secret Audit and Response

Use this checklist before public release and on a regular cadence.

## 1) Enable GitHub Security Features (Public Repo)
In repository settings, enable:

- Dependabot alerts
- Dependabot security updates
- Secret scanning alerts
- Secret scanning push protection

These controls are configured in GitHub repository settings (not in source files).

## 1b) Branch Protection and Required Checks
In branch protection for main, enable:

- Require a pull request before merging
- Require status checks to pass before merging
- Select required check: CI / Node Test Suite
- Require conversation resolution before merging

## 1c) Signed Commits (Recommended)
In branch protection for main, enable:

- Require signed commits

This prevents unverified "mystery commits" and improves provenance trust.

## 2) Local Git History Secret Scan
Install and run git-secrets:

```bash
git secrets --install
git secrets --register-aws
git secrets --scan
git secrets --scan-history
```

Optional alternative:

```bash
gitleaks detect --source . --no-git --redact
gitleaks git --redact
```

## 3) If a Secret Was Committed
Immediate response steps:

1. Revoke the exposed credential immediately.
2. Rotate to a new credential and update systems.
3. Remove secrets from code and history as needed.
4. Verify secret scanning is enabled and re-run scans.
5. Document impact and remediation timeline.

## 4) GuardRails-Specific Notes
- Keep .env files out of version control.
- Use .env.example placeholders only.
- Avoid placing API keys in docs, tests, or example payloads.

## 5) Ongoing Practice
- Keep Dependabot updates enabled.
- Keep CI required on pull requests.
- Require signed commits for trusted provenance.
