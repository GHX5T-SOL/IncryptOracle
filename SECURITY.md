# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

🚨 **Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **incryptinvestments@protonmail.com*

You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g. smart contract vulnerability, frontend security issue, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Security Measures

### Smart Contract Security

- **Audited Contracts**: All smart contracts audited by CertiK
- **OpenZeppelin**: Using battle-tested OpenZeppelin libraries
- **Access Controls**: Comprehensive permission system with role-based access
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Input Validation**: Thorough validation of all user inputs
- **Emergency Controls**: Pause mechanisms for emergency situations

### Infrastructure Security

- **Private Key Management**: Secure key storage and rotation procedures
- **Multi-signature**: Critical operations require multiple signatures
- **Environment Isolation**: Separate environments for development, testing, and production
- **Monitoring**: 24/7 monitoring of contract interactions and anomalies
- **Rate Limiting**: Protection against spam and abuse

### Frontend Security

- **Content Security Policy**: Strict CSP headers to prevent XSS
- **HTTPS Only**: All communications encrypted in transit
- **Wallet Security**: Best practices for wallet integration
- **Input Sanitization**: All user inputs properly sanitized
- **Dependency Management**: Regular updates and vulnerability scanning

## Security Best Practices for Users

### Wallet Security

- Use a hardware wallet for large amounts
- Never share your private keys or seed phrases
- Verify all transaction details before signing
- Use official wallet applications only

### Smart Contract Interaction

- Verify contract addresses before interacting
- Check transaction details carefully
- Start with small amounts when testing
- Be aware of gas fees and market conditions

### General Security

- Keep your browser and wallet software updated
- Be cautious of phishing attempts
- Verify URLs before entering sensitive information
- Use strong, unique passwords for accounts

## Security Audit Reports

### CertiK Audit (January 2024)

- **Overall Score**: 96/100
- **Critical Issues**: 0
- **High Issues**: 0
- **Medium Issues**: 2 (resolved)
- **Low Issues**: 5 (resolved)
- **Informational**: 8 (addressed)

**Download**: [CertiK_Incrypt_Oracle_Audit_Report.pdf](#)

### Slither Static Analysis

- **High Severity**: 0 issues
- **Medium Severity**: 3 issues (resolved)
- **Low Severity**: 7 warnings (documented)
- **Optimizations**: 12 suggestions (implemented)

## Bug Bounty Program

We run a bug bounty program to encourage responsible disclosure of security vulnerabilities. Rewards are based on the severity and impact of the discovered vulnerability.

### Rewards

- **Critical**: $5,000 - $10,000
- **High**: $2,000 - $5,000  
- **Medium**: $500 - $2,000
- **Low**: $100 - $500

### Scope

In scope:
- Smart contracts deployed on BSC Mainnet
- Frontend application (incryptoracle.com)
- Oracle infrastructure and APIs

Out of scope:
- Testnet contracts
- Third-party integrations
- Social engineering attacks

For more details, visit our [Bug Bounty Program](https://immunefi.com/bounty/incryptoracle/).

## Contact

- **Security Email**: security@incryptoracle.com
- **General Contact**: support@incryptoracle.com
- **Discord**: [discord.gg/incrypt](https://discord.gg/incrypt)
