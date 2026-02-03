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
    const { name, email, password } = await req.json();

    const admin = await Admin.findById(decoded.id);
    if (!admin)
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );

    const emailExists = await Admin.findOne({
      email,
      _id: { $ne: decoded.id },
    });
    if (emailExists)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );

    admin.name = name;
    admin.email = email;
    await admin.save();

    return NextResponse.json({ success: true, admin: admin });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
