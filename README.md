# nn1.dev (API)

Welcome to the [Northamptonshire Dev Club](https://nn1.dev/) API. Your contributions are welcome! The only prerequisite for this project to run locally is [Node.js](https://nodejs.org/en). It is hosted on [Cloudflare](http://cloudflare.com/). There is a continuous deployment set up against the main branch.

## Scripts

- `pnpm gen` - regenerate types based on the Cloudflare bindings and env
- `pnpm check` - check if you have permission to resources configured in the wrangler.jsonc file
- `pnpm dev` - run project locally
- `pnpm seed:prod` - run migrations on the prod db
- `pnpm seed:dev` - run migrations on the dev db
