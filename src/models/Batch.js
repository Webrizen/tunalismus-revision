import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    schedule: { type: String }, // e.g. "Mon-Wed-Fri 6PM"
  },
  { timestamps: true }
);

export default mongoose.models.Batch || mongoose.model("Batch", BatchSchema);
