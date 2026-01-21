import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Serums', 'Moisturizers', 'Cleansers', 'Treatments', 'Eye Care', 'Masks'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be positive'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  description: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    enum: ['Best Seller', 'New', 'Limited', 'Popular', null],
    default: null,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Product', productSchema);