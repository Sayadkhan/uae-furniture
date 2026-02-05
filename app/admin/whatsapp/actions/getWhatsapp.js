"use server";

import { connectDB } from "@/lib/mongodb";
import WhatsappModel from "@/model/Whatsapp";

export async function getWhatsappNumber() {
  // Skip during build if no DB connection
  if (!process.env.MONGODB_URI) {
    return "";
  }
  
  await connectDB();
  const result = await WhatsappModel.findOne().sort({ createdAt: -1 });
  return result?.number || "";
}
