const express = require("express");
const router = express.Router();
const {
  getInstructorStats,
  getMyCourses,
  getMyStudents,
  getMyEarnings,
  updateProfile,
} = require("../controllers/instructorController");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect);
router.use(restrictTo("instructor", "admin"));

router.get("/stats", getInstructorStats);
router.get("/my-courses", getMyCourses);
router.get("/my-students", getMyStudents);
router.get("/my-earnings", getMyEarnings);
router.patch("/profile", updateProfile);

module.exports = router;
