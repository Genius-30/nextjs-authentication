import { connectDB } from "@/dbConfig/dbConfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!(email && password)) {
      return NextResponse.json(
        {
          message: "Please fill all the fields",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User doesn't exists!",
        },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          message: "Password is incorrect!",
        },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET!, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });

    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true,
    });
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
