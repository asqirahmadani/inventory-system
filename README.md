# 📦 IS Project API Documentation

API backend ini adalah bagian dari aplikasi Inventory System (IS) yang dibangun menggunakan Node.js, Express.js, dan Prisma sebagai ORM. API ini menangani autentikasi user, manajemen produk, kategori, serta pemesanan (order). Dokumentasi ini mencakup input, output, dan error response dari setiap endpoint.

---

## 📚 Daftar Isi

- [🧱 Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [🧩 Middleware](#-middleware)
- [🚀 Authentication Endpoint](#-authentication-endpoint)
- [🧑 Users Endpoint](#-users-endpoint)
- [📊 Categorys Endpoint](#-categorys-endpoint)
- [📦 Products Endpoint](#-products-endpoint)
- [🧾 Orders Endpoint](#-orders-endpoint)
- [🛍️ Order Items Endpoint](#️-order-items-endpoint)

---

## 🧱 Teknologi yang Digunakan

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- Bcrypt
- Joi Validation
- Faker

---

## 🧩 Middleware

### 🔒 Auth Middleware
Digunakan untuk mengecek validitas JWT token dan hak akses pengguna berdasarkan peran (role: admin/user).

Contoh penggunaan di route:
```js
router.get('/users', auth('admin'), userController.getAllUsers);
```

### ✅ Validate Middleware

Digunakan untuk validasi input menggunakan Joi.

Contoh penggunaan di route:
```js
router.post('/products', validate(productValidation.createProduct), productController.createProduct);
```

### 🚨 Error Handling

Semua error akan ditangani dengan `ApiError` dan middleware error handler. Error dikembalikan dalam bentuk:

```json
{
  "status": 400,
  "message": "Invalid request data"
}
```

### 📄 Pagination

Endpoint GET All mendukung query pagination:

- `page` → nomor halaman
- `limit` → jumlah item per halaman

Contoh:
```js
GET /v1/products/pagination?page=2&limit=10
```
Response akan mengandung info page sebelumnya dan selanjutnya.

---

## 🚀 Authentication Endpoint

### ✅ Login

**POST** `/v1/auth/login`

#### Request Body
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
#### Success Response
```json
{
    "status": 200,
    "message": "Login success",
    "data": {user, tokens}
}
```
#### Error Response
- 404 : not found (incorrect email or password)

### ✅ Register

**POST** `/v1/auth/register`

#### Request Body
```json
{
    "name": "user",
    "email": "user@example.com",
    "password": "password123"
}
```
#### Success Response
```json
{
    "status": 201,
    "message": "Register success",
    "data": {user, tokens}
}
```
#### Error Response
- 400 : bad request (password minimal 8 karakter serta mengandung huruf dan angka)

---

## 🧑 Users Endpoint

**Struktur Database User (Prisma)**
User memiliki hubungan 1-to-many dengan tokens, products, dan orders
```json
model User {
  id              String    @id @default(uuid())
  name            String
  email           String?   @unique
  password        String
  role            String    @default("user")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  isEmailVerified Boolean   @default(false)
  tokens          Token[]
  Product         Product[]
  orders          Order[]
}
```

**Header**
Endpoint users hanya bisa diakses oleh admin
```json
Authorization: Bearer <access_token>
```
### Create Users
**POST** `/v1/users`

#### Request Body
```json
{
    "name": "user",
    "email": "user@example.com",
    "password": "password123",
    "role": "user/admin" (optional)
}
```
#### Success Response
```json
{
    "status": 201,
    "message": "Create user success",
    "data": {user}
}
```
#### Error Response
- 400 : bad request (email duplicate atau request body tidak sesuai)
- 401 : unauthorized (invalid token atau role tidak sesuai)

### Get All Users
**GET** `/v1/users/pagination?page=1&limit=2`

#### Success Response
```json
{
    "status": 200,
    "message": "Get users success",
    "data": {users}
}
```
#### Error Response
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (invalid pagination)

### Get Users by Id
**GET** `/v1/users/:userId`

#### Success Response
```json
{
    "status": 200,
    "message": "Get user success",
    "data": {user}
}
```
#### Error Response
- 400 : bad request (invalid userId)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (user tidak ditemukan)

### Update Users
**PATCH** `/v1/users/:userId`

#### Request Body (min 1)
```json
{
    "name": "user",
    "email": "user@example.com",
    "password": "password123",
    "role": "user/admin"
}
```
#### Success Response
```json
{
    "status": 200,
    "message": "Update user success",
    "data": {user}
}
```
#### Error Response
- 400 : bad request (invalid userId, email duplicate, dan request body kosong)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (user tidak ditemukan)

### Delete Users
**DELETE** `/v1/users/:userId`

#### Success Response
```json
{
    "status": 200,
    "message": "Delete users success",
    "data": null
}
```
#### Error Response
- 400 : bad request (invalid userId)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (user tidak ditemukan)

### Get Product by Users
**GET** `/v1/users/:userId/products`

#### Success Response
```json
{
    "status": 200,
    "message": "Get users success",
    "data": {users : {products}}
}
```
#### Error Response
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (invalid pagination)

### Get Orders by Users
**GET** `/v1/users/:userId/orders`

#### Success Response
```json
{
    "status": 200,
    "message": "Get users success",
    "data": {users : {orders}}
}
```
#### Error Response
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (invalid pagination)

---

## 📊 Categorys Endpoint

**Struktur Database Category (Prisma)**
Category memiliki hubungan 1-to-many dengan products
```json
model Category {
  id        String    @id @default(uuid())
  name      String
  Products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

**Header**
Endpoint category bisa diakses oleh admin dan user
```json
Authorization: Bearer <access_token>
```

### Create Category
**POST** `/v1/categorys`

#### Request Body
```json
{
    "name": "categoryName"
}
```
#### Success Response
```json
{
    "status": 201,
    "message": "Create category success",
    "data": {category}
}
```
#### Error Response
- 400 : bad request (request body kosong)
- 401 : unauthorized (invalid token)

### Get All Category
**GET** `/v1/categorys/pagination?page=1&limit=2`

#### Success Response
```json
{
    "status": 200,
    "message": "Get categorys success",
    "data": {categorys}
}
```
#### Error Response
- 401 : unauthorized (invalid token)
- 404 : not found (pagination invalid)

### Get Category by Id
**GET** `/v1/categorys/:categoryId`

#### Success Response
```json
{
    "status": 200,
    "message": "Get category success",
    "data": {category}
}
```
#### Error Response
- 400 : bad request (invalid categoryId)
- 401 : unauthorized (invalid token)
- 404 : not found (category tidak ditemukan)

### Update Category
**PATCH** `/v1/categorys/:categoryId`

#### Request Body
```json
{
    "name": "categoryName"
}
```
#### Success Response
```json
{
    "status": 200,
    "message": "Update category success",
    "data": {category}
}
```
#### Error Response
- 400 : bad request (invalid categoryId atau body request kosong)
- 401 : unauthorized (invalid token)
- 404 : not found (category tidak ditemukan)

### Delete Category
**DELETE** `/v1/categorys/:categoryId`

#### Success Response
```json
{
    "status": 200,
    "message": "Delete category success",
    "data": null
}
```
#### Error Response
- 400 : bad request (invalid categoryId)
- 401 : unauthorized (invalid token)
- 404 : not found (category tidak ditemukan)

---

## 📦 Products Endpoint

**Struktur Database Product (Prisma)**
Product memiliki hubungan 1-to-many dengan user
```json
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

**Header**
Endpoint product bisa diakses oleh admin dan user
```json
Authorization: Bearer <access_token>
```

### Create Product
**POST** `/v1/products`

#### Request Body
```json
{
    "name": "productName",
    "description": "description",
    "price": 10,
    "quantityInStock": 50,
    "categoryId": "uuid",
    "userId": "uuid"
}
```
#### Success Response
```json
{
    "status": 201,
    "message": "Create product success",
    "data": {product}
}
```
#### Error Response
- 400 : bad request (request body kosong)
- 401 : unauthorized (invalid token)
- 404 : not found (user atau category tidak ditemukan)

### Get All Product
**GET** `/v1/products/pagination?page=1&limit=2`

#### Success Response
```json
{
    "status": 200,
    "message": "Get products success",
    "data": {products}
}
```
#### Error Response
- 401 : unauthorized (invalid token)
- 404 : not found (pagination invalid)

### Search Product by Category
**GET** `/v1/products/search?category=...`

#### Success Response
```json
{
    "status": 200,
    "message": "Get products by category success",
    "data": {products}
}
```
#### Error Response
- 401 : unauthorized (invalid token)
- 404 : not found (pagination invalid)

### Get Product by Id
**GET** `/v1/products/productId`

#### Success Response
```json
{
    "status": 200,
    "message": "Get product success",
    "data": {product}
}
```
#### Error Response
- 400 : bad request (invalid productId)
- 401 : unauthorized (invalid token)
- 404 : not found (product tidak ditemukan)

### Update Product
**PATCH** `/v1/products/productId`

#### Request Body (min 1)
```json
{
    "name": "productName",
    "description": "description",
    "price": 10,
    "quantityInStock": 50,
    "categoryId": "uuid",
    "userId": "uuid"
}
```
#### Success Response
```json
{
    "status": 200,
    "message": "Update product success",
    "data": {product}
}
```
#### Error Response
- 400 : bad request (request body kosong)
- 401 : unauthorized (invalid token)
- 404 : not found (product, user atau category tidak ditemukan)

### Delete Product
**DELETE** `/v1/products/productId`

#### Success Response
```json
{
    "status": 200,
    "message": "Delete product success",
    "data": null
}
```
#### Error Response
- 400 : bad request (invalid productId)
- 401 : unauthorized (invalid token)
- 404 : not found (product tidak ditemukan)

---

## 🧾 Orders Endpoint

**Struktur Database Order (Prisma)**
Order memiliki hubungan 1-to-many dengan Order Items
```json
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

**Header**
Endpoint orders hanya bisa diakses oleh admin
```json
Authorization: Bearer <access_token>
```

### Create Orders
**POST** `/v1/orders`

#### Request Body
```json
{
    "userId": "uuid"
}
```
#### Success Response
```json
{
    "status": 201,
    "message": "Create order success",
    "data": {order}
}
```
#### Error Response
- 400 : bad request (request body kosong)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (user tidak ditemukan)

### Get All Orders
**GET** `/v1/orders/pagination?page=1&limit=2`

#### Success Response
```json
{
    "status": 200,
    "message": "Get orders success",
    "data": {orders}
}
```
#### Error Response
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (pagination invalid)

### Get Orders by Id
**GET** `/v1/orders/:orderId`

#### Success Response
```json
{
    "status": 200,
    "message": "Get order success",
    "data": {order}
}
```
#### Error Response
- 400 : bad request (invalid orderId)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order tidak ditemukan)

### Update Orders
**PATCH** `/v1/orders/:orderId`

#### Request Body (min 1)
```json
{
    "userId": "uuid",
    "totalPrice": 100
}
```
#### Success Response
```json
{
    "status": 200,
    "message": "Update order success",
    "data": {order}
}
```
#### Error Response
- 400 : bad request (request body kosong)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order atau user tidak ditemukan)

### Delete Orders
**DELETE** `/v1/orders/:orderId`

#### Success Response
```json
{
    "status": 200,
    "message": "Delete order success",
    "data": null
}
```
#### Error Response
- 400 : bad request (invalid orderId)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order tidak ditemukan)

### Get Order Items by Order
**GET** `/v1/orders/:orderId/order-items`

#### Success Response
```json
{
    "status": 200,
    "message": "Get orders success",
    "data": {orders}
}
```
#### Error Response
- 400 : bad request (invalid orderId)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order tidak ditemukan)

---

## 🛍️ Order Items Endpoint

**Struktur Database Order Items (Prisma)**
Order Items memiliki hubungan many-to-one dengan Orders dan Products
```json
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

**Header**
Endpoint order-items hanya bisa diakses oleh admin
```json
Authorization: Bearer <access_token>
```

### Create Order-Item
**POST** `/v1/order-items`

#### Request Body
```json
{
    "orderId": "uuid",
    "productId": "uuid",
    "quantity": 5
}
```
#### Success Response
```json
{
    "status": 201,
    "message": "Create order-item success",
    "data": {orderItem}
}
```
#### Error Response
- 400 : bad request (request body kosong atau quantity (jumlah) melebihi stock di product)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order atau product tidak ditemukan)

### Get All Order-Item
**GET** `/v1/order-items/pagination?page=1&limit=2`

#### Success Response
```json
{
    "status": 200,
    "message": "Get order-items success",
    "data": {orderItems}
}
```
#### Error Response
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (pagination invalid)

### Get Order-Item by Id
**GET** `/v1/order-items/:orderItemId`

#### Success Response
```json
{
    "status": 200,
    "message": "Get order-item success",
    "data": {orderItem}
}
```
#### Error Response
- 400 : bad request (invalid orderItemId)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order tidak ditemukan)

### Update Order-Item
**PATCH** `/v1/order-items/:orderItemId`

#### Request Body (min 1)
```json
{
    "orderId": "uuid",
    "productId": "uuid",
    "quantity": 5
}
```
#### Success Response
```json
{
    "status": 200,
    "message": "Update order-item success",
    "data": {orderItem}
}
```
#### Error Response
- 400 : bad request (request body kosong atau quantity (jumlah) melebihi stock di product)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order item, order atau product tidak ditemukan)

### Delete Order-Item
**DELETE** `/v1/order-items/:orderItemId`

#### Success Response
```json
{
    "status": 200,
    "message": "Delete order-item success",
    "data": null
}
```
#### Error Response
- 400 : bad request (invalid orderItemId)
- 401 : unauthorized (invalid token atau role tidak sesuai)
- 404 : not found (order item tidak ditemukan)
