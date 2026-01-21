# Roséve Luxury Beauty - Backend Setup Guide

Complete setup guide for the MERN backend with MongoDB, Express, and Razorpay integration.

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

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

### 3. MongoDB Setup

Set up MongoDB for your development environment:

**Option A: Local MongoDB**

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Install and MongoDB should run as a service automatically
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get your connection string
- Update `MONGODB_URI` in `.env`:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
  ```

### 4. Razorpay Setup

1. Sign up at https://razorpay.com/
2. Navigate to **Settings** → **API Keys**
3. Copy your **Key ID** (starts with `rzp_test_`)
4. Copy your **Key Secret**
5. Add them to `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key_here
   ```

### 5. Seed Database (Optional)

Populate the database with sample products:

```bash
npm run seed
```

This will add 8 sample beauty products to your database.

### 6. Start the Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

---

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires auth token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=Serums` - Filter by category
- `GET /api/products/:id` - Get single product

### Shopping Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart` - Add item to cart
  ```json
  {
    "productId": "507f1f77bcf86cd799439011",
    "quantity": 1
  }
  ```

- `PUT /api/cart/:itemId` - Update cart item quantity
  ```json
  {
    "quantity": 2
  }
  ```

- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Create order
  ```json
  {
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States"
    }
  }
  ```

- `GET /api/orders` - Get all orders for user
- `GET /api/orders/:id` - Get specific order

### Payments (Razorpay)
- `POST /api/payments/create-order` - Create Razorpay order
  ```json
  {
    "amount": 129.99,
    "currency": "INR",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States"
    }
  }
  ```

- `POST /api/payments/verify-payment` - Verify payment signature
  ```json
  {
    "orderId": "507f1f77bcf86cd799439011",
    "paymentId": "pay_xxxxxxxxxxxxx",
    "signature": "xxxxxxxxxxxxx"
  }
  ```

---

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user'),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  category: String (Serums, Moisturizers, Cleansers, Treatments, Eye Care, Masks),
  price: Number,
  image: String,
  description: String,
  badge: String (Best Seller, New, Limited, etc.),
  stock: Number,
  inStock: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model
```javascript
{
  user: ObjectId (reference to User),
  items: [
    {
      product: ObjectId (reference to Product),
      quantity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId (reference to User),
  items: Array,
  shippingAddress: Object,
  total: Number,
  paymentMethod: String,
  paymentStatus: String (pending, completed, failed),
  orderStatus: String (pending, processing, delivered),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Features

### ✅ Authentication
- User registration with email/password
- JWT-based authentication with 7-day expiry
- Protected routes with authentication middleware
- User profile management

### ✅ Shopping Cart
- Add/remove items dynamically
- Update quantities in real-time
- One cart per authenticated user
- Server-side cart persistence

### ✅ Payment Gateway
- Razorpay secure payment modal
- Payment signature verification
- Secure order creation
- Real-time payment status updates

### ✅ Order Management
- Order creation from cart
- Complete order history per user
- Order status tracking
- Automatic cart clearing after successful payment

### ✅ Product Management
- 8 pre-seeded beauty products
- Category filtering (Serums, Moisturizers, Cleansers, etc.)
- Product details and images
- Stock availability tracking

---

## Testing the Application

### 1. Register a User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Add Product to Cart
```bash
POST http://localhost:5000/api/cart
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1
}
```

### 4. Create Order and Proceed to Payment
- Frontend handles the complete Razorpay payment flow
- Users will see Razorpay's secure payment modal
- Payment verification happens automatically

---

## Razorpay Test Credentials

For testing payments in test mode, Razorpay provides various test scenarios. Check your Razorpay dashboard for test card options.

---

## Troubleshooting

### MongoDB Connection Error
**Error**: `MongoNetworkError: failed to connect to server`

**Solution**:
- Ensure MongoDB is running
- Verify `MONGODB_URI` in `.env` is correct
- Check network connectivity if using MongoDB Atlas
- Verify IP whitelist settings in MongoDB Atlas

### Razorpay Configuration Error
**Error**: `Payment service is not configured`

**Solution**:
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in `.env`
- Ensure keys are from the correct Razorpay account
- Check for typos in environment variables

### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Verify `FRONTEND_URL` in backend `.env` is correct
- Check that frontend is making requests to correct API URL
- Ensure backend CORS configuration matches frontend domain

### JWT Token Error
**Error**: `Invalid token` or `Token expired`

**Solution**:
- Verify token is being sent in Authorization header
- Check that `JWT_SECRET` matches between sessions
- Token expires after 7 days (set in `JWT_EXPIRE`)

### Port Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find and kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

---

## Production Deployment

Before deploying to production:

1. **Security**:
   - Change `JWT_SECRET` to a strong, random value
   - Use production Razorpay keys (not test keys)
   - Set `NODE_ENV=production`
   - Enable HTTPS/SSL

2. **Database**:
   - Use MongoDB Atlas with network access restricted
   - Enable authentication
   - Configure regular backups

3. **Environment**:
   - Set all environment variables on hosting platform
   - Update `FRONTEND_URL` to production domain
   - Configure CORS for production domain

4. **Hosting Options**:
   - Heroku, Render, Railway, AWS, DigitalOcean
   - Ensure Node.js version compatibility (v18+)

---

## Project Structure

```
server/
├── models/
│   ├── User.model.js
│   ├── Product.model.js
│   ├── Cart.model.js
│   └── Order.model.js
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   └── payment.routes.js
├── middleware/
│   └── auth.middleware.js
├── utils/
│   └── generateToken.js
├── server.js
└── seed.js
```

---

## 📄 License

This project is licensed under the MIT License.

- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart` - Add item to cart (requires auth)
- `PUT /api/cart/:itemId` - Update cart item (requires auth)
- `DELETE /api/cart/:itemId` - Remove cart item (requires auth)
- `DELETE /api/cart` - Clear cart (requires auth)

### Orders
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)
- `POST /api/orders` - Create order (requires auth)

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent (requires auth)
- `POST /api/payments/webhook` - Stripe webhook handler

## Features

### ✅ Authentication
- User registration with email/password
- JWT-based authentication
- Protected routes
- User profile management

### ✅ Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart per user

### ✅ Payment Gateway
- Stripe integration
- Secure payment processing
- Payment intent creation
- Webhook support

### ✅ Order Management
- Create orders from cart
- Order history
- Order status tracking

## Testing the Application

### 1. Register a User
- Navigate to `/register`
- Fill in name, email, and password
- Submit the form

### 2. Login
- Navigate to `/login`
- Enter your credentials
- You'll be redirected to the home page

### 3. Add Products to Cart
- Browse products in `/shop`
- Click "Add to Cart"
- View cart at `/cart`

### 4. Checkout
- Go to `/cart`
- Click "Checkout" (requires login)
- Fill in shipping address
- Enter payment details (use Stripe test card: `4242 4242 4242 4242`)
- Complete the order

## Stripe Test Cards

For testing payments, use these Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB is accessible at the specified URI

### Stripe Payment Error
- Verify Stripe keys are correct in `.env`
- Ensure you're using test keys (not live keys)
- Check Stripe Dashboard for errors

### CORS Error
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that the frontend is making requests to the correct API URL

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong, random secret
2. Use production MongoDB URI (Atlas recommended)
3. Replace Stripe test keys with live keys
4. Update `NODE_ENV=production`
5. Set up proper webhook endpoints for Stripe
6. Configure environment variables on your hosting platform
7. Set up SSL/HTTPS for secure connections

## Project Structure

```
server/
├── models/          # MongoDB models (User, Product, Cart, Order)
├── routes/          # API routes
├── middleware/      # Auth middleware
├── utils/           # Helper functions
└── server.js        # Express server setup

src/
├── contexts/        # React contexts (AuthContext)
├── lib/             # API client and utilities
├── pages/           # Page components (Login, Register, Checkout)
└── components/      # Reusable components
```

## License

This project is licensed under the MIT License.