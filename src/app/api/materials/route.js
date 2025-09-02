import { NextResponse } from "next/server";
import Material from "../../../models/Material";
import dbConnect from "../../../lib/mongodb";
import { authorize } from "../../../lib/auth";

export async function POST(req) {
  await dbConnect();

  const userRole = req.headers.get("X-User-Role");

  if (!authorize("trainer", userRole)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { title, fileUrl, type, course, batch } = await req.json();

  if (!title || !fileUrl) {
    return NextResponse.json(
      { message: "Title and fileUrl are required" },
      { status: 400 }
    );
  }

  if (!course && !batch) {
    return NextResponse.json(
      { message: "Course or batch is required" },
      { status: 400 }
    );
  }

  const material = await Material.create({
    title,
    fileUrl,
    type,
    course,
    batch,
  });

  return NextResponse.json({ material }, { status: 201 });
}
