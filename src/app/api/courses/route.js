import { NextResponse } from "next/server";
import Course from "../../../models/Course";
import connectToDB from "../../../lib/mongodb";
import { authorize } from "../../../lib/auth";

export async function POST(req) {
  await connectToDB();

  const userRole = req.headers.get("X-User-Role");

  if (!authorize("admin", userRole)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { title, description, level, durationWeeks, price } = await req.json();

  if (!title || !level || !durationWeeks || !price) {
    return NextResponse.json(
      { message: "Title, level, duration, and price are required" },
      { status: 400 }
    );
  }

  const course = await Course.create({
    title,
    description,
    level,
    durationWeeks,
    price,
  });

  return NextResponse.json({ course }, { status: 201 });
}

export async function GET(req) {
  await connectToDB();

  const courses = await Course.find({});

  return NextResponse.json({ courses }, { status: 200 });
}
