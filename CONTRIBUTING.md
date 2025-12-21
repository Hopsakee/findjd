# Contributing to Johnny Decimal Manager

Thank you for your interest in contributing! This project welcomes contributions from everyone.

## Important Notice

This project was **vibe-coded using Lovable** and has been checked for security issues using Lovable's built-in security scanning tools. However, the repository owner has not manually reviewed all code. Please keep this in mind when contributing and reviewing.

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists in the [Issues](../../issues) tab
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Browser and OS information

### Suggesting Features

1. Open a new issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain how it fits with the Johnny Decimal methodology

### Submitting Code Changes

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the code style guidelines below
5. **Test** your changes locally:
   ```bash
   npm install
   npm run dev
   ```
6. **Commit** with a clear message:
   ```bash
   git commit -m "Add: brief description of changes"
   ```
7. **Push** to your fork and open a **Pull Request**

## Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **Styling**: Use Tailwind CSS with semantic tokens from the design system
- **Formatting**: The project uses standard Prettier/ESLint configuration
- **Components**: Keep components small and focused; create new files for new components

## Project Structure

```
src/
├── components/     # React components
│   └── ui/         # Reusable UI components (shadcn/ui)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and validation
├── pages/          # Page components
└── types/          # TypeScript type definitions
```

## Development Tips

- All data is stored in `localStorage` - no backend required
- The app uses the [Johnny Decimal](https://johnnydecimal.com/) methodology
- Import/export uses JSON format with Zod validation
- Search uses BM25 algorithm for relevance ranking

## Questions?

Feel free to open an issue for any questions about contributing.

---

Thank you for helping improve Johnny Decimal Manager!
