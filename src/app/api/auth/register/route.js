import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import { connectToDB } from "../../../../lib/mongodb";

export async function POST(req) {
  console.log("Register API called");
  try {
    await connectToDB();
    console.log("DB connected");

    const { name, email, password, adminSecret } = await req.json();
    console.log("Request body:", { name, email, adminSecret });

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    let role = "student";
    if (adminSecret && adminSecret === process.env.ADMIN_CREATION_SECRET) {
      role = "admin";
    }
    console.log("Role:", role);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    console.log("User created:", user);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
