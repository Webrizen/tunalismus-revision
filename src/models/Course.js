import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      required: true,
    },
    durationWeeks: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
