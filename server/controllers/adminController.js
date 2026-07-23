const User = require("../models/User");
const Course = require("../models/Course");
const Order = require("../models/Order");
const Enrollment = require("../models/Enrollment");

// Overview stats
exports.getStats = async (req, res) => {
  try {
    const [totalStudents, totalCourses, totalOrders, paidOrders] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments({ published: true }),
      Order.countDocuments(),
      Order.find({ status: "paid" }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
    const totalEnrollments = await Enrollment.countDocuments();

    // Recent 7 days orders
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrders = await Order.countDocuments({
      status: "paid",
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      totalStudents,
      totalCourses,
      totalOrders,
      totalRevenue,
      totalEnrollments,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// All students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    // Get enrollment count per student
    const enriched = await Promise.all(
      students.map(async (s) => {
        const enrollments = await Enrollment.countDocuments({ student: s._id });
        return { ...s.toObject(), enrollments };
      })
    );

    res.json({ students: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// All orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// All enrollments
exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "title category")
      .sort({ createdAt: -1 });
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Refund an order
exports.refundOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = "refunded";
    await order.save();
    res.json({ message: "Order marked as refunded", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ student: req.params.id });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Revenue by course
exports.getRevenueByCourse = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: "$course", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: "$course" },
      { $project: { title: "$course.title", total: 1, count: 1 } },
      { $sort: { total: -1 } },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
