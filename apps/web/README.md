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

## Middleware

Middleware is defined in [`apps/web/src/middleware.ts`](/apps/web/src/middleware.ts). This file contains some defined logic that is executed on all pages. This is the conventional way of for instance validating that a user is authenticated before accessing a page. For more information on middleware, please inspect [Next.js' documentation](https://nextjs.org/docs/pages/building-your-application/routing/middleware).

The middleware is wrapped in `withClerkMiddleware`, in order to make Clerk accessible. Take the following snippet as an example:

```ts
const publicPaths = ["/sign-in*", "/sign-up*", "/scan"];

export default withClerkMiddleware(async (req) => {
  if (isPublicPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { user, organization } = await getAuthentication(req);

  if (!user) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // ...
```

In the snippet above, if the current path is a public path, the middleware will return `NextResponse.next()`, which means that the request will continue to the next middleware. If the current path is not a public path, the middleware will check if the user is authenticated. If the user is not authenticated, the user will be redirected to the sign in page.

## Sentry error tracking

Sentry is an error tracking tool that helps us monitor and fix crashes in real time. We use Sentry to track errors in our application. For more information on Sentry, please inspect [their documentation](https://docs.sentry.io/), specifically for Next.js [here](https://docs.sentry.io/platforms/javascript/guides/nextjs/).

## Consuming and using Mapbox

If you are not familiar with how Mapbox is defined and used in this repository, please first read the [`mapbox` documentation](/packages/mapbox).

### Rendering the map

There are two main types of map in the application, the [`AllSensorsMap.tsx`](/apps/web/src/ui/map/AllSensorsMap.tsx) and the [`SetSensorPositionMap.tsx`](/apps/web/src/ui/map/SetSensorPositionMap.tsx). The `AllSensorsMap` is used to display an array of sensors, whilst the `SetSensorPositionMap` is used to set the position of a sensor. Additionally, we have a custom popover component for rendering the sensor information of one marker on the map, which is defined in [`SensorMarkerPopover.tsx`](/apps/web/src/ui/map/SensorMarkerPopover.tsx). In summary, these component are only responsible for rendering the map and the markers on the map.

### The necessary logic and hooks

To implement the necessary logic for the map, we have defined some custom React hooks to be used in the components. If you are not familiar with custom React hooks, please inspect [the React documentation](https://react.dev/learn/reusing-logic-with-custom-hooks).

These hooks are [`useAllSensorsMap.tsx`](/apps/web/src/hooks/map/useAllSensorsMap.tsx) (for [`AllSensorsMap.tsx`](/apps/web/src/ui/map/AllSensorsMap.tsx)) and [`useSetSensorPositionMap.tsx`](/apps/web/src/hooks/map/useSetSensorPositionMap.tsx) (for [`SetSensorPositionMap.tsx`](/apps/web/src/ui/map/SetSensorPositionMap.tsx)). The `useAllSensorMap` is responsible for populating a map with markers based on a a collection of sensors with a location. The `useSetSensorPositionMap` is responsible for setting the position of a sensor on a map.
