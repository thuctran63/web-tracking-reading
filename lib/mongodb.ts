import mongoose from "mongoose";

type GlobalMongoose = typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalForMongoose = globalThis as GlobalMongoose;

const cached = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongoose = cached;

export async function connectToDatabase() {
  const mongodbUri = process.env.MONGODB_URI;
  const mongodbDbName = process.env.MONGODB_DB_NAME;
  if (!mongodbUri) {
    throw new Error("Please define the MONGODB_URI environment variable.");
  }
  if (!mongodbDbName) {
    throw new Error("Please define the MONGODB_DB_NAME environment variable.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri, {
      dbName: mongodbDbName,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
