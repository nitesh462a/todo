import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDB from "@/app/lib/db";
import { Todo } from "@/app/lib/models/todo";
import { NextResponse } from "next/server";


const getUserIdFromToken = async () => {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

export async function DELETE() {
  try {
    const userId =await getUserIdFromToken();
    
    await connectToDB();
    const deleted = await Todo.deleteMany({ userId });
    return NextResponse.json(deleted);
  } catch (err) {
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
