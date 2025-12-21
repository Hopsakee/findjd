# Johnny Decimal Manager

A progressive web application (PWA) for managing and organizing your digital life using the [Johnny.Decimal](https://johnnydecimal.com/) system.

## What is Johnny.Decimal?

Johnny.Decimal is a system to organize your digital (and physical) life. It provides a structured way to categorize everything using a simple numbering scheme:

- **Domains** (optional prefix): High-level life areas (e.g., `d1` for Work, `d2` for Personal)
- **Areas** (10-19, 20-29, etc.): Broad categories within a domain
- **Categories** (11, 12, 21, 22, etc.): Specific topics within an area
- **Items** (11.01, 11.02, etc.): Individual items within a category

## Features

- **Hierarchical Organization**: Create and manage domains, areas, categories, and items
- **Full-Text Search**: Quickly find anything using BM25-powered search
- **Tag Support**: Add tags to categories and items for additional organization
- **Import/Export**: Backup and restore your system as JSON files
- **Offline Support**: Works offline as a PWA - install it on your device
- **Privacy-First**: All data stored locally in your browser - no server, no accounts
- **Responsive Design**: Works on desktop, tablet, and mobile

## Installation (Without Lovable)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm, yarn, or bun

### Steps

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist` folder, ready to be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## Usage

1. **Create a System**: Start by creating your organizational structure with domains, areas, and categories
2. **Add Items**: Within categories, add specific items with their Johnny.Decimal IDs
3. **Search**: Use the search bar to quickly find anything in your system
4. **Export**: Regularly export your data as a backup (JSON format)
5. **Import**: Restore from a backup or share systems between devices

## GitHub Sync (via Lovable)

This project supports bidirectional sync with GitHub through the Lovable platform.

### How to Connect GitHub

1. **In Lovable Editor**: Click **GitHub** → **Connect to GitHub**
2. **Authorize**: Grant the Lovable GitHub App access to your GitHub account
3. **Select Account**: Choose the GitHub account/organization for the repository
4. **Create Repository**: Click **Create Repository** in Lovable

### Setting Up Personal Access Token (for CLI/API access)

If you need to access your GitHub repository programmatically:

1. Go to **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a descriptive name (e.g., "Johnny Decimal Manager")
4. Select scopes:
   - `repo` (full control of private repositories)
   - `workflow` (if using GitHub Actions)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

**⚠️ Security Warning**: 
- Never commit your Personal Access Token to the repository
- Never share your token publicly
- Store tokens securely (use environment variables or a secrets manager)
- Revoke tokens you no longer need

### Sync Behavior

- **Lovable → GitHub**: Changes made in Lovable automatically push to GitHub
- **GitHub → Lovable**: Changes pushed to GitHub automatically sync to Lovable
- **Real-time**: Sync happens automatically without manual pulls or pushes

### Local Development with GitHub

```bash
# Clone the synced repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Make changes locally
# ... edit files ...

# Commit and push
git add .
git commit -m "feat: your changes"
git push origin main
```

Changes will automatically appear in Lovable.

## Technology Stack

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Zod](https://zod.dev/) - Input validation

## Development Disclaimer

> **⚠️ Important Notice**
>
> This project was **vibe-coded** using [Lovable](https://lovable.dev/), an AI-powered development platform. The code was generated through natural language conversations with AI.
>
> **Security checks** have been performed using Lovable's built-in security scanning tools, which check for common vulnerabilities including:
> - Input validation issues
> - Information leakage
> - Resource cleanup (memory leaks, blob URLs)
> - General security best practices
>
> However, **the repository owner has not manually reviewed the code line-by-line**. While the AI-generated code has passed automated security checks, users should be aware that:
> - No manual code audit has been performed
> - The code is provided as-is without warranty
> - You are encouraged to review the code yourself before using in production environments

## Secrets & Security

This codebase contains **no secrets, API keys, or sensitive credentials**. All application data is stored locally in the user's browser using localStorage.

If you fork this project and add integrations requiring API keys:
- Never commit secrets to the repository
- Use environment variables for sensitive data
- Add secrets to `.gitignore`
- Consider using a secrets manager for production

## Privacy

All data is stored locally in your browser's localStorage. No data is ever sent to any server. You can clear all data at any time through the Help menu.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Lovable](https://lovable.dev/)
