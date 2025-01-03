import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_USER = process.env.MONGODB_USER!;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD!;

export function connect(): Connection {
  mongoose.connect(MONGODB_URI, {
    authSource: "admin",
    user: MONGODB_USER,
    pass: MONGODB_PASSWORD,
  });

  const db: Connection = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));

  return db;
}
