"use server";

import { connectDB } from "@/lib/mongodb";
import WhatsappModel from "@/model/Whatsapp";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const whatsappSchema = z.object({
  whatsapp: z.string().min(8, "Enter a valid WhatsApp number!"),
});

export async function addWhatsappNumber(formData) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";
  
  const isAllowed = await rateLimit(ip, { limit: 3, windowMs: 60000 });
  if (!isAllowed) {
    return { success: false, message: "Too many requests. Please try again later." };
  }

  const rawData = {
    whatsapp: formData.get("whatsapp"),
  };

  const validation = whatsappSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message };
  }

  const { whatsapp } = validation.data;

  await connectDB();

  await WhatsappModel.deleteMany();
  await WhatsappModel.create({ number: whatsapp });

  return { success: true, message: "WhatsApp number updated successfully!" };
}
