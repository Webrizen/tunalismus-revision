import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import { connectToDB } from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    await connectToDB();

    const { name, email, password, adminSecret } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let role = "student";
    if (adminSecret && adminSecret === process.env.ADMIN_CREATION_SECRET) {
      role = "admin";
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
