# 🤖 SmartStore AI

<div align="center">

**An AI-powered E-commerce Admin Dashboard built with the MERN Stack**

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

## 📸 Screenshots

> _Add your screenshots here. Place images in the `screenshots/` folder and update the paths below._

| Dashboard | Products | Add Product |
|:---------:|:--------:|:-----------:|
| ![Dashboard](./screenshots/dashboard.png) | ![Products](./screenshots/products.png) | ![Add Product](./screenshots/add-product.png) |

| AI Insights | Notifications | Analytics |
|:-----------:|:-------------:|:---------:|
| ![AI](./screenshots/ai-insights.png) | ![Notifs](./screenshots/notifications.png) | ![Analytics](./screenshots/analytics.png) |

---

## ✨ Features

### 🏠 Dashboard
- **Animated welcome banner** with live date and quick-action buttons
- **4 key stats cards** — Revenue, Products, Orders, Customers with trend indicators
- **Revenue chart** — 6-month historical chart using Recharts
- **Quick navigation** shortcuts to Products and Analytics

### 🔍 Smart Search
- **Live product search** in the Navbar — debounced, real-time API calls
- Results show product name, category, price, and stock status
- Search within the Products page also filters by **category** and name

### 🔔 Live Notifications
- **Real data-driven alerts** from your MongoDB store:
  - 🔴 Out-of-stock product alerts
  - 🟡 Low stock warnings (1–10 units)
  - 🟢 Recent orders in the last 24 hours
- **Unread badge count** with animated pop-in
- **Mark all as read** in one click
- Notifications auto-refresh every 60 seconds

### 🤖 AI Content Generator
- Powered by **Google Gemini API** (with smart fallback templates)
- Generates on-demand:
  - 📝 Product description
  - 🔖 SEO meta tags (shown as chip previews)
  - 📣 Social media marketing captions
- **Animated multi-step progress bar** during generation
- **"AI Generated" badges** highlight AI-written fields
- Works in both **Add Product** and **Edit Product** modals

### 📦 Product Management
- Full **CRUD** — Create, Read, Update, Delete
- Product status badges: In Stock / Low Stock / Out of Stock
- **View AI copy modal** — read-only view of description, SEO tags, captions
- Toast notifications on all actions (create, update, delete)

### 📊 Analytics
- Revenue trends and product performance charts

### ⚙️ Settings & Auth
- JWT-based authentication (Login / Signup)
- User profile with avatar, store name, email
- Settings page

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| State / Routing | React Context, React Router v6 |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| AI | Google Gemini API (`gemini-1.5-flash`) |
| Dev Server | Nodemon, Vite Dev Server |

---

## 📁 Project Structure

```bash
smartstore-ai/
│
├── client/                   # React + Vite Frontend
│   └── src/
│       ├── components/
│       │   └── dashboard/    # Navbar, Sidebar, StatsCard, AISuggestions, etc.
│       ├── context/          # AuthContext
│       ├── layouts/          # DashboardLayout
│       ├── pages/            # Dashboard, Products, AddProduct, Analytics, Login, Signup, Settings
│       ├── routes/           # Route definitions
│       └── services/         # api.js (fetch wrapper)
│
├── server/                   # Node.js + Express Backend
│   ├── config/               # MongoDB connection
│   ├── controllers/          # analyticsController, authController, productController, notificationController
│   ├── models/               # Product, Order, User (Mongoose schemas)
│   ├── routes/               # authRoutes, productRoutes, analyticsRoutes, notificationRoutes
│   ├── services/             # aiService.js (Gemini API + fallback)
│   ├── utils/                # authMiddleware
│   └── server.js             # App entry point
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd smartstore-ai
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

```env
PORT=8873
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

> 💡 **`GEMINI_API_KEY`** is optional. If not set, the AI generator uses built-in fallback templates that still produce high-quality content.

### Client (`client/.env`)

```env
VITE_API_URL=/api
```

---

## ▶️ Running the App

### Start the Backend

```bash
cd server
npm run dev
# Server starts on http://localhost:8873
```

### Start the Frontend

```bash
cd client
npm run dev
# App opens on http://localhost:5173
```

> Both servers must be running simultaneously. The Vite dev server proxies `/api` requests to the backend automatically.

---

## 🔌 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ✗ |
| POST | `/api/auth/login` | Login user | ✗ |
| GET | `/api/products` | Get all products | ✓ |
| GET | `/api/products/search?q=` | Search products | ✓ |
| POST | `/api/products` | Create product | ✓ |
| PUT | `/api/products/:id` | Update product | ✓ |
| DELETE | `/api/products/:id` | Delete product | ✓ |
| POST | `/api/products/generate-ai` | Generate AI content | ✓ |
| GET | `/api/analytics/dashboard` | Dashboard stats | ✓ |
| GET | `/api/analytics/suggestions` | AI suggestions | ✓ |
| GET | `/api/notifications` | Live notifications | ✓ |

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use and modify for personal or commercial projects.

---

<div align="center">
Built with ❤️ using the MERN Stack + Google Gemini AI
</div>
