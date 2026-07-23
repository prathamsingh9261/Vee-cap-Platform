const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, default: "" },
  duration: { type: Number, default: 0 }, // minutes
  content: { type: String, default: "" },
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["Career", "Arts", "Business", "Developer", "Science", "Law", "MBBS", "BCS"],
    },
    level: {
      type: String,
      enum: ["All levels", "Beginner", "Intermediate", "Advanced"],
      default: "All levels",
    },
    price: { type: Number, required: true, default: 0 }, // 0 = free course
    discountPrice: { type: Number, default: null },
    currency: { type: String, default: "inr" },
    thumbnail: { type: String, default: "" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sections: [sectionSchema],
    totalDurationMinutes: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Course", courseSchema);
