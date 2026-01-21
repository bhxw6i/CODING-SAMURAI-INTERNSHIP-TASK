import express from 'express';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { shippingAddress, paymentIntentId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const shipping = subtotal > 150 ? 0 : 15;
    const total = subtotal + shipping;

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      total,
      stripePaymentIntentId: paymentIntentId,
      isPaid: false,
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    await order.populate('items.product');
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;