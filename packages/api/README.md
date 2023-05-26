# Sensor Dashboard: `api`

## tRPC

tRPC is a TypeScript-first framework for building scalable HTTP APIs. It is a modern alternative to REST, GraphQL, and gRPC. tRPC abstracts away the HTTP protocol and provides a type-safe API for building HTTP APIs. This way, you can think of requests and responses as **function calls and return values**. For more information on tRPC, check out the [tRPC documentation](https://trpc.io/docs). It is also advised to [stare at their animation on their homepage](https://trpc.io/) until the magic of tRPC clicks in your head.

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

## Ensuring type-safe queries against TimescaleDB

### Why is type-safe queries important?

Type-safe queries are important because they allow us to catch errors at compile-time instead of run-time. For example, if we have a table with a column of type `integer`, we can use some validation schema to ensure that the value we are inserting into the table is of type `integer`. If we try to insert a value of type `string`, the compiler will throw an error. This is much better than having the error thrown at run-time.

### Using Kanel and Kysely

[Kanel](https://github.com/kristiandupont/kanel) is used to generate types from an existing PostgreSQL database schema, which is exactly what we need. Please inspect the [`package.json`](/packages/api/package.json) file to see how Kanel is used to generate the types. The generated types are stored in the [`packages/api/src/schemas/`](/packages/api/src/schemas/) directory.

[Kysely](https://github.com/kysely-org/kysely), on the other hand, is a type-safe SQL query builder. Instead of writing raw SQL strings (e.g. `SELECT * FROM sensor_data;`), we can now write type-safe SQL queries using Kysely. For example:

```ts
// Define the type of the database
type Database = {
  sensor_data: SensorData;
};

// Create the database object
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      // Config goes here...
    }),
  }),
});

// Define the schema of the table `sensor_data`
export const Sensor = db.selectFrom("sensor_data");

// Get data from timeseries between dates
const timeseries = await Sensor.selectAll()
  .where("sensor_id", "=", sensorId)
  .where("time", ">=", startDate)
  .where("time", "<=", endDate)
  .orderBy("time", "asc")
  .execute();
```

In the example above, the `timeseries` object is really used in one of our API routes. We get al the benefits from TypeScript: type-safety, auto-completion, etc.
