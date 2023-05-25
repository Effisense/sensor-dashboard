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

Ensure that you have `pnpm` installed. This is a necessity for the project to run, as we're using [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turborepo.com/)

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

# Start all `dev` scriptsPrisma. How do we define schema a do queries to the MySQL database?
pnpm dev
```

Please inspect [package.json](/package.json) for more scripts.

## References

This stack is based on [t3-turbo-and-clerk](https://github.com/clerkinc/t3-turbo-and-clerk).

## Shadcn/ui

Shadcn/ui is a collection of re-usable components built using Radix UI and Tailwind CSS. Unlike traditional component libraries, it gives you the freedom to copy and paste the code directly into your application. We chose to utilize Shadcn/ui due to its ability to grant us full control over the implementation and styling of components. These components, which can be located in the [ui](/sensor-dashboard/apps/web/src/ui/) folder, are used throughout our entire application.

You can find more information about how to use Shadcn/ui [here](https://ui.shadcn.com/docs).

## Prisma

Prisma. How do we define schema a do queries to the MySQL database?
