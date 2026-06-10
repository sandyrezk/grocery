# 🛒 Grocery Plus — Backend API

> A full-featured RESTful API for a modern grocery delivery mobile app, built with Node.js, Express, and MongoDB.

---

## ✨ Overview

**Grocery Plus** is a grocery delivery platform that allows users to browse products, manage their cart, place orders, and track delivery in real time. This repository contains the complete backend API powering the mobile application.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Refresh Token (httpOnly Cookie) |
| Validation | express-validator |
| Security | Helmet, CORS, bcryptjs |
| File Upload | Multer |
| Environment | dotenv |

---

## 📁 Project Structure

```
grocery-plus-backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── list.controller.js
│   │   ├── offer.controller.js
│   │   ├── notification.controller.js
│   │   ├── chat.controller.js
│   │   ├── support.controller.js
│   │   └── scanner.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT protect middleware
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── cart.model.js
│   │   ├── order.model.js
│   │   ├── list.model.js
│   │   ├── offer.model.js
│   │   ├── notification.model.js
│   │   └── chat.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── list.routes.js
│   │   ├── offer.routes.js
│   │   ├── notification.routes.js
│   │   ├── chat.routes.js
│   │   ├── support.routes.js
│   │   └── scanner.routes.js
│   ├── utils/
│   │   ├── response.js             # Unified API response helpers
│   │   └── token.js                # JWT token utilities
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── user.validator.js
│   └── app.js                      # Express entry point
├── .env
├── .gitignore
└── package.json
```

---

## 🔐 Authentication

This API uses a **dual-token strategy**:

- **Access Token** — short-lived (15 minutes), sent in the response body, used in the `Authorization: Bearer <token>` header.
- **Refresh Token** — long-lived (7 days), stored in an **httpOnly cookie** to prevent XSS attacks, used to silently issue new access tokens.

---

## 📡 API Endpoints

### 🔑 Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create a new account | ❌ |
| POST | `/api/auth/login` | Login with email & password | ❌ |
| POST | `/api/auth/refresh-token` | Get a new access token | ❌ |
| POST | `/api/auth/logout` | Logout and clear tokens | ✅ |
| POST | `/api/auth/forgot-password` | Send OTP to email or phone | ❌ |
| POST | `/api/auth/verify-otp` | Verify the 4-digit OTP | ❌ |
| POST | `/api/auth/resend-otp` | Resend OTP | ❌ |
| POST | `/api/auth/reset-password` | Set a new password | ❌ |

### 👤 User
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user/profile` | Get user profile | ✅ |
| PUT | `/api/user/profile` | Update profile | ✅ |
| GET | `/api/user/addresses` | Get saved addresses | ✅ |
| POST | `/api/user/addresses` | Add new address | ✅ |
| PUT | `/api/user/addresses/:id` | Update address | ✅ |
| DELETE | `/api/user/addresses/:id` | Delete address | ✅ |
| GET | `/api/user/payment-methods` | Get saved cards | ✅ |
| POST | `/api/user/payment-methods` | Add new card | ✅ |
| DELETE | `/api/user/payment-methods/:id` | Delete card | ✅ |
| PATCH | `/api/user/payment-methods/:id/default` | Set default card | ✅ |
| GET | `/api/user/settings` | Get app settings | ✅ |
| PATCH | `/api/user/settings/language` | Change language | ✅ |
| PATCH | `/api/user/settings/appearance` | Toggle dark mode | ✅ |
| GET | `/api/user/notification-settings` | Get notification toggles | ✅ |
| PATCH | `/api/user/notification-settings` | Update notification toggles | ✅ |
| GET | `/api/user/data/export` | Download account data | ✅ |
| DELETE | `/api/user/account` | Permanently delete account | ✅ |

### 🛍️ Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products (paginated) | ❌ |
| GET | `/api/products/search?q=` | Search products | ❌ |
| GET | `/api/products/filter` | Filter by category, price, rating | ❌ |
| GET | `/api/products/recommended` | Get recommended products | ❌ |
| GET | `/api/products/:id` | Get product details | ❌ |
| GET | `/api/products/:id/similar` | Get similar products | ❌ |

### 🗂️ Categories & Offers
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get all categories | ❌ |
| GET | `/api/offers` | Get active offers | ❌ |

### 🛒 Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get cart | ✅ |
| POST | `/api/cart/items` | Add item to cart | ✅ |
| PATCH | `/api/cart/items/:id` | Update item quantity | ✅ |
| DELETE | `/api/cart/items/:id` | Remove item from cart | ✅ |
| DELETE | `/api/cart` | Clear cart | ✅ |

### 📦 Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | Get all orders | ✅ |
| POST | `/api/orders` | Place a new order | ✅ |
| GET | `/api/orders/:id` | Get order details | ✅ |
| GET | `/api/orders/:id/tracking` | Get real-time tracking | ✅ |
| POST | `/api/orders/:id/alert` | Set delivery alert | ✅ |

### 📋 My Lists
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/lists` | Get smart lists | ✅ |
| GET | `/api/lists/favorites` | Get favorites | ✅ |
| GET | `/api/lists/history` | Get purchase history | ✅ |
| POST | `/api/lists` | Create new list | ✅ |
| PUT | `/api/lists/:id` | Update list | ✅ |
| DELETE | `/api/lists/:id` | Delete list | ✅ |
| POST | `/api/lists/:id/items` | Add product to list | ✅ |
| DELETE | `/api/lists/:id/items/:productId` | Remove product from list | ✅ |
| POST | `/api/lists/:id/add-to-cart` | Add entire list to cart | ✅ |

### 🔔 Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get all notifications | ✅ |
| PATCH | `/api/notifications/:id/read` | Mark as read | ✅ |
| PATCH | `/api/notifications/read-all` | Mark all as read | ✅ |
| POST | `/api/notifications/device-token` | Save FCM device token | ✅ |

### 🤖 Grocery Bot
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/chat/history` | Get chat history | ✅ |
| POST | `/api/chat/message` | Send message to bot | ✅ |

### 🆘 Support
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/support/faq` | Get FAQ | ❌ |
| POST | `/api/support/contact` | Contact support | ✅ |
| GET | `/api/support/info` | Terms, Privacy, App version | ❌ |

### 📷 Scanner
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/scanner/receipt` | Scan receipt image (OCR) | ✅ |
| POST | `/api/scanner/barcode` | Scan product barcode | ✅ |

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/grocery-plus-backend.git
cd grocery-plus-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/grocery_plus
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 4. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🌐 Health Check

```
GET /api/health
```
```json
{
  "status": "OK",
  "message": "Grocery Plus API is running 🛒"
}
```

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- Refresh tokens stored in **httpOnly cookies**
- Request headers secured with **Helmet**
- Input validated and sanitized on every endpoint
- Sensitive fields (`password`, `refreshToken`) excluded from all responses by default

---

## 📌 Notes

- Payment card numbers are **never stored** — only the last 4 digits and expiry date.
- The receipt scanner requires integration with **Google Vision API** or **AWS Textract**.
- The Grocery Bot requires integration with an **AI API** (OpenAI / Gemini / Anthropic).
- Push notifications require **Firebase Admin SDK**.

---

## 👩‍💻 Author

Built with ❤️ as part of the Grocery Plus mobile app project.
