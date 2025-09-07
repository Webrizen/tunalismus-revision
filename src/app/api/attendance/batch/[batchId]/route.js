import { NextResponse } from "next/server";
import Attendance from "../../../../../models/Attendance";
import Batch from "../../../../../models/Batch";
import { connectToDB } from "../../../../../lib/mongodb";
import { authorize } from "../../../../../lib/auth";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const userRole = req.headers.get("X-User-Role");
    const userId = req.headers.get("X-User-Id");

    // Authorize trainer or admin
    if (!authorize("trainer", userRole)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { batchId } = params;

    // Verify trainer is assigned to this batch if they are not an admin
    if (userRole === 'trainer') {
      const batch = await Batch.findById(batchId);
      if (!batch || batch.trainer.toString() !== userId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    const attendance = await Attendance.find({ batch: batchId }).populate(
      "student",
      "name email"
    );

    return NextResponse.json({ attendance }, { status: 200 });
  } catch (error) {
    console.error(
      `Error in GET /api/attendance/batch/${params.batchId}:`,
      error
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    await connectToDB();

    const userRole = req.headers.get("X-User-Role");
    const userId = req.headers.get("X-User-Id");

    // Authorize trainer or admin
    if (!authorize("trainer", userRole)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { batchId } = params;

    // Verify trainer is assigned to this batch if they are not an admin
    if (userRole === 'trainer') {
      const batch = await Batch.findById(batchId);
      if (!batch || batch.trainer.toString() !== userId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    const { studentId, date, status } = await req.json();

    if (!studentId || !date || !status) {
      return NextResponse.json(
        { message: "Student, date, and status are required" },
        { status: 400 }
      );
    }

    const attendance = await Attendance.findOneAndUpdate(
      { batch: batchId, student: studentId, date: new Date(date) },
      { status },
      { new: true, upsert: true } // Create if not exists, update if it does
    );

    return NextResponse.json({ attendance }, { status: 201 });
  } catch (error) {
    console.error(
      `Error in POST /api/attendance/batch/${params.batchId}:`,
      error
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
