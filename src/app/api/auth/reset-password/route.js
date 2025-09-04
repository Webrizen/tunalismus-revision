import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import connectToDB from "../../../../lib/mongodb";

export async function POST(req) {
  await connectToDB();

  const { token, password } = await req.json();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  user.password = await bcrypt.hash(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.status = "active"; // If the user was invited, they are now active.

  await user.save();

  return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
}
