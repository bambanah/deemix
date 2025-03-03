# Contributing to deemix

Thank you for your interest in contributing to deemix! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. **Prerequisites**
   - Node.js 20 or higher
   - pnpm 9.10.0 or higher
   - Git

2. **Setting up the development environment**

   ```bash
   # Clone the repository
   git clone https://github.com/bambanah/deemix.git
   cd deemix

   # Install dependencies
   pnpm install
   ```

3. **Development Commands**
   - `pnpm dev` - Start development servers (except GUI)
   - `pnpm dev:gui` - Start GUI development server
   - `pnpm build` - Build all packages
   - `pnpm test` - Run tests
   - `pnpm lint` - Run linting
   - `pnpm type-check` - Run type checking

## Project Structure

- `/cli` - Command-line interface
- `/deemix` - Core library
- `/deezer-sdk` - Deezer API SDK
- `/gui` - Desktop application
- `/webui` - Web interface

## Making Changes

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they follow our coding standards:
   - Use TypeScript
   - Follow ESLint and Prettier configurations
   - Add tests for new features
   - Update documentation as needed

3. Create a changeset for your changes:

   ```bash
   pnpm changeset
   ```

4. Commit your changes following conventional commit format:

   ```bash
   git commit -m "feat: add new feature"
   ```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Add a changeset describing your changes
3. Ensure all tests pass and there are no linting errors
4. Submit a pull request to the `main` branch

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write tests for new features
- Update tests for modified features
- Ensure all tests pass before submitting PR
- Add both unit and integration tests where appropriate

## Documentation

- Update documentation for new features
- Add JSDoc comments for public APIs
- Keep README files up to date
- Document breaking changes in changesets

## Questions?

If you have questions about contributing, please:

1. Check existing issues
2. Create a new issue for discussions
3. Ask in pull request comments

Thank you for contributing to deemix!
