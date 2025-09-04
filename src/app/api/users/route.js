import { NextResponse } from "next/server";
import User from "../../../models/User";
import connectToDB from "../../../lib/mongodb";
import { authorize } from "../../../lib/auth";

export async function GET(req) {
  await connectToDB();

  const userRole = req.headers.get("X-User-Role");

  if (!authorize("admin", userRole)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const users = await User.find({}).select("-password");

  return NextResponse.json({ users }, { status: 200 });
}
