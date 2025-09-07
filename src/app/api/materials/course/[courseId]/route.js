import { NextResponse } from "next/server";
import Material from "../../../../../models/Material";
import Batch from "../../../../../models/Batch";
import { connectToDB } from "../../../../../lib/mongodb";
import { authorize } from "../../../../../lib/auth";

async function verifyAccess(userRole, userId, courseId) {
  if (userRole === 'admin') {
    return true;
  }
  if (userRole === 'trainer') {
    const batch = await Batch.findOne({ course: courseId, trainer: userId });
    return !!batch;
  }
  return false;
}

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const userRole = req.headers.get("X-User-Role");
    const userId = req.headers.get("X-User-Id");

    if (!authorize("trainer", userRole)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { courseId } = params;
    const hasAccess = await verifyAccess(userRole, userId, courseId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const materials = await Material.find({ course: courseId });

    return NextResponse.json({ materials }, { status: 200 });
  } catch (error) {
    console.error(
      `Error in GET /api/materials/course/${params.courseId}:`,
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

    if (!authorize("trainer", userRole)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { courseId } = params;
    const hasAccess = await verifyAccess(userRole, userId, courseId);
    if (!hasAccess) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, fileUrl, type } = await req.json();

    if (!title || !fileUrl || !type) {
      return NextResponse.json(
        { message: "Title, file URL, and type are required" },
        { status: 400 }
      );
    }

    const material = await Material.create({
      title,
      fileUrl,
      type,
      course: courseId,
      uploadedBy: userId,
    });

    return NextResponse.json({ material }, { status: 201 });
  } catch (error) {
    console.error(
      `Error in POST /api/materials/course/${params.courseId}:`,
      error
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
