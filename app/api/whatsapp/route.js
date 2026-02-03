import { connectDB } from "@/lib/mongodb";
import WhatsappModel from "@/model/Whatsapp";

export async function GET() {
  await connectDB();
  const result = await WhatsappModel.findOne().sort({ createdAt: -1 });
  return Response.json({ number: result?.number || "" });
}
