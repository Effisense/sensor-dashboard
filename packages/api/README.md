# Sensor Dashboard: `api`

## tRPC

tRPC is a TypeScript-first framework for building scalable HTTP APIs. It is a modern alternative to REST, GraphQL, and gRPC.

> TODO: Some more

## Authentication using Clerk

We use [Clerk](https://clerk.dev) for authentication. Clerk is an authentication solution that provides a pre-built UI for authentication and user management. It also provides a backend API for authentication and user management. We use Clerk's backend API to authenticate users and manage user sessions.

For implementation details on how the Clerk context is created and used, please inspect the [`packages/api/src/context.ts`](/packages/api/src/context.ts) file and the [`packages/api/src/lib/clerk.ts`](/packages/api/src/lib/clerk.ts) file.

## Using Clerk in an API route

The Clerk authentication object (`auth`) is available in the `ctx` object of an API route. As an example, check out the [`packages/api/src/router/organization.ts`](/packages/api/src/router/organization.ts) file:

```ts
export const organizationRouter = router({
  addUserToOrganization: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      // ...
```

When running the mutation, the input object is validated using the `zod` schema. The `ctx` object is also available, which contains the `auth` object. The `auth` object contains the `organizationId` of the currently authenticated user. This is used to validate that the user is part of an organization before adding another user to the organization.
