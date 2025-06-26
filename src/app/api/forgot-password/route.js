import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from "@/app/lib/models/user";
import connectToDB from "@/app/lib/db";     

export async function POST(req) {
  await connectToDB();
  const { email } = await req.json();

 
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({
      success: false,
      message: 'No account found with that email.',
    }, { status: 404 });
  }

 
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: 'Reset link sent to your email.'
    });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({
      success: false,
      message: 'Failed to k send email.'
    }, { status: 500 });
  }
}
