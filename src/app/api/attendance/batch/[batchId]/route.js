import { NextResponse } from "next/server";
import Attendance from "../../../../../models/Attendance";
import dbConnect from "../../../../../lib/mongodb";

export async function GET(req, { params }) {
  await dbConnect();

  const attendance = await Attendance.find({ batch: params.batchId }).populate(
    "student",
    "name email"
  );

  return NextResponse.json({ attendance }, { status: 200 });
}
