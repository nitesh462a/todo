import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from "@/app/lib/models/user";
import connectToDB from "@/app/lib/db";

export async function POST(req) {
  await connectToDB();

  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ success: false, message: 'Token and password are required.' }, { status: 400 });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: 'User not found or password not updated.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Reset Error:', error);
    return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 401 });
  }
}
