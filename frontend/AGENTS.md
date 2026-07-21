# frontend

React frontend for Japanese language learning.

## Useful Commands

| Command                          | Description                |
| -------------------------------- | -------------------------- |
| `pnpm --filter frontend dev`     | Vite dev server            |
| `pnpm --filter frontend build`   | Production build           |
| `pnpm --filter frontend preview` | Preview production build   |
| `pnpm --filter frontend test`    | Run vitest                 |
| `pnpm --filter frontend lint`    | ESLint                     |
| `pnpm --filter frontend check`   | Type-check + lint + format |

## File Tree

```
src/
  api/            # API client
  components/     # React components (18 dirs)
  helpers/        # Utility functions
  routes/         # Page components
  services/       # Business logic
  store/          # Zustand state
  types/          # TypeScript types
  routeTree.gen.ts
  main.tsx        # Entry point
  theme.css       # Styling
```
