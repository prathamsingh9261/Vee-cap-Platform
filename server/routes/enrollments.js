const express = require("express");
const router = express.Router();
const {
  enrollFree,
  getMyEnrollments,
  updateProgress,
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/my", getMyEnrollments);
router.post("/free/:courseId", enrollFree);
router.patch("/progress/:courseId", updateProgress);

module.exports = router;
