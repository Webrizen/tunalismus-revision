import { NextResponse } from "next/server";
import Course from "../../../../models/Course";
import dbConnect from "../../../../lib/mongodb";
import { authorize } from "../../../../lib/auth";

export async function GET(req, { params }) {
  await dbConnect();

  const course = await Course.findById(params.id);

  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ course }, { status: 200 });
}

export async function PUT(req, { params }) {
  await dbConnect();

  const userRole = req.headers.get("X-User-Role");

  if (!authorize("admin", userRole)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { title, description, level, durationWeeks, price } = await req.json();

  const updatedCourse = await Course.findByIdAndUpdate(
    params.id,
    { title, description, level, durationWeeks, price },
    { new: true }
  );

  if (!updatedCourse) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ course: updatedCourse }, { status: 200 });
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const userRole = req.headers.get("X-User-Role");

  if (!authorize("admin", userRole)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const deletedCourse = await Course.findByIdAndDelete(params.id);

  if (!deletedCourse) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
}
