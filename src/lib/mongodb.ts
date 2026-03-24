import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/videocall';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Extend the global type to include mongoose
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global.mongoose || { conn: null, promise: null }) as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!global.mongoose) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.mongoose = cached as any;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
