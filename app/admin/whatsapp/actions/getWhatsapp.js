"use server";

import { connectDB } from "@/lib/mongodb";
import WhatsappModel from "@/model/Whatsapp";

export async function getWhatsappNumber() {
  await connectDB();
  const result = await WhatsappModel.findOne().sort({ createdAt: -1 });
  return result?.number || "";
}
