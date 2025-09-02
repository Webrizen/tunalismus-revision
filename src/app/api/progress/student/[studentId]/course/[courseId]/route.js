import { NextResponse } from "next/server";
import Progress from "../../../../../../../models/Progress";
import dbConnect from "../../../../../../../lib/mongodb";

export async function GET(req, { params }) {
  await dbConnect();

  const progress = await Progress.findOne({
    student: params.studentId,
    course: params.courseId,
  });

  if (!progress) {
    return NextResponse.json({ message: "Progress not found" }, { status: 404 });
  }

  return NextResponse.json({ progress }, { status: 200 });
}
