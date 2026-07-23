const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategoriesSummary,
} = require("../controllers/courseController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/", getCourses);
router.get("/categories/summary", getCategoriesSummary);
router.get("/:slug", getCourseBySlug);

router.post("/", protect, restrictTo("instructor", "admin"), createCourse);
router.patch("/:id", protect, restrictTo("instructor", "admin"), updateCourse);
router.delete("/:id", protect, restrictTo("instructor", "admin"), deleteCourse);

module.exports = router;
