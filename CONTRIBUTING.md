# Contributing to Incrypt Oracle

We love your input! We want to make contributing to Incrypt Oracle as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests Welcome

Pull requests are the best way to propose changes to the codebase:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## 🛠️ Development Setup

### Prerequisites

- Node.js 16.0.0+
- Git
- A BSC-compatible wallet for testing

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/GHX5T-SOL/IncryptOracle.git
cd IncryptOracle

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development
npm run dev
```

### Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Run with coverage
npm run test:coverage

# Deploy to testnet
npm run deploy:testnet
```

### Frontend Development

The frontend is built with Next.js, Tailwind CSS, and Framer Motion:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## 📝 Coding Standards

### Solidity

- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use OpenZeppelin contracts for security
- Add comprehensive NatSpec documentation
- Include unit tests for all functions
- Gas optimization is important but not at the cost of readability

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer functional components and hooks for React

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the established design system
- Ensure mobile responsiveness
- Maintain the mystical anime aesthetic
- Use Framer Motion for animations

## 🧪 Testing

### Smart Contract Tests

```bash
# Run all tests
npm run test

# Run specific test file
npx hardhat test test/IOToken.test.js

# Run with gas reporting
REPORT_GAS=true npm run test

# Coverage report
npm run test:coverage
```

### Frontend Tests

```bash
# Run Jest tests
npm run test:frontend

# Run with watch mode
npm run test:frontend -- --watch
```

## 🐛 Bug Reports

We use GitHub issues to track public bugs. Report a bug by opening a new issue with:

- **Title**: Clear and descriptive
- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable

### Security Issues

🚨 **DO NOT** open GitHub issues for security vulnerabilities.

Instead, email us at: **INCRYPTINVESTMENTS@PROTONMAIL.COM**

We'll acknowledge your email within 24 hours and send a detailed response within 72 hours.

## 💡 Feature Requests

Feature requests are welcome! Open an issue with:

- **Title**: Clear description of the feature
- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Any alternative solutions considered
- **Context**: Additional context or screenshots

## 📚 Documentation

### Updating Documentation

- Website documentation lives in `/docs`
- API documentation is auto-generated from code comments
- Update README.md for significant changes
- Include examples for new features

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add diagrams where helpful
- Keep it up to date with code changes

## 🏆 Recognition

Contributors who help improve Incrypt Oracle may be eligible for:

- **Recognition** in our README and website
- **Early access** to new features
- **Community governance** roles
- **Token rewards** for significant contributions

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

Examples of behavior that contributes to a positive environment:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Project maintainers have the right to remove, edit, or reject:

- Comments, commits, code, wiki edits, issues
- Other contributions that don't align with this Code of Conduct

## 📞 Getting Help

- 📖 Check the [documentation](https://docs.incryptoracle.com)
- 💬 Join our [Discord](https://discord.gg/XPSCUYVM65)
- 📧 Email: [incryptinvestments@protonmail.com](incryptinvestments@protonmail.com)
- 🐛 Open an [issue](https://github.com/GHX5T-SOL/IncryptOracle/issues)

## 📅 Release Process

1. **Feature Development**: Features developed on feature branches
2. **Testing**: Comprehensive testing on testnet
3. **Code Review**: All changes reviewed by maintainers  
4. **Documentation**: Update docs and changelog
5. **Release**: Tagged releases with semantic versioning

## 🎯 Areas for Contribution

### High Priority

- 🔒 **Security improvements** and audit findings
- 🐛 **Bug fixes** and stability improvements
- 📖 **Documentation** enhancements
- ⚡ **Gas optimizations** for smart contracts

### Medium Priority

- ✨ **New oracle data sources** integration
- 🎨 **UI/UX improvements** and animations
- 📱 **Mobile responsiveness** enhancements
- 🧪 **Additional test coverage**

### Future Enhancements

- 🌐 **Multi-chain support** (Polygon, Arbitrum)
- 🤖 **AI-powered market suggestions**
- 📊 **Advanced analytics** and charts
- 🏆 **Gamification** features

## 💬 Questions?

Don't hesitate to reach out if you have questions about contributing. We're here to help!

---

Thank you for helping make Incrypt Oracle better! 🙏
