import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "User logged out successfully",
      status: 200,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), //Not as important
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
