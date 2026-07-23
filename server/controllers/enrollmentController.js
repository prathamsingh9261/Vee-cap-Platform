const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Enroll directly in a free course (price === 0). Paid courses go through paymentController.
exports.enrollFree = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.price > 0) {
      return res.status(400).json({ message: "This course requires payment. Use checkout instead." });
    }

    const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
    if (existing) return res.status(409).json({ message: "Already enrolled in this course" });

    const enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
    course.studentsCount += 1;
    await course.save();

    res.status(201).json({ enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate({
      path: "course",
      select: "title slug thumbnail category level instructor",
      populate: { path: "instructor", select: "name" },
    });
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { lessonId, totalLessons } = req.body;
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    enrollment.progressPercent = Math.min(
      100,
      Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    );
    if (enrollment.progressPercent === 100) enrollment.certificateIssued = true;

    await enrollment.save();
    res.json({ enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
