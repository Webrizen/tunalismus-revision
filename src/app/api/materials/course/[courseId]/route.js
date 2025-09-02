import { NextResponse } from "next/server";
import Material from "../../../../../models/Material";
import dbConnect from "../../../../../lib/mongodb";

export async function GET(req, { params }) {
  await dbConnect();

  const materials = await Material.find({ course: params.courseId });

  return NextResponse.json({ materials }, { status: 200 });
}
