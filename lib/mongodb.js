import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  // Skip connection during build time when MONGODB_URI is not available
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI not defined, skipping database connection");
    return;
  }

  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("DB connection error");
  }
}
