const { generateKnexTablesModule } = require("kanel-knex");
const { generateZodSchemas } = require("kanel-zod");

/** @type {import('kanel').Config} */
module.exports = {
  connection: {
    host: process.env.TIMESERIES_DB_HOST,
    user: process.env.TIMESERIES_DB_USERNAME,
    password: process.env.TIMESERIES_DB_PASSWORD,
    database: process.env.TIMESERIES_DB_NAME,
    port: process.env.TIMESERIES_DB_PORT,
  },

  preDeleteModelFolder: true,
  outputPath: "./src/schemas",

  enumStyle: "type",

  customTypeMap: {
    "pg_catalog.tsvector": "string",
    "pg_catalog.bpchar": "string",
  },

  preRenderHooks: [generateKnexTablesModule, generateZodSchemas],
};
