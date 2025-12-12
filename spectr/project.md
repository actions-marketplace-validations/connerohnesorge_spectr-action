# spectr-action Context

## Purpose
A GitHub Action that runs Spectr validation for spec-driven development. It downloads the Spectr CLI binary, caches it using GitHub's tool-cache, executes `spectr validate --all --json`, parses the validation output, and creates GitHub annotations (errors, warnings, notices) from the results.

## Tech Stack
- **Language**: TypeScript (ES2022, strict mode)
- **Runtime**: Node.js 20
- **Module System**: CommonJS (required for GitHub Actions)
- **GitHub Actions SDK**: `@actions/core`, `@actions/exec`, `@actions/tool-cache`
- **GitHub API**: Octokit (`@octokit/core`, plugins for pagination and REST)
- **Linter/Formatter**: Biome
- **Bundler**: `@vercel/ncc` (bundles to single file at `dist/spectr-action/index.js`)
- **Test Runner**: Node.js built-in test runner with `tsx`

## Project Conventions

### Code Style
- **Formatter**: Biome with space indentation
- **Quotes**: Double quotes for strings
- **Trailing commas**: Always (ES5+ style)
- **Imports**: Auto-sorted by Biome
- **Object keys**: Sorted by Biome
- Run `npm run check` to lint and format

### Architecture Patterns
- **Entry point**: `src/spectr-action.ts` - main action logic
- **Modular organization**:
  - `src/download/` - Version resolution and binary download
  - `src/types/` - TypeScript type definitions for Spectr output
  - `src/utils/` - Platform detection, constants, input helpers
- **Tool caching**: Uses `@actions/tool-cache` to cache downloaded binaries
- **Error handling**: Graceful failures with `core.setFailed()` and annotations

### Testing Strategy
- **Unit tests**: `__tests__/unit/` - Test individual functions and modules
- **Integration tests**: `__tests__/integration/` - Test action behavior
- **Fixtures**: `__tests__/fixtures/` - Sample spectr projects for testing
- **Commands**:
  - `npm test` - Run unit tests
  - `npm run test:all` - Run all tests
  - `npm run test:integration` - Run integration tests
  - `npm run test:coverage` - Run with coverage reporting
- **Requirement**: Coverage thresholds to be enforced

### Git Workflow
- **Branching**: GitHub Flow (feature branches → PR to main)
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- **CI**: All PRs must pass lint, build, and test checks
- **Releases**: Managed via release-drafter, major/minor tags auto-updated

## Domain Context
**Spectr** is a CLI tool (maintained in a separate repo: `github.com/connerohnesorge/spectr`) that supports spec-driven development with a custom specification format. It validates that code implementations match their specifications.

The spectr-action:
1. Resolves the requested Spectr version (supports `latest`, specific versions, semver ranges)
2. Downloads the appropriate binary for the runner's OS/arch
3. Runs `spectr validate --all --json` in the repository
4. Parses JSON output containing validation results
5. Creates GitHub annotations at specific file:line locations for any issues

## Important Constraints
- **Cross-platform**: Must work on Ubuntu, macOS, and Windows GitHub runners
- **Node 20**: GitHub Actions requires Node.js 20 runtime
- **Bundled output**: Action must be a single bundled JS file (ncc)
- **No network at build**: All dependencies bundled, no runtime npm install

## External Dependencies
- **Spectr releases**: Downloads binaries from `github.com/connerohnesorge/spectr/releases`
- **GitHub API**: Uses for version resolution and release asset downloads
- **GitHub tool-cache**: For caching downloaded binaries between workflow runs
