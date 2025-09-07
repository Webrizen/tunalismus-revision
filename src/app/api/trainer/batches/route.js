import { NextResponse } from "next/server";
import Batch from "../../../../models/Batch";
import { connectToDB } from "../../../../lib/mongodb";
import { authorize } from "../../../../lib/auth";

export async function GET(req) {
  try {
    await connectToDB();

    const userRole = req.headers.get("X-User-Role");
    const userId = req.headers.get("X-User-Id");

    // Authorize trainer or admin. The hierarchy in `authorize` handles this.
    if (!authorize("trainer", userRole)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Admins see all batches, trainers only see their own.
    const query = userRole === 'admin' ? {} : { trainer: userId };

    const batches = await Batch.find(query).populate("course", "title level");

    return NextResponse.json({ batches }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/trainer/batches:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
