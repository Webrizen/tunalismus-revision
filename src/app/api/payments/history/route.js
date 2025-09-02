import { NextResponse } from "next/server";
import Payment from "../../../../models/Payment";
import dbConnect from "../../../../lib/mongodb";

export async function GET(req) {
  await dbConnect();

  const userId = req.headers.get("X-User-Id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payments = await Payment.find({ user: userId }).populate("course", "title");

  return NextResponse.json({ payments }, { status: 200 });
}
