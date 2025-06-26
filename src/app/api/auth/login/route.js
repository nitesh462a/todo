import jwt from 'jsonwebtoken';
import User from "@/app/lib/models/user";
import connectToDB from "@/app/lib/db";
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await connectToDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 422 });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    const isValid = await bcrypt.compare(password, existingUser.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email,name:existingUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      path: '/',
      maxAge: 60 * 60 * 24, 
    });

    return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
