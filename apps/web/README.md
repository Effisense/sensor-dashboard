# Sensor Dashboard: `web`

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

## Why are there `.js` files in here?

As per [T3-Axiom #3](https://github.com/t3-oss/create-t3-app/tree/next#3-typesafety-isnt-optional), we believe take typesafety as a first class citizen. Unfortunately, not all frameworks and plugins support TypeScript which means some of the configuration files have to be `.js` files.

We try to emphasize that these files are javascript for a reason, by explicitly declaring its type (`cjs` or `mjs`) depending on what's supported by the library it is used by. Also, all the `js` files in this project are still typechecked using a `@ts-check` comment at the top.

## Authentication using Clerk

We use [Clerk](https://clerk.dev) for authentication. Clerk is an authentication solution that provides a pre-built UI for authentication and user management. It also provides a backend API for authentication and user management. We use Clerk's backend API to authenticate users and manage user sessions.

The project setup is loosely based on the [`t3-turbo-and-clerk`](https://github.com/clerkinc/t3-turbo-and-clerk) GitHub repository.

Clerk is defined in the [`packages/api`](/packages/api) package, and consumed in this ([`apps/web`](/apps/web)) package. For more information on how to use Clerk, please inspect the [`packages/api`](/packages/api) package.

### Changing brand colors in Clerk

The web application is wrapped in a [`ClerkProvider.tsx`](/apps/web/src/ui/providers/ClerkProvider.tsx). This component is responsible for initializing Clerk and providing the necessary configuration of Clerk. The `<ClerkProvider />` component has a customisable `appearance` property, which is used to change the brand colors of Clerk. For more information on brand colors in Clerk, please inspect [their documentation](https://clerk.com/docs/component-customization/appearance-prop).

## `shadcn/ui`

`shadcn/ui` is a collection of re-usable components built using Radix UI and Tailwind CSS. Unlike traditional component libraries, it gives you the freedom to copy and paste the code directly into an application. We chose to utilize `shadcn/ui` due to its ability to grant us full control over the implementation and styling of components. These components, which are located in the [ui](/apps/web/src/ui/) folder, are used throughout the entire application.

For more information on `shadcn/ui`, please inspect [their documentation](https://ui.shadcn.com/).
