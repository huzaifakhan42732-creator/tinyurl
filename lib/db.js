import mongoose from "mongoose";
import fs from "fs";
import path from "path";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    uri: null,
  };
}

/**
 * Dynamically resolves MONGODB_URI.
 * Reads directly from .env.local or .env so changes reload instantly without server restart.
 */
function getMongoUri() {
  if (
    process.env.MONGODB_URI &&
    process.env.MONGODB_URI !== "your_mongodb_connection_string"
  ) {
    return process.env.MONGODB_URI;
  }

  try {
    const cwd = process.cwd();
    for (const file of [".env.local", ".env"]) {
      const fullPath = path.join(/*turbopackIgnore: true*/ cwd, file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8");
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
          const eqIdx = trimmed.indexOf("=");
          const key = trimmed.slice(0, eqIdx).trim();
          if (key === "MONGODB_URI") {
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1).trim();
            }
            if (val && val !== "your_mongodb_connection_string") {
              return val;
            }
          }
        }
      }
    }
  } catch (err) {
    // ignore filesystem read error and fall back to process.env
  }

  return process.env.MONGODB_URI;
}

async function connectDB() {
  const uri = getMongoUri();

  if (!uri || uri === "your_mongodb_connection_string") {
    throw new Error(
      "The MONGODB_URI in .env or .env.local is still empty or set to 'your_mongodb_connection_string'. Please paste your actual connection string and save the file."
    );
  }

  // If connection string changed, reset previous connection and reconnect
  if (cached.uri && cached.uri !== uri) {
    if (cached.conn) {
      await mongoose.disconnect();
    }
    cached.conn = null;
    cached.promise = null;
  }

  // If connection is already open, reuse it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.uri = uri;
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        console.log(">>> [MongoDB] Connected successfully!");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    cached.uri = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
