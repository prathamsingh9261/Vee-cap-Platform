const Course = require("../models/Course");
const Order = require("../models/Order");
const Enrollment = require("../models/Enrollment");

// Overview stats for instructor
exports.getInstructorStats = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const myCourses = await Course.find({ instructor: instructorId });
    const courseIds = myCourses.map((c) => c._id);

    const totalCourses = myCourses.length;
    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const paidOrders = await Order.find({ course: { $in: courseIds }, status: "paid" });
    const totalEarnings = paidOrders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = paidOrders.length;

    res.json({ totalCourses, totalStudents, totalEarnings, totalOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get instructor's own courses with stats
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });

    const enriched = await Promise.all(
      courses.map(async (c) => {
        const enrollments = await Enrollment.countDocuments({ course: c._id });
        const paidOrders = await Order.find({ course: c._id, status: "paid" });
        const earnings = paidOrders.reduce((sum, o) => sum + o.amount, 0);
        return { ...c.toObject(), enrollments, earnings };
      })
    );

    res.json({ courses: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students enrolled in instructor's courses
exports.getMyStudents = async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user._id }).select("_id title");
    const courseIds = myCourses.map((c) => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student", "name email createdAt")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get earnings breakdown per course
exports.getMyEarnings = async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user._id }).select("_id title price");
    const courseIds = myCourses.map((c) => c._id);

    const orders = await Order.find({ course: { $in: courseIds }, status: "paid" })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    // Group by course
    const byCourse = {};
    orders.forEach((o) => {
      const key = o.course?._id?.toString();
      if (!byCourse[key]) {
        byCourse[key] = { title: o.course?.title, total: 0, count: 0 };
      }
      byCourse[key].total += o.amount;
      byCourse[key].count += 1;
    });

    res.json({ earnings: Object.values(byCourse), recentOrders: orders.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update instructor profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = req.user;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, bio: user.bio, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
