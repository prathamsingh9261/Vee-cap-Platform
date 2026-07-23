const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progressPercent: { type: Number, default: 0 },
    completedLessons: [{ type: String }], // lesson _id strings
    certificateIssued: { type: Boolean, default: false },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null }, // null = free enroll
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
