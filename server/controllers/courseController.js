const Course = require("../models/Course");
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, minPrice, maxPrice, sort } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.$text = { $search: search };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Course.find(filter).populate("instructor", "name avatar bio");

    if (sort === "price-asc") query = query.sort({ price: 1 });
    else if (sort === "price-desc") query = query.sort({ price: -1 });
    else if (sort === "rating") query = query.sort({ ratingAverage: -1 });
    else query = query.sort({ createdAt: -1 });

    const courses = await query;
    res.json({ count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "instructor",
      "name avatar bio"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const body = req.body;
    body.slug = slugify(body.title) + "-" + Date.now().toString().slice(-5);
    body.instructor = req.user._id;
    const course = await Course.create(body);
    res.status(201).json({ course });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (
      String(course.instructor) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to edit this course" });
    }
    Object.assign(course, req.body);
    await course.save();
    res.json({ course });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (
      String(course.instructor) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }
    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoriesSummary = async (req, res) => {
  try {
    const summary = await Course.aggregate([
      { $match: { published: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ categories: summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
