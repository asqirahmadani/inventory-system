# 📦 Inventory System API

REST API backend untuk aplikasi Inventory System yang dibangun dengan Node.js, Express.js, dan Prisma ORM. API ini menangani autentikasi user, manajemen produk, kategori, serta sistem pemesanan (order).

## 📋 Table of Contents

- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Fitur Utama](#-fitur-utama)
- [Prerequisites](#-prerequisites)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Middleware](#-middleware)
- [Error Handling](#-error-handling)
- [Pagination](#-pagination)

## 🛠 Teknologi yang Digunakan

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Faker** - Generate dummy data

## ✨ Fitur Utama

- 🔐 Authentication & Authorization (JWT-based)
- 👥 User Management (Admin & User roles)
- 📊 Category Management
- 📦 Product Management
- 🛒 Order Management
- 📄 Pagination Support
- ✅ Input Validation
- 🔒 Role-based Access Control

## 📦 Prerequisites

Pastikan Anda sudah menginstall:

- **Node.js** (v14 atau lebih tinggi)
- **MySQL** (v5.7 atau lebih tinggi)
- **npm** atau **yarn**

## 🚀 Instalasi

1. Clone repository:
```bash
git clone https://github.com/asqirahmadani/inventory-system.git
cd inventory-system
```

2. Install dependencies:
```bash
npm install
```

3. Setup database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database dengan dummy data
npx prisma db seed
```

## ⚙️ Konfigurasi

Buat file `.env` di root project dan isi dengan konfigurasi berikut:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/inventory_db"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30

# Application
PORT=3000
NODE_ENV=development
```

## 🎯 Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

API akan berjalan di `http://localhost:3000` (atau sesuai PORT di `.env`)

## 📊 Database Schema

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

## 🛡️ Middleware

### Authentication Middleware
Mengecek validitas JWT token dan hak akses berdasarkan role.

```javascript
router.get('/users', auth('admin'), userController.getAllUsers);
```

### Validation Middleware
Validasi input menggunakan Joi schema.

```javascript
router.post('/products', validate(productValidation.createProduct), productController.createProduct);
```

## ⚠️ Error Handling

Semua error akan ditangani dengan `ApiError` class dan error handler middleware. Format error response:

```json
{
  "status": 400,
  "message": "Invalid request data"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input, duplicate data)
- `401` - Unauthorized (invalid token, insufficient permission)
- `404` - Not Found (resource tidak ditemukan)
- `500` - Internal Server Error

## 📄 Pagination

Semua endpoint GET dengan suffix `/pagination` mendukung query parameters:

- `page` - Nomor halaman (default: 1)
- `limit` - Jumlah item per halaman (default: 10)

**Example:**
```
GET /v1/products/pagination?page=2&limit=10
```

**Response:**
```json
{
  "status": 200,
  "message": "Get products success",
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 2,
      "totalPages": 5,
      "totalItems": 50,
      "hasNextPage": true,
      "hasPrevPage": true
    }
  }
}
```

## 📝 Example Requests

### Register
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Product
```bash
curl -X POST http://localhost:3000/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "Gaming Laptop",
    "price": 15000000,
    "quantityInStock": 10,
    "categoryId": "uuid-category",
    "userId": "uuid-user"
  }'
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Asqi Rahmadani**
- GitHub: [@asqirahmadani](https://github.com/asqirahmadani)

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue baru di [GitHub Issues](https://github.com/asqirahmadani/inventory-system/issues).
