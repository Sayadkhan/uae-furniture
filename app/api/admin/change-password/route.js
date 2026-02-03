import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/model/Admin";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = await req.json();

    const admin = await Admin.findById(decoded.id);
    if (!admin)
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
