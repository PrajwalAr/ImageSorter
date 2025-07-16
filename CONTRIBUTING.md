# Contribution Guidelines

We welcome contributions to ImageSorter! Please follow these guidelines:

## Code Style

- **TypeScript**: Strict typing with `noImplicitAny`
- **React**: Functional components with hooks
- **Formatting**: 2-space indentation, trailing commas
- **Naming**: PascalCase for components, camelCase for functions

## Testing Requirements

- 80% test coverage minimum for new features
- Use Vitest and React Testing Library
- Tests should be colocated with components (`__tests__` folders)

## Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new file selector component
fix: resolve image copying bug
docs: update installation instructions
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`feat/your-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Submit PR with description of changes

## Issue Reporting

Use this template when reporting issues:

```
### Description
[Clear description of the issue]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- OS: [e.g., macOS Ventura]
- Version: [e.g., 1.0.0]
```

## Development Workflow

```bash
# Run all tests
npm test

# Check test coverage
npm run coverage
