import { NextResponse } from "next/server";
import Material from "../../../../models/Material";
import dbConnect from "../../../../lib/mongodb";
import { authorize } from "../../../../lib/auth";

export async function DELETE(req, { params }) {
  await dbConnect();

  const userRole = req.headers.get("X-User-Role");

  if (!authorize("trainer", userRole)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const deletedMaterial = await Material.findByIdAndDelete(params.id);

  if (!deletedMaterial) {
    return NextResponse.json({ message: "Material not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Material deleted successfully" }, { status: 200 });
}
