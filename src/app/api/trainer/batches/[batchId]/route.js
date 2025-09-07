import { NextResponse } from "next/server";
import Batch from "../../../../../models/Batch";
import { connectToDB } from "../../../../../lib/mongodb";
import { authorize } from "../../../../../lib/auth";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const userRole = req.headers.get("X-User-Role");
    const userId = req.headers.get("X-User-Id");

    if (!authorize("trainer", userRole)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { batchId } = params;

    const batch = await Batch.findById(batchId)
      .populate("course")
      .populate("students", "name email phone profileImage");

    if (!batch) {
      return NextResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    // If user is a trainer, ensure they are assigned to this batch
    if (userRole === 'trainer' && batch.trainer.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ batch }, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/trainer/batches/${params.batchId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
