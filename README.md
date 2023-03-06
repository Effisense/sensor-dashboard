# Effisense: Sensor Dashboard

## TODO

- [ ] Go through existing `TODO`s in code base
- [ ] Point Sentry to the correct project
- [ ] Add Tremor to the project if needed
- [ ] Add Influx credentials in `.env`
- [ ] Add bucket name to `Bucket` type in `influx` package when we know the available bucket names
- [ ] Add all secrets to GitHub Secrets
- [ ] Make Playwright work in CI

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
 ├─ influx
     └─ InfluxDB client
```

## Running the application

To get it running, follow the steps below:

### Setup dependencies

```diff
# Navigate to the project directory
cd sensor-dashboard

# Install dependencies
pnpm i

# Generate types from the Prisma client
pnpm db:generate

# Push the Prisma schema to your database
pnpm db:push

# Start all `dev` scripts
pnpm dev

# Start the `email` service for email templates
pnpm email:dev
```

Please inspect [package.json](/package.json) for more scripts.

## References

This stack is based on [t3-turbo-and-clerk](https://github.com/clerkinc/t3-turbo-and-clerk).
