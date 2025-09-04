import { NextResponse } from "next/server";
import Attendance from "../../../../../models/Attendance";
import { connectToDB } from "../../../../../lib/mongodb";

export async function GET(req, { params }) {
  await connectToDB();

  const attendance = await Attendance.find({ batch: params.batchId }).populate(
    "student",
    "name email"
  );

  return NextResponse.json({ attendance }, { status: 200 });
}
