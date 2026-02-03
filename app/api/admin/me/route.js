import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/model/Admin";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req) {
  try {
    // ✅ 1. Connect to DB
    await connectDB();

    // ✅ 2. Read token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    // ✅ 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ 4. Find admin by ID
    const admin = await Admin.findById(decoded.id).select("-password"); // hide password
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // ✅ 5. Return admin info
    return NextResponse.json({
      success: true,
      admin: admin,
    });
  } catch (err) {
    console.error("Error verifying admin:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
