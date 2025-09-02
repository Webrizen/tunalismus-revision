import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "../../../../models/User";
import dbConnect from "../../../../lib/mongodb";

export async function POST(req) {
  await dbConnect();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    // To prevent email enumeration, we don't want to reveal that the user doesn't exist.
    // We'll send a success response, but we won't send an email.
    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // TODO: Implement email sending for password reset.
  // This is a placeholder implementation. In a production environment,
  // you should send an email to the user with a link to reset their
  // password. The link should contain the `resetToken`.
  // For now, we will return the token in the response for testing purposes.

  return NextResponse.json({ message: "Password reset email sent", resetToken }, { status: 200 });
}
