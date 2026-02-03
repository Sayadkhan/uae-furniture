import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Admin from "@/model/Admin";
import { connectDB } from "@/lib/mongodb";
import ProfileClient from "./ProfileClient";


async function getAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey"
    );
    await connectDB();
    const admin = await Admin.findById(decoded.id).select("-password");
    return  JSON.parse(JSON.stringify(admin))
  } catch {
    return null;
  }
}
export const dynamic = 'force-dynamic';

const Profile = async () => {

  const data = await getAdminFromCookies();



  return (
    <div>
      <ProfileClient data={data} />
    </div>
  )
}

export default Profile
