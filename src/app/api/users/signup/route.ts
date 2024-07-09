import { connectDB } from "@/dbConfig/dbConfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { EMAIL_TYPE_VERIFY } from "@/constants";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { userName, email, password } = await req.json();

    if (!(userName && email && password)) {
      return NextResponse.json(
        {
          message: "Please fill all the fields",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    await sendEmail({
      email,
      emailType: EMAIL_TYPE_VERIFY,
      userId: savedUser._id,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        savedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
