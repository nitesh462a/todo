import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import DashboardClient from "../components/dashboardclient";

export default async function DashboardPage() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let userData;
  try {
    userData = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    redirect("/login");
  }

  return <DashboardClient />;
}
