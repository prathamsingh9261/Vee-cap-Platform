const crypto = require("crypto");
const Razorpay = require("razorpay");
const Course = require("../models/Course");
const Order = require("../models/Order");
const Enrollment = require("../models/Enrollment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create a Razorpay order for a paid course. The frontend uses this to open the
//    Razorpay Checkout popup (no redirect needed, unlike Stripe).
exports.createOrder = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.price <= 0) {
      return res.status(400).json({ message: "This course is free. Use the free enroll endpoint." });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: course._id,
    });
    if (alreadyEnrolled) {
      return res.status(409).json({ message: "You are already enrolled in this course" });
    }

    const finalPrice = course.discountPrice ?? course.price;
    const currency = (course.currency || "inr").toUpperCase();

    // Pending order in our own DB — becomes the source of truth once payment is verified
    const order = await Order.create({
      student: req.user._id,
      course: course._id,
      amount: finalPrice,
      currency: course.currency || "inr",
      status: "pending",
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalPrice * 100), // smallest currency unit (paise for INR)
      currency,
      receipt: order._id.toString(),
      notes: {
        orderId: order._id.toString(),
        courseId: course._id.toString(),
        studentId: req.user._id.toString(),
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order._id,
      courseName: course.title,
      studentName: req.user.name,
      studentEmail: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Verify the payment signature returned by the Razorpay Checkout popup after a successful
//    payment. This signature is generated using our secret key, so a valid signature can only
//    come from Razorpay itself — it cannot be forged by the client.
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "failed" });
      return res.status(400).json({ message: "Payment verification failed — signature mismatch" });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "paid") {
      order.status = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      order.invoiceNumber = `INV-${Date.now()}`;
      await order.save();

      const existingEnrollment = await Enrollment.findOne({
        student: order.student,
        course: order.course,
      });
      if (!existingEnrollment) {
        await Enrollment.create({
          student: order.student,
          course: order.course,
          order: order._id,
        });
        await Course.findByIdAndUpdate(order.course, { $inc: { studentsCount: 1 } });
      }
    }

    res.json({ message: "Payment verified", orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Razorpay webhook — a server-to-server backup confirmation in case the browser closes
//    before the frontend calls /verify. Mounted on the raw body in server.js so we can check
//    the signature Razorpay sends in the x-razorpay-signature header.
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body) // raw Buffer
      .digest("hex");

    if (signature !== expected) {
      console.error("Razorpay webhook signature mismatch");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.status !== "paid") {
          order.status = "paid";
          order.razorpayPaymentId = paymentEntity.id;
          order.invoiceNumber = order.invoiceNumber || `INV-${Date.now()}`;
          await order.save();

          const existingEnrollment = await Enrollment.findOne({
            student: order.student,
            course: order.course,
          });
          if (!existingEnrollment) {
            await Enrollment.create({ student: order.student, course: order.course, order: order._id });
            await Course.findByIdAndUpdate(order.course, { $inc: { studentsCount: 1 } });
          }
        }
      }
    }

    if (event.event === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      if (paymentEntity?.order_id) {
        await Order.findOneAndUpdate({ razorpayOrderId: paymentEntity.order_id }, { status: "failed" });
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 4. Used by the success page to display order/invoice details
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("course", "title slug thumbnail");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user._id })
      .populate("course", "title slug thumbnail")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
