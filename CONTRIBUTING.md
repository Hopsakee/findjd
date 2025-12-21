# Contributing to Johnny Decimal Manager

Thank you for your interest in contributing! This project welcomes contributions from everyone.

## Development Disclaimer

This project was vibe-coded using [Lovable](https://lovable.dev/), an AI-powered development platform. While contributions are welcome, please be aware that the original codebase was AI-generated and has only been checked with automated security tools, not manually reviewed line-by-line.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected behavior vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with the "enhancement" label
3. Describe the feature and why it would be useful
4. Include mockups or examples if possible

### Code Contributions

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/johnny-decimal-manager.git
   cd johnny-decimal-manager
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes**
   - Follow the existing code style
   - Use TypeScript types appropriately
   - Use Tailwind CSS semantic tokens (don't use direct colors)
   - Keep components small and focused

6. **Test your changes**
   ```bash
   npm run dev
   npm run build
   ```

7. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `refactor:` for code refactoring
   - `test:` for tests

8. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **TypeScript**: Use proper types, avoid `any`
- **React**: Functional components with hooks
- **Styling**: Use Tailwind CSS with semantic tokens from `index.css`
- **Components**: Keep them small, focused, and reusable
- **Validation**: Use Zod for input validation
- **Naming**: Use descriptive names for variables and functions

### File Structure

```
src/
├── components/     # React components
│   └── ui/        # shadcn/ui components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── pages/         # Page components
└── types/         # TypeScript types
```

## Questions?

Feel free to open an issue for any questions about contributing.

---

Thank you for helping improve Johnny Decimal Manager!
