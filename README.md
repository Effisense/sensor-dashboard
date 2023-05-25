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

Shadcn/ui is a collection of re-usable components built using Radix UI and Tailwind CSS. Unlike traditional component libraries, it gives you the freedom to copy and paste the code directly into an application. We chose to utilize Shadcn/ui due to its ability to grant us full control over the implementation and styling of components. These components, which can be located in the [ui](/sensor-dashboard/apps/web/src/ui/) folder, are used throughout this entire application.

Find more information about how to use Shadcn/ui [here](https://ui.shadcn.com/docs).

## Prisma

Prisma is an open-source database toolkit and object-relational mapping (ORM) tool that simplifies database access and manipulation for applications. It offers a set of tools and libraries that facilitate with databases, supporting MySQL and other database management systems.

How we use Prisma in this application:

1. **Schema Definition:** Our database schema is defined in the [schema.prisma](/sensor-dashboard/packages/db/prisma/schema.prisma) file. We used the Prisma Schema Syntax to define our data models. Each model represents a table in our database and includes fields, relationships, and other attributes.

2. **Query Building:** Prisma provides a query builder that allows us to construct complex database queries using a fluent and chainable API. Within our application code, we can use this API to interact with the MySQL database, retrieve data, perform CRUD operations, and apply filters, sorting, and pagination to our queries. The queries made to the database can be found in the [queries](/sensor-dashboard/apps/web/src/hooks/queries/) folder.

Find more documentation on how to use Prisma [here](https://www.prisma.io/docs).
