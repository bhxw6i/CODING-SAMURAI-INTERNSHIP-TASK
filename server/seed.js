import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.model.js';

dotenv.config();

const products = [
  {
    name: "Luminous Glow Serum",
    category: "Serums",
    price: 125,
    image: "/src/assets/product-serum.jpg",
    description: "Brightening serum with vitamin C",
    badge: "Best Seller",
    stock: 50,
    inStock: true,
  },
  {
    name: "Midnight Recovery Oil",
    category: "Treatments",
    price: 89,
    image: "/src/assets/product-oil.jpg",
    description: "Nourishing night oil",
    badge: null,
    stock: 30,
    inStock: true,
  },
  {
    name: "Golden Elixir Moisturizer",
    category: "Moisturizers",
    price: 145,
    image: "/src/assets/product-moisturizer.jpg",
    description: "Luxury hydrating moisturizer",
    badge: "New",
    stock: 40,
    inStock: true,
  },
  {
    name: "Rose Petal Cleanser",
    category: "Cleansers",
    price: 68,
    image: "/src/assets/product-cleanser.jpg",
    description: "Gentle cleanser with rose petals",
    badge: null,
    stock: 60,
    inStock: true,
  },
  {
    name: "Velvet Touch Eye Cream",
    category: "Eye Care",
    price: 95,
    image: "/src/assets/product-eyecream.jpg",
    description: "Anti-aging eye cream",
    badge: "Limited",
    stock: 25,
    inStock: true,
  },
  {
    name: "Radiance Boost Mask",
    category: "Masks",
    price: 78,
    image: "/src/assets/product-mask.jpg",
    description: "Illuminating face mask",
    badge: null,
    stock: 35,
    inStock: true,
  },
  {
    name: "Hydra-Silk Night Cream",
    category: "Moisturizers",
    price: 135,
    image: "/src/assets/product-moisturizer.jpg",
    description: "Intensive overnight hydration",
    badge: null,
    stock: 45,
    inStock: true,
  },
  {
    name: "Vitamin C Brightening Serum",
    category: "Serums",
    price: 110,
    image: "/src/assets/product-serum.jpg",
    description: "Brightening and even-toning serum",
    badge: "Popular",
    stock: 55,
    inStock: true,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ros-ve-luxury-beauty');
    console.log('✅ MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();