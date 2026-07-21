# ja-tools

Japanese language learning tools monorepo (pnpm workspace).

```
.agents/              # opencode skills
.github/workflows/    # GitHub Actions CI/CD
api/                  # backend API
frontend/             # React frontend
packages/share/types/ # shared TypeScript types
pnpm-workspace.yaml
```

## Useful Commands

| Command        | Description                                 |
| -------------- | ------------------------------------------- |
| `pnpm install` | Install all dependencies                    |
| `pnpm dev`     | Run dev servers (parallel)                  |
| `pnpm test`    | Run all tests                               |
| `pnpm lint`    | Lint all packages                           |
| `pnpm check`   | Type-check and linter check in all packages |

## Packages

- [api/AGENTS.md](/api/AGENTS.md) — Backend API
- [frontend/AGENTS.md](/frontend/AGENTS.md) — React frontend
- [packages/share/types/AGENTS.md](/packages/share/types/AGENTS.md) — Shared types
