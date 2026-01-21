

---

# Roséve Luxury Beauty

Roséve Luxury Beauty is a comprehensive full-stack e-commerce platform designed for the luxury retail sector. Built using the MERN stack, the application provides a seamless end-to-end shopping experience, featuring secure user authentication, dynamic product management, and a dedicated payment processing integration.

### Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=61DAFB)
![React](https://img.shields.io/badge/React-%2320232b.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-%23022651.svg?style=for-the-badge&logo=razorpay&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

---

## Core Functionality

*   **Authentication System**: Implementation of user registration and login utilizing JSON Web Tokens (JWT) for secure session persistence.
*   **Cart Management**: Persistent shopping cart functionality allowing users to modify product quantities and manage selections.
*   **Payment Integration**: Integration with the Razorpay API to facilitate secure financial transactions and signature verification.
*   **Order Tracking**: Automated order creation upon successful payment and a historical record of all user transactions.
*   **Product Catalog**: Categorized browsing experience with dynamic filtering.
*   **Responsive Interface**: Optimized layout for desktop, tablet, and mobile devices using utility-first CSS.

---

## Prerequisites

*   **Node.js**: Version 18.0.0 or higher.
*   **Package Manager**: npm or bun.
*   **Database**: MongoDB instance (Local or Atlas).
*   **Payment Provider**: Active Razorpay account for API credentials.

---

## Installation and Configuration

### Backend Configuration

1.  **Access the server directory**:
    ```bash
    cd server
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**: Create a `.env` file in the `server/` directory with the following variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_random_string
    JWT_EXPIRE=7d
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    NODE_ENV=development
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Database Seeding (Optional)**:
    ```bash
    npm run seed
    ```

5.  **Initialize Server**:
    ```bash
    npm run dev
    ```

### Frontend Configuration

1.  **Install dependencies (Root directory)**:
    ```bash
    npm install
    ```

2.  **Environment Setup**: Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```

3.  **Initialize Client**:
    ```bash
    npm run dev
    ```

---

## Directory Structure

```text
├── server/                 # Backend Application
│   ├── models/            # Data Schemas
│   ├── routes/            # API Endpoints
│   ├── middleware/        # Request Interceptors (Auth)
│   ├── utils/             # Helper Modules
│   ├── server.js          # Application Entry Point
│   └── seed.js            # Database Initialization
├── src/                   # Frontend Application
│   ├── components/        # UI Components
│   ├── contexts/          # State Management (Auth, Cart)
│   ├── lib/               # API Service Layer
│   ├── pages/             # View Controllers
│   └── App.tsx            # Root Component
├── public/                # Assets
└── README.md
```

---

## API Reference

### Authentication
| Method | Endpoint | Access |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Products
| Method | Endpoint | Access |
| :--- | :--- | :--- |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |

### Cart Management
| Method | Endpoint | Access |
| :--- | :--- | :--- |
| GET | `/api/cart` | Private |
| POST | `/api/cart` | Private |
| PUT | `/api/cart/:itemId` | Private |
| DELETE | `/api/cart/:itemId` | Private |

### Payment and Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/payments/create-order` | Generates Razorpay Order ID |
| POST | `/api/payments/verify-payment`| Validates Transaction Signature |
| GET | `/api/orders` | Retrieves user order history |

---

## Deployment Strategy

To ensure a secure production environment:

1.  **Environment**: Set `NODE_ENV` to `production`.
2.  **Database**: Migrate from local instances to a managed service like MongoDB Atlas.
3.  **Security**: Replace Razorpay test keys with live credentials and implement HTTPS.
4.  **CORS**: Update the `FRONTEND_URL` in the backend configuration to match the production domain.
5.  **Hosting**: 
    *   **Frontend**: Recommended providers include Vercel or Netlify.
    *   **Backend**: Recommended providers include Render, Railway, or AWS.

---

## License

This project is released under the MIT License.