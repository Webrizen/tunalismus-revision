import { NextResponse } from "next/server";
import Material from "../../../../../models/Material";
import connectToDB from "../../../../../lib/mongodb";

export async function GET(req, { params }) {
  await connectToDB();

  const materials = await Material.find({ course: params.courseId });

  return NextResponse.json({ materials }, { status: 200 });
}
