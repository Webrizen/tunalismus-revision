import { NextResponse } from "next/server";
import Material from "../../../../models/Material";
import { connectToDB } from "../../../../lib/mongodb";
import { authorize } from "../../../../lib/auth";

export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const userRole = req.headers.get("X-User-Role");
    const userId = req.headers.get("X-User-Id");

    if (!authorize("trainer", userRole)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    const material = await Material.findById(id);

    if (!material) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
    }

    // A trainer can only delete their own materials. An admin can delete any.
    if (userRole === 'trainer' && material.uploadedBy.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Material.findByIdAndDelete(id);

    return NextResponse.json({ message: "Material deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(`Error in DELETE /api/materials/${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
