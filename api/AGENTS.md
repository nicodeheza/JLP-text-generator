# api

Express-based backend API for Japanese language learning.

## Useful Commands

| Command                           | Description                 |
| --------------------------------- | --------------------------- |
| `pnpm --filter api dev`           | Run dev server (watch mode) |
| `pnpm --filter api build`         | Compile TypeScript          |
| `pnpm --filter api start`         | Production server           |
| `pnpm --filter api test`          | Run vitest                  |
| `pnpm --filter api lint`          | ESLint                      |
| `pnpm --filter api check`         | Type-check + lint + format  |
| `pnpm --filter api dict:setup`    | Setup dictionary data       |
| `pnpm --filter api dict:push`     | Push dict schema            |
| `pnpm --filter api dict:upload`   | Upload dictionary           |
| `pnpm --filter api dict:download` | Download dictionary         |

## File Tree

```
src/
  analyzer/       # Text analysis logic
  cache/         # Caching utilities
  dict/          # Dictionary modules
  generator/     # Content generation
  infrastructure/# DB, external services
  middleware/    # Express middleware
  scripts/       # CLI scripts
  user/          # User management
  utils/         # Helpers
  index.ts       # Entry point
  routes.ts      # Route definitions
  config.ts      # Configuration
```
