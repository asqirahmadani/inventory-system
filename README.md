# 📦 Inventory System API

A clean and scalable RESTful API for managing products, categories, users, and orders.
Built using Node.js, Express.js, Prisma ORM, and MySQL, this API is designed as a portfolio project demonstrating backend engineering, database design, authentication, and modular architecture.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Error Handling](#-error-handling)
- [Pagination](#-pagination)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Faker** - Dummy data seeding

## ✨ Features

- 🔐 Authentication & Authorization (JWT-based)
- 👥 User Management (Admin & User roles)
- 📦 Product Management
- 🏷️ Category Management
- 🛒 Order Management
- 📄 Pagination on List Endpoints
- 🧩 Centralized Validation & Error Handling
- 🔒 Role-based Access Control

## 📁 Project Structure

```bash
src/
│── config/
│── controllers/
│── middlewares/
│── routes/
│── services/
│── validations/
│── prisma/
│── utils/
index.js
```

## 📦 Prerequisites

Ensure you have installed::

- Node.js v14+
- MySQL 5.7+
- npm or yarn

## 🚀 Installation

```bash
git clone https://github.com/asqirahmadani/inventory-system.git
cd inventory-system
npm install
```

## ⚙️ Environment Setup

Create a `.env` file:

```env
DATABASE_URL="mysql://username:password@localhost:3306/inventory_db"
JWT_SECRET="your-secret-key"
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
PORT=3000
NODE_ENV=development
```

## 🗄️ Database Setup

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed   # optional
```

## 🎯 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

API available on `http://localhost:3000`

## 🧬 Database Schema

### User
```prisma
model User {
  id               String    @id @default(uuid())
  name             String
  email            String?   @unique
  password         String
  role             String    @default("user")
  isEmailVerified  Boolean   @default(false)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  tokens           Token[]
  Product          Product[]
  orders           Order[]
}
```

### Category
```prisma
model Category {
  id        String    @id @default(uuid())
  name      String
  Products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Product
```prisma
model Product {
  id              String      @id @default(uuid())
  name            String
  description     String
  price           Float
  quantityInStock Int
  categoryId      String
  userId          String
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  category        Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  OrderItems      OrderItem[]
}
```

### Order
```prisma
model Order {
  id            String      @id @default(uuid())
  date          DateTime    @default(now())
  totalPrice    Float       @default(0)
  customerName  String
  customerEmail String
  userId        String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  OrderItems    OrderItem[]
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### OrderItem
```prisma
model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  unitPrice Float
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

## 🔌 API Endpoints

Base URL: `http://localhost:3000/v1`

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register user baru | Public |
| POST | `/auth/login` | Login user | Public |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/users` | Create user baru | Admin |
| GET | `/users/pagination` | Get all users (paginated) | Admin |
| GET | `/users/:userId` | Get user by ID | Admin |
| PATCH | `/users/:userId` | Update user | Admin |
| DELETE | `/users/:userId` | Delete user | Admin |
| GET | `/users/:userId/products` | Get user's products | Admin |
| GET | `/users/:userId/orders` | Get user's orders | Admin |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/categorys` | Create category | Admin/User |
| GET | `/categorys/pagination` | Get all categories (paginated) | Admin/User |
| GET | `/categorys/:categoryId` | Get category by ID | Admin/User |
| PATCH | `/categorys/:categoryId` | Update category | Admin/User |
| DELETE | `/categorys/:categoryId` | Delete category | Admin/User |

### Products
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/products` | Create product | Admin/User |
| GET | `/products/pagination` | Get all products (paginated) | Admin/User |
| GET | `/products/search?category=...` | Search products by category | Admin/User |
| GET | `/products/:productId` | Get product by ID | Admin/User |
| PATCH | `/products/:productId` | Update product | Admin/User |
| DELETE | `/products/:productId` | Delete product | Admin/User |

### Orders
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/orders` | Create order | Admin |
| GET | `/orders/pagination` | Get all orders (paginated) | Admin |
| GET | `/orders/:orderId` | Get order by ID | Admin |
| PATCH | `/orders/:orderId` | Update order | Admin |
| DELETE | `/orders/:orderId` | Delete order | Admin |
| GET | `/orders/:orderId/order-items` | Get order items | Admin |

### Order Items
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/order-items` | Create order item | Admin |
| GET | `/order-items/pagination` | Get all order items (paginated) | Admin |
| GET | `/order-items/:orderItemId` | Get order item by ID | Admin |
| PATCH | `/order-items/:orderItemId` | Update order item | Admin |
| DELETE | `/order-items/:orderItemId` | Delete order item | Admin |

## ⚠️ Error Handling

Consistent error responses via `ApiError`:

```json
{
  "status": 400,
  "message": "Invalid request data"
}
```

## 📄 Pagination

**Example:**
```
GET /v1/products/pagination?page=2&limit=10
```

## 🤝 Contributing

Pull requests are welcome.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Asqi Rahmadani**
- GitHub: [@asqirahmadani](https://github.com/asqirahmadani)
