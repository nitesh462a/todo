import User from "@/app/lib/models/user";
import connectToDB from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';


export async function POST(req) {
    try {
        await connectToDB();
        const {name,email,password}=await req.json()
        const userexist=await User.findOne({email})
        if(userexist){
            return NextResponse.json({error:"user already"})
        }
        const hashpass = await bcrypt.hash(password, 10);

        const newUser=new User({
            name,
            email,
            password:hashpass
        })
        await newUser.save()
        return NextResponse.json({message:"user register" ,status:201})
    } catch (error) {
         return NextResponse.json({message:error.message ,status:500})
    }
    
}