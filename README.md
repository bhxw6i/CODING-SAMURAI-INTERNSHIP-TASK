# Roséve Luxury Beauty - MERN Stack E-Commerce

A full-stack luxury beauty e-commerce platform built with MERN stack (MongoDB, Express, React, Node.js) featuring authentication and Razorpay payment gateway integration.

## 🚀 Features

- **Authentication**: User registration, login, and JWT-based session management
- **Shopping Cart**: Add, update, and remove products from cart
- **Payment Gateway**: Razorpay integration for secure payment processing
- **Order Management**: Create orders and track order history
- **Product Management**: Browse products by category
- **Protected Routes**: Secure checkout and user dashboard
- **Responsive Design**: Beautiful, mobile-friendly UI with Tailwind CSS

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- MongoDB (local or MongoDB Atlas)
- Razorpay account (for payment processing)

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in `server/` directory:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies (from root directory):**
   ```bash
   npm install
   ```

2. **Create `.env` file in root directory:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 📖 Project Structure

```
├── server/                 # Backend (Express + MongoDB)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Helper functions
│   ├── server.js          # Express server
│   └── seed.js            # Database seed script
├── src/                   # Frontend (React + TypeScript)
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts (Auth, Cart)
│   ├── lib/               # API client
│   ├── pages/             # Page components
│   └── App.tsx            # Main app component
├── public/                # Static files
└── README.md
```

## 🔐 Authentication

- **Register**: `/register` - Create a new account
- **Login**: `/login` - Sign in to your account
- **Protected Routes**: Checkout requires authentication

## 💳 Payment Gateway

This project uses **Razorpay** for secure payment processing:

1. Sign up at https://razorpay.com
2. Get your Key ID and Key Secret from the dashboard
3. Add them to your `.env` files in both frontend and backend
4. The payment flow is handled entirely by Razorpay's secure modal

### Test Razorpay Payments

Use Razorpay's test mode with test cards. Visit Razorpay's documentation for test card details.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=categoryName` - Get products by category
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart` - Add item to cart (requires auth)
- `PUT /api/cart/:itemId` - Update cart item quantity (requires auth)
- `DELETE /api/cart/:itemId` - Remove item from cart (requires auth)
- `DELETE /api/cart` - Clear entire cart (requires auth)

### Orders
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)
- `POST /api/orders` - Create order (requires auth)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order (requires auth)
- `POST /api/payments/verify-payment` - Verify payment signature (requires auth)

## 🌐 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use production MongoDB (Atlas recommended)
3. Replace test Razorpay keys with live keys
4. Set up proper environment variables on your hosting platform
5. Configure CORS settings appropriately
6. Enable HTTPS for secure connections

**Popular Hosting Options:**
- **Backend**: Heroku, Render, Railway, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages, AWS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion

