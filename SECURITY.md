# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

**DO NOT** open a public GitHub issue.

### How to Report

Email: **sp.nikoloudakis@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Disclosure Policy

- Security fixes will be released as patches
- CVE will be requested for critical vulnerabilities
- Public disclosure after fix is released
- Credit given to reporter (unless anonymity requested)

## Security Best Practices

This project follows:
- Dependency vulnerability scanning (npm audit)
- No sensitive data in client-side code
- Input validation on all user interactions
- CSP headers recommended for deployment

## Known Security Considerations

- This is a client-side educational tool
- No server-side components
- No user data collection
- No authentication/authorization required

## Updates

Security updates are announced in:
- GitHub Security Advisories
- CHANGELOG.md
- Release notes
