import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Initialize Razorpay only if keys are provided
const razorpayKey = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpay = (razorpayKey && razorpaySecret) ? new Razorpay({
  key_id: razorpayKey,
  key_secret: razorpaySecret,
}) : null;

// All payment routes require authentication
router.use(protect);

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.' 
      });
    }

    const { amount, currency = 'INR', shippingAddress } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `order_${req.user._id}_${Date.now()}`,
    });

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      items: [], // Will be populated from cart
      shippingAddress,
      total: amount,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      _id: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payments/verify-payment
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify signature
    const body = order.razorpayOrderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ 
        success: false,
        message: 'Payment verification failed' 
      });
    }

    // Update order status
    order.paymentStatus = 'completed';
    order.razorpayPaymentId = paymentId;
    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;