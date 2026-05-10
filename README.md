# nn1.dev (API)

Welcome to the [Northamptonshire Dev Club](https://nn1.dev/) API. Your contributions are welcome! The only prerequisite for this project to run locally is [Node.js](https://nodejs.org/en). It is hosted on [Cloudflare](http://cloudflare.com/). There is a continuous deployment set up against the main branch.

## Getting started

```sh
git clone https://github.com/nn1-dev/api.git
cd api
npm install
npm run dev
```

## Scripts

- `npm run gen` - regenerate types based on the Cloudflare bindings and env
- `npm run check` - check if you have permission to resources configured in the wrangler.jsonc file
- `npm run dev` - run project locally
- `npm run seed:prod` - run migrations on the prod db
- `npm run seed:dev` - run migrations on the dev db
