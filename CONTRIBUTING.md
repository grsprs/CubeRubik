# Contributing to CubeRubik

Thank you for considering contributing to CubeRubik!

## How to Contribute

### Reporting Bugs

Use the GitHub issue tracker with the bug report template. Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS version
- Screenshots if applicable

### Suggesting Features

Use the feature request template. Describe:
- The problem you're solving
- Proposed solution
- Alternative approaches considered

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our standards
4. Write/update tests (required)
5. Ensure all tests pass (`npm test`)
6. Ensure linting passes (`npm run lint`)
7. Commit using conventional commits (`feat:`, `fix:`, `docs:`, etc.)
8. Push to your fork
9. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/CubeRubik.git
cd CubeRubik

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint
```

## Code Standards

- **TypeScript**: Strict mode enabled
- **Testing**: All new features require tests (TDD)
- **Coverage**: Maintain ≥80% coverage on critical paths
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
- **Architecture**: Respect layer boundaries (domain → presentation → application → ui)

## Architecture Layers

- `src/domain/` - Pure logic, no Three.js dependencies
- `src/presentation/` - Three.js visualization
- `src/application/` - Coordination between layers
- `src/ui/` - DOM manipulation

**Rule**: Domain layer must never import from presentation layer.

## Testing Requirements

- Unit tests for all domain logic
- Integration tests for user workflows
- Visual regression tests for UI changes
- All tests must pass before merge

## Code Review Process

All PRs require:
- Passing CI checks
- Code review approval
- No merge conflicts
- Updated documentation (if applicable)

## Questions?

Open a discussion or contact the maintainer.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
