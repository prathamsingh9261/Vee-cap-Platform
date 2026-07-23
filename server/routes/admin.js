const express = require("express");
const router = express.Router();
const {
  getStats,
  getStudents,
  getOrders,
  getEnrollments,
  refundOrder,
  deleteStudent,
  getRevenueByCourse,
} = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect);
router.use(restrictTo("admin"));

router.get("/stats", getStats);
router.get("/students", getStudents);
router.delete("/students/:id", deleteStudent);
router.get("/orders", getOrders);
router.patch("/orders/:id/refund", refundOrder);
router.get("/enrollments", getEnrollments);
router.get("/revenue-by-course", getRevenueByCourse);

module.exports = router;
