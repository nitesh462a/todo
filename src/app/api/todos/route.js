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

export async function GET() {
  try {
    const userId =await getUserIdFromToken();
    await connectToDB();
    const todos = await Todo.find({ userId });
    return NextResponse.json(todos);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    const userId =await getUserIdFromToken();
    const { text } = await req.json();
    await connectToDB();
    const todo = await Todo.create({ userId, text, completed: false });
    return NextResponse.json(todo);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const userId = await getUserIdFromToken();
    const { _id, completed } = await req.json();
    await connectToDB();
    const updated = await Todo.findOneAndUpdate({ _id, userId }, { completed }, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Error updating" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId =await getUserIdFromToken();
    const { _id } = await req.json();
    await connectToDB();
    const deleted = await Todo.findOneAndDelete({ _id, userId });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
