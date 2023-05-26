# Sensor Dashboard: `web`

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

## Why are there `.js` files in here?

As per [T3-Axiom #3](https://github.com/t3-oss/create-t3-app/tree/next#3-typesafety-isnt-optional), we believe take typesafety as a first class citizen. Unfortunately, not all frameworks and plugins support TypeScript which means some of the configuration files have to be `.js` files.

We try to emphasize that these files are javascript for a reason, by explicitly declaring its type (`cjs` or `mjs`) depending on what's supported by the library it is used by. Also, all the `js` files in this project are still typechecked using a `@ts-check` comment at the top.

## `shadcn/ui`

Shadcn/ui is a collection of re-usable components built using Radix UI and Tailwind CSS. Unlike traditional component libraries, it gives you the freedom to copy and paste the code directly into an application. We chose to utilize Shadcn/ui due to its ability to grant us full control over the implementation and styling of components. These components, which can be located in the [ui](/sensor-dashboard/apps/web/src/ui/) folder, are used throughout this entire application.

Find more information about how to use Shadcn/ui [here](https://ui.shadcn.com/docs).
