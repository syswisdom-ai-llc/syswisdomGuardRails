# Contributing to SysWisdom Guardrails

Thank you for your interest in contributing to SysWisdom Guardrails! We welcome feedback, bug reports, feature suggestions, and improvements.

**© 2024 SysWisdom.AI LLC • Building with heart in Georgia**

---

## Community Guidelines

SysWisdom Guardrails is built by quality professionals, for quality professionals. We're committed to making this a welcoming, inclusive, and collaborative community.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## Ways to Contribute

### 1. Report Bugs or Issues

**Found a problem?** Open an issue on GitHub or email us:

- 📧 **Email**: info@syswisdom.ai
- 🐛 **Include**:
  - Clear description of the issue
  - Steps to reproduce
  - Expected vs. actual behavior
  - Your environment (Node version, OS, etc.)
  - Screenshots (if applicable)

### 2. Suggest Features

Have an idea to make Guardrails better?

- 📧 **Email**: info@syswisdom.ai
- 💡 **Include**:
  - Clear use case or problem it solves
  - Examples of how it would be used
  - Any alternative approaches you've considered

### 3. Improve Documentation

Help us write clearer docs, better examples, or tutorials:

- **README.md** — Clarity on setup, features, architecture
- **SETUP.md** — Installation and configuration
- **models/MODEL_TRAINING_GUIDE.md** — Training walkthrough
- Inline code comments
- Troubleshooting guides

### 4. Share Feedback on Design & UX

As a quality professional, your perspective on the interface matters:

- How intuitive is the approval workflow?
- Are the fix library recommendations helpful?
- Would additional visualizations be useful?
- What workflow would save you time?

📧 Send feedback to: **info@syswisdom.ai**

### 5. Share Use Cases & Data

Help us understand how you're using Guardrails:

- What data quality issues are you catching?
- How has the fix library improved your team's efficiency?
- What have you learned about your data?

📧 Share your story: **info@syswisdom.ai**

---

## Development Workflow

### Setting Up Your Environment

```bash
# Clone the repository
git clone https://github.com/syswisdom-ai-llc/guardrails.git
cd guardrails

# Install Node dependencies
npm install

# Create environment file (see Configuration section below)
cp .env.example .env

# Install Python dependencies (for model training)
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### Running Tests

```bash
# Run all tests
npm test

# Expected output: 9/9 tests passing

# Run with watch mode (auto-rerun on changes)
npm test -- --watch
```

### Starting Development Server

```bash
# With auto-reload (recommended for development)
npm run dev

# Or standard start
npm start

# Server runs on http://localhost:3000
```

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   npm test
   ```

4. **Keep commits clean**:
   - One feature per commit
   - Write clear commit messages
   - Reference issues where applicable

5. **Submit feedback**:
   - Email: **info@syswisdom.ai**
   - Describe what you've done
   - Explain why it's valuable
   - Include test results

---

## Code Style & Standards

### JavaScript

- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Required
- **Quotes**: Double quotes for strings
- **Variable naming**: camelCase for variables, CONSTANT_CASE for constants
- **Comments**: Clear, concise; explain "why", not "what"

Example:

```javascript
// ✅ Good
function normalizeIssues(apiResponse) {
  // Convert API schema to internal format for consistent processing
  const normalized = apiResponse.issues.map(issue => ({
    id: uuid(),
    type: issue.type,
    column: issue.column,
    severity: calculateSeverity(issue.missing_percentage)
  }));
  return normalized;
}

// ❌ Avoid
function normalizeIssues(response){
  const issues = response.issues.map(i=>{return {id: uuid(), type: i.type}})
  return issues
}
```

### Tests

- Test file naming: `module.test.js`
- Use Node's built-in `test` module
- One test per behavior
- Clear test descriptions
- Arrange-Act-Assert pattern

Example:

```javascript
import { test } from 'node:test';
import assert from 'node:assert';
import { normalizeIssues } from './server.js';

test('normalizeIssues maps missing_values to CRITICAL severity at ≥50%', () => {
  // Arrange
  const apiResponse = {
    issues: [{ type: 'missing_values', missing_percentage: 80 }]
  };
  
  // Act
  const result = normalizeIssues(apiResponse);
  
  // Assert
  assert.strictEqual(result[0].severity, 'CRITICAL');
});
```

---

## Pull Request Process

We appreciate pull requests, but the core platform remains proprietary. Here's what we can accept:

### ✅ We Accept:
- Bug fixes (with test coverage)
- Documentation improvements
- Test enhancements
- Performance optimizations
- Security improvements

### ⚠️ We Need Discussion For:
- New features (may require design review)
- API changes (may affect integrations)
- Major refactors

### ❌ We Cannot Accept:
- Code that removes licensing or copyright
- Changes that violate the License Agreement
- Reverse-engineered proprietary algorithms

**Process**:

1. **Create an issue** describing your change
2. **Email feedback** to info@syswisdom.ai (for feature discussions)
3. **Implement with tests** if approved
4. **Share your work** via email with a clear PR summary

---

## Reporting Security Issues

🔒 **Found a security vulnerability?**

**Do not** open a public issue. Instead:

📧 Email: **info@syswisdom.ai**

**Include**:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any proposed fix

We'll respond within 48 hours and work with you on a responsible disclosure timeline.

---

## License & Intellectual Property

### Your Contributions

By contributing to SysWisdom Guardrails, you agree that:

- ✅ Your contributions will be owned by SysWisdom.AI LLC
- ✅ Your code may be incorporated into the proprietary product
- ✅ You grant SysWisdom.AI LLC non-exclusive rights to your feedback
- ✅ You retain the right to fork/copy your own contributions for personal use

### Our Obligations

We promise to:

- ✅ Credit contributors in release notes (if desired)
- ✅ Consider all feedback and suggestions
- ✅ Maintain the platform responsibly
- ✅ Respect privacy and data security

---

## Community Values

### We Believe In:

**🤝 Collaboration** — Quality improves when teams work together  
**💡 Learning** — Every dataset teaches us something new  
**🎯 Honesty** — Data tells the truth when we listen  
**🛡️ Integrity** — Fixing problems starts with acknowledging them  
**🌱 Growth** — Better data leads to better decisions  

### We Expect:

- **Respectful communication** — Disagree with ideas, not people
- **Good faith** — Assume positive intent
- **Accountability** — Own your mistakes and learn from them
- **Inclusivity** — Welcome perspectives from all backgrounds
- **Transparency** — Be honest about limitations and unknowns

---

## Getting Help

### Questions About Contributing?

📧 **Email**: info@syswisdom.ai

### Questions About the Platform?

- 📚 See [README.md](readMe.md) for quick start
- 📖 See [SETUP.md](SETUP.md) for detailed setup
- 🤔 See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards

### Bug Reports or Feature Requests?

📧 **Email**: info@syswisdom.ai

---

## Recognition

Contributors who submit bug fixes, documentation improvements, or significant feedback will be recognized in:

- 📝 Release notes
- 🌟 Credits section (if desired)
- 🏆 SysWisdom community channels

---

## License & Copyright

**© 2024 SysWisdom.AI LLC**

All contributions to SysWisdom Guardrails are subject to the terms of the [LICENSE](LICENSE) file.

By contributing, you agree to these terms.

---

## Thank You! 🙏

We appreciate every contribution—big or small. Together, we're building the future of data quality.

**Questions? Reach out:**

- 📧 info@syswisdom.ai
- 💼 sales@syswisdom.ai
- 🌐 https://www.syswisdom.ai

**SysWisdom Guardrails** — *Where data quality becomes institutional knowledge.*
