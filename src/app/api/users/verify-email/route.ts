import { connectDB } from "@/dbConfig/dbConfig";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { verifyToken } = await req.json();

    const user = await User.findOne({
      verifyToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid token!" }, { status: 400 });
    }

    // const verifiedUser = await User.findByIdAndUpdate(
    //   user?._id,
    //   {
    //     isVerified: true,
    //     verifyToken: undefined,
    //     verifyTokenExpiry: undefined,
    //   },
    //   {
    //     new: true,
    //   }
    // );

    // if (!verifiedUser) {
    //   return NextResponse.json(
    //     { message: "Something went wrong!" },
    //     { status: 400 }
    //   );
    // }

    (user.isVerified = true),
      (user.verifyToken = undefined),
      (user.verifyTokenExpiry = undefined),
      await user.save();

    return NextResponse.json(
      {
        message: "User verified successfully!",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
