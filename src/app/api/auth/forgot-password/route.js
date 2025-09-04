import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "../../../../models/User";
import { connectToDB } from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    await connectToDB();

    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Password reset email sent" },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    return NextResponse.json(
      { message: "Password reset email sent", resetToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
