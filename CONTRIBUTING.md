# Contributing to PokéDex Pro

Thank you for your interest in contributing to PokéDex Pro! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/pokedex-pro.git
   cd pokedex-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type - use specific types or `unknown`
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop typing with interfaces
- Implement error boundaries where appropriate

### Styling
- Use Tailwind CSS classes for styling
- Follow mobile-first responsive design
- Use semantic HTML elements
- Ensure accessibility with ARIA labels

### File Organization
```
src/
├── components/
│   ├── common/          # Reusable components
│   └── layout/          # Layout-specific components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API and external services
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── contexts/            # React Context providers
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Writing Tests
- Write unit tests for utility functions
- Test React components with React Testing Library
- Mock external API calls
- Aim for >80% code coverage

## 🔄 Pull Request Process

1. **Create a descriptive PR title**
   - Use conventional commits format: `feat:`, `fix:`, `docs:`, etc.
   - Example: `feat: add battle simulator with AI opponents`

2. **Fill out the PR template**
   - Describe what changes were made
   - Link to related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Ensure all checks pass**
   - All tests must pass
   - Code must pass linting
   - Build must succeed
   - No TypeScript errors

4. **Request review**
   - Tag relevant maintainers
   - Respond to feedback promptly
   - Make requested changes

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information
- Screenshots or videos if applicable

Use the bug report template in GitHub Issues.

## 💡 Feature Requests

For new features:
- Check if the feature already exists or is planned
- Describe the use case and benefits
- Consider implementation complexity
- Provide mockups or examples if helpful

Use the feature request template in GitHub Issues.

## 📋 Coding Standards

### Commit Messages
Follow conventional commits:
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Code Formatting
- Use Prettier for code formatting
- Run `npm run lint` before committing
- Fix all ESLint warnings and errors
- Use consistent indentation (2 spaces)

### Performance Guidelines
- Optimize images and assets
- Use React.memo() for expensive components
- Implement proper loading states
- Minimize API calls with caching

## 🎨 Design Guidelines

### UI/UX Principles
- Follow Material Design or similar design system
- Ensure consistent spacing and typography
- Use appropriate color contrast ratios
- Design for accessibility (WCAG 2.1 AA)

### Responsive Design
- Mobile-first approach
- Test on multiple screen sizes
- Use appropriate breakpoints
- Ensure touch-friendly interfaces

## 🔧 Development Tools

### Recommended Extensions (VS Code)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

### Useful Commands
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Build
npm run build

# Preview build
npm run preview
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PokéAPI Documentation](https://pokeapi.co/docs/v2)

### Learning Resources
- [React Query Guide](https://tanstack.com/query/latest)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Be constructive in feedback
- Help newcomers learn
- Respect different perspectives

### Communication
- Use GitHub Issues for bugs and features
- Join discussions in Pull Requests
- Ask questions if something is unclear
- Provide context in your communications

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks in documentation

## 📞 Getting Help

If you need help:
1. Check existing documentation
2. Search GitHub Issues
3. Create a new issue with the "question" label
4. Join community discussions

## 📄 License

By contributing to PokéDex Pro, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to PokéDex Pro! 🎮✨
