import type { database } from "./client";

// The `transaction` handed to the callback of database.transaction(...).
export type DatabaseTransaction = Parameters<Parameters<typeof database.transaction>[0]>[0];

// Either the plain database or a transaction: for functions used both ways.
export type DatabaseOrTransaction = typeof database | DatabaseTransaction;
