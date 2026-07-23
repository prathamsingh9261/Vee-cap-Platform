const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getOrderById,
  getMyOrders,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

// NOTE: the raw webhook route (/api/payments/webhook) is mounted separately in server.js
// BEFORE the json body-parser, because Razorpay needs the raw request body to verify signatures.

router.post("/create-order/:courseId", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/order/:orderId", protect, getOrderById);
router.get("/my-orders", protect, getMyOrders);

module.exports = router;
