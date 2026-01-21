import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    default: 'card',
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  stripePaymentIntentId: String,
  subtotal: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
}, {
  timestamps: true,
});

export default mongoose.model('Order', orderSchema);