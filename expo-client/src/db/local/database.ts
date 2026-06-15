import * as SQLite from "expo-sqlite";

import { localSchemaStatements } from "./schema";

const databaseName = "salli.db";

export async function openLocalDatabase() {
  return SQLite.openDatabaseAsync(databaseName);
}

export async function initializeLocalDatabase() {
  const db = await openLocalDatabase();

  for (const statement of localSchemaStatements) {
    await db.execAsync(statement);
  }

  return db;
}
