# Sensor Dashboard: `db`

## Prisma

Prisma is an open-source database toolkit and object-relational mapping (ORM) tool that simplifies database access and manipulation for applications. It offers a set of tools and libraries that facilitate with databases, supporting MySQL and other database management systems.

How we use Prisma in this application:

1. **Schema Definition:** Our database schema is defined in the [schema.prisma](/sensor-dashboard/packages/db/prisma/schema.prisma) file. We used the Prisma Schema Syntax to define our data models. Each model represents a table in our database and includes fields, relationships, and other attributes.

2. **Query Building:** Prisma provides a query builder that allows us to construct complex database queries using a fluent and chainable API. Within our application code, we can use this API to interact with the MySQL database, retrieve data, perform CRUD operations, and apply filters, sorting, and pagination to our queries. The queries made to the database can be found in the [queries](/sensor-dashboard/apps/web/src/hooks/queries/) folder.

Find more documentation on how to use Prisma [here](https://www.prisma.io/docs).
