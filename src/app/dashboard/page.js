import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import DashboardClient from "../dasboardclient/page";

export default async function DashboardPage() {
  const cookieStore = await cookies(); // ✅ Await cookies
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let userData;
  try {
    userData = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    redirect("/login");
  }

  return <DashboardClient token={token} userData={userData} />;
}
