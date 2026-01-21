# Roséve Luxury Beauty - AI Coding Agent Instructions

## Architecture Overview

This is a **MERN e-commerce platform** split into two discrete applications:

- **Frontend** (`/src`): React + TypeScript + Vite with shadcn/ui component library
- **Backend** (`/server`): Express.js + MongoDB with JWT authentication and payment integration

### Data Flow
1. **Authentication**: User logs in → JWT token stored in localStorage → token included in all API requests via `Authorization: Bearer` header
2. **Products & Cart**: Frontend fetches products from `/api/products`, manages cart in CartContext (synced with backend)
3. **Checkout**: User submits order → backend creates Razorpay/Stripe order → frontend redirects to payment gateway → payment callback updates order status

## Development Workflow

### Frontend Development
```bash
npm install              # Install dependencies
npm run dev              # Start Vite dev server (port 8080)
npm run build            # Production build
npm run lint             # ESLint check (no --fix rule, @typescript-eslint/no-unused-vars disabled)
npm run test             # Run Vitest
npm run test:watch       # Watch mode
```

### Backend Development
```bash
cd server
npm install              # Install dependencies
npm run dev              # Watch mode (node --watch server.js)
npm run start            # Production mode
npm run seed             # Populate database with sample products
```

### Environment Setup
Both require `.env` files (NOT in git):
- **Root** `.env`: `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`
- **`server/.env`**: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `FRONTEND_URL`, `NODE_ENV`

## Key Patterns & Conventions

### Frontend Context-Based State (AuthContext, CartContext)
- **Single source of truth**: Never duplicate user/cart data; always pull from context
- **Auth flow**: `AuthContext` manages login/register/logout; stores token in localStorage; auto-loads user on mount
- **Cart requires authentication**: `CartContext.refreshCart()` will set cart to null if user not authenticated
- **Error handling in contexts**: Methods throw errors for components to catch; don't use toast in context logic

### API Client Pattern (`src/lib/api.ts`)
- Central `ApiClient` class with `request<T>()` method for type-safe HTTP calls
- All API methods add Bearer token automatically from localStorage
- Error responses must be parsed; fetch failures set cart/user to null (assumed session expired)
- **No axios**: Uses native `fetch` API

### Backend Route Structure
Routes are organized by resource (`/api/auth`, `/api/products`, `/api/cart`, `/api/orders`, `/api/payments`):
- **Auth routes**: POST register/login, GET /me (protected with `protect` middleware)
- **Cart routes**: GET /api/cart, POST add/remove/update (all protected)
- **Orders**: Tied to user via `req.user._id` from auth middleware
- **Product routes**: GET only (no auth needed for product list)

### MongoDB Models
All models use timestamps. Key patterns:
- **User**: Password hashed with bcryptjs; `comparePassword()` method; role field (default 'user', can be 'admin')
- **Product**: Categories are enums (Serums, Moisturizers, Cleansers, Treatments, Eye Care, Masks)
- **Cart/Order**: Tied to user via ObjectId reference

### Authentication Middleware (`server/middleware/auth.middleware.js`)
- `protect`: Verifies JWT, attaches user to `req.user`
- `admin`: Checks role === 'admin'
- Always applies in chain: `router.use(protect)` or per-route: `router.get('/endpoint', protect, handler)`

### Component Library (shadcn/ui)
- UI components in `src/components/ui/` generated from Radix UI
- Uses `@hookform/resolvers` for form validation
- Toast notifications via `useToast()` hook
- Modal/dialog patterns use Radix Dialog

## Common Tasks

### Adding a New API Endpoint
1. Create route in `server/routes/[resource].routes.js`
2. Add handler function with validation
3. Import in `server/server.js` as `app.use('/api/[resource]', routeHandler)`
4. Add TypeScript interface in `src/lib/api.ts`
5. Add method to `ApiClient` class with proper typing

### Adding Authentication to a Route
```javascript
// In route file:
import { protect } from '../middleware/auth.middleware.js';
router.post('/endpoint', protect, async (req, res) => {
  const userId = req.user._id;  // User is already attached
});
```

### Adding a New Page
1. Create `.tsx` file in `src/pages/`
2. Add Route in `App.tsx` (protected routes wrap in `<ProtectedRoute>`)
3. If needs auth context: `const { user, login } = useAuth();`
4. If needs cart: `const { cart, addToCart } = useCart();`

### Managing Payment Flow
- **Razorpay** (primary): Create order via POST `/api/payments/create-order` with amount & address
- **Stripe** alternative: Not currently integrated (payment.routes.js shows both, but Razorpay is default)
- Order status: `pending` → `processing` → `delivered`

## Important Implementation Notes

### TypeScript Paths
- `@` alias resolves to `src/` (configured in vite.config.ts and tsconfig.json)
- Always use `@/components`, `@/contexts`, `@/lib` imports

### Cart Initialization
- Cart is lazy-loaded only for authenticated users
- If user logs out, cart automatically clears
- No local storage persistence for cart items (server-of-truth is MongoDB)

### Error Handling
- API client catch block silently logs errors; let components handle toast notifications
- 401 errors usually mean token expired; auto-clear in AuthContext
- Form validation uses `express-validator` on backend with first error returned

### Database Seeding
- `server/seed.js` populates products with categories and badges
- Run once after DB setup; safe to run multiple times (checks for existing data)
- Seed data includes sample products for each beauty category

## Testing
- **Frontend**: Vitest + React Testing Library (configured in vitest.config.ts)
- **Backend**: No automated tests configured; manual testing recommended
- Test examples in `src/test/example.test.ts`
