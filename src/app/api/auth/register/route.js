import User from "@/app/lib/models/user";
import connectToDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Temp from "@/app/lib/models/tempuser";

export async function POST(req) {
    try {
        await connectToDB();
        const { name, email, password, otp } = await req.json();

        const userexistintemp = await Temp.findOne({ email });
        if (!userexistintemp) {
          return NextResponse.json({ message: "User not found or OTP expired" }, { status: 400});

        }

        if (userexistintemp.otp !== otp) {
            return NextResponse.json({ message: "OTP does not match" }, { status: 400 });
        }

        const hashpass = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashpass,
        });

        await newUser.save();

       
        await Temp.deleteOne({ email });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
