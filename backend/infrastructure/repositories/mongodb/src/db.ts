import mongoose, { Connection } from "mongoose";

export function connect(uri: string): Connection {
  mongoose.connect(uri, {
    authSource: "admin",
  });

  const db: Connection = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));

  return db;
}
