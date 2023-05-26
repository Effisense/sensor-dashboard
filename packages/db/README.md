# Sensor Dashboard: `db`

## Prisma

Prisma is an open-source database toolkit and object-relational mapping (ORM) tool that simplifies database access and manipulation for applications. It offers a set of tools and libraries that facilitate with databases, supporting MySQL and other database management systems.

This project uses Prisma to interact with the MySQL database. Prisma is used for two main purposes:

1. **Schema Definition.** Our database schema is defined in the [schema.prisma](/packages/db/prisma/schema.prisma) file. We use the Prisma schema syntax to define our data models. Each model represents a table in our database and includes fields, relationships, and other attributes. As a general tip, GitHub Copilot is exceedingly helpful when writing Prisma schema files 😉

2. **Query Building.** Prisma provides a query builder that allows us to construct complex database queries using a fluent and chainable API. Within our application code, we can use this API to interact with the MySQL database, retrieve data, perform CRUD operations, and apply filters, sorting, and pagination to our queries. The queries are used in API endpoints located in [`packages/api/src/router`](/packages/api/src/router).

Find more documentation on how to use Prisma [here](https://www.prisma.io/docs).
