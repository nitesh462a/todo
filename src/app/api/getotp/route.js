import User from "@/app/lib/models/user";
import Temp from "@/app/lib/models/tempuser";
import connectToDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  await connectToDB();

  const { email } = await req.json();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json(
      { success: false, message: "User already exists." },
      { status: 400 }
    );
  }

  const otp = generateOTP();
  const existing = await Temp.findOne({ email });

  if (existing) {
    existing.otp = otp;
    existing.createdAt = new Date();
    await existing.save();
  } else {
    await Temp.create({ email, otp, createdAt: new Date() });
  }

 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Auth App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif; padding:10px">
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h3>${otp}</h3>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
    }, { status: 202 });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email.",
      },
      { status: 500 }
    );
  }
}
