# Effisense: Sensor Dashboard

## Code Layout

```txt
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ web
      ├─ Next.js 13
      ├─ React 18
      └─ E2E Typesafe API Server & Client
packages
 ├─ api
 |   └─ tRPC v10 router definition
 ├─ db
 |   └─ typesafe db-calls using Prisma
 ├─ config
 |   └─ tailwind
 |       └─ tailwind config
 ├─ e2e
 |   └─ E2E tests using Playwright
 ├─ email
 |   └─ Email templates
 ├─ mapbox
 |   └─ Mapbox library to be used in the web app
```

## Running the application

Ensure that you have `pnpm` installed. This is a necessity for the project to run, as we're using [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turborepo.com/).

Ensure that you have a `.env` file in the root of the project. You can copy the contents of `.env.example` to get started:

```sh
# Navigate to the project directory
cd sensor-dashboard

# Copy the contents of `.env.example` to `.env`
cp .env.example .env
```

Next, update the values in `.env` to match your environment. Environment variables are available on Vault. Contact repository maintainers for access.

To get the application running, follow the steps below:

### Setup dependencies

```sh
# Navigate to the project directory
cd sensor-dashboard

# Install dependencies
pnpm i

# Generate types from the Prisma client
pnpm db:generate

# Push the Prisma schema to your database
pnpm db:push

# Generate types from external services
pnpm gen:types

# Start all `dev` scripts
pnpm dev
```

Please inspect [package.json](/package.json) for more scripts.

## Adding a new `pnpm` workspace to the Turborepo

Workspaces are defined in the [`pnpm-workspace.yaml`](/pnpm-workspace.yaml) file. To add a new workspace, follow the convention already present in the file. The name of the package in `pnpm-workspace.yaml` must match the directory name of the package, for instance `packages/api` or `apps/web`.

## Adding a new task in Turborepo

Tasks are defined in the [`turbo.json`](/turbo.json) file. To add a new task, follow the convention already present in the file. For more information on how to define a task, please inspect the [Turborepo documentation](https://turborepo.com/docs), specifically [this section](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks).

## `web` documentation

Please inspect [apps/web/README.md](/apps/web) for more information.

## `api` documentation

Please inspect [packages/api/README.md](/packages/api) for more information.

## `db` documentation

Please inspect [packages/db/README.md](/packages/db) for more information.

## `email` documentation

Please inspect [packages/email/README.md](/packages/email) for more information.

## `mapbox` documentation

Please inspect [packages/mapbox/README.md](/packages/mapbox) for more information.

## References

This stack is based on [t3-turbo-and-clerk](https://github.com/clerkinc/t3-turbo-and-clerk).
