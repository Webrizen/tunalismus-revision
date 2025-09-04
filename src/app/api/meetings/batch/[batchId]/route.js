import { NextResponse } from "next/server";
import Batch from "../../../../../models/Batch";
import connectToDB from "../../../../../lib/mongodb";

export async function GET(req, { params }) {
  await connectToDB();

  const batch = await Batch.findById(params.batchId);

  if (!batch) {
    return NextResponse.json({ message: "Batch not found" }, { status: 404 });
  }

  const meetingUrl = `${process.env.JITSI_SERVER_URL}/${params.batchId}`;

  return NextResponse.json({ meetingUrl }, { status: 200 });
}
