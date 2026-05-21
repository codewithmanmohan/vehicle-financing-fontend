# DriveEase Finance Platform

DriveEase Finance is a comprehensive, production-ready full-stack web application designed for vehicle financing and leasing in the Indian market. It offers a premium, modern user interface, robust JWT authentication, multi-step application processes, full-featured EMI calculations, and a complete admin dashboard for managing vehicles, customers, and applications.

## 🌟 Key Features

### Public & User Features
- **Modern Luxury UI:** Built with `shadcn/ui`, `Tailwind CSS`, and `framer-motion` for smooth animations and transitions. Dark mode aesthetic.
- **Dynamic Landing Page:** Features an interactive 3D hero section with scroll animations and dynamic statistics.
- **Authentication:** Secure JWT-based authentication (Login, Multi-step Registration with KYC capture).
- **Vehicle Gallery:** Browse inventory with advanced filtering (Category, Fuel, Price) and search capabilities.
- **Vehicle Details:** Detailed breakdown including Ex-Showroom, RTO, and Insurance (On-Road Price calculation).
- **EMI Calculator:** Interactive slider-based calculator with pie chart breakdown (`recharts`).
- **Financing Application:** Multi-step wizard to apply for a loan or lease, capturing employment and down payment details. Confetti celebration on success.
- **Application Tracking:** Track application status via an interactive timeline.

### Admin Dashboard
- **Overview Analytics:** Charts showing application trends and approval ratios.
- **Application Manager:** Review, approve, reject, or request documents for incoming applications.
- **Vehicle Manager:** Full CRUD for the vehicle inventory, complete with multiple image upload support (Cloudinary integration).
- **Customer List:** View all registered users and their basic KYC/employment info.

---

## 🛠️ Technology Stack

- **Frontend:** React 18 (Vite), React Router v6, Tailwind CSS, shadcn/ui, Framer Motion, Axios, React Hook Form + Zod, Recharts, Lucide React.
- **Backend:** Node.js, Express.js, MongoDB + Mongoose.
- **Security & Auth:** JWT, bcryptjs, Helmet, Express Rate Limit, CORS.
- **Storage:** Cloudinary (for vehicle image uploads), Multer (memory storage).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### 1. Clone & Setup

```bash
# Backend Setup
cd server
npm install

# Frontend Setup
cd ../client
npm install
```

### 2. Environment Variables

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vehiclefinance
JWT_SECRET=your_super_secret_key_driveease
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Optional but Recommended)
Populate the database with sample admin user, dummy users, and initial vehicle inventory.
```bash
cd server
npm run seed
```
*Note: The default admin credentials from the seed script are:*
- **Email:** admin@driveease.com
- **Password:** admin123

### 4. Run the Application

**Run Server:**
```bash
cd server
npm run dev
```

**Run Client:**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
DriveEase/
├── client/
│   ├── src/
│   │   ├── components/   # Reusable UI (Navbar, Sidebar, shared components)
│   │   ├── hooks/        # Custom hooks (useAuth)
│   │   ├── lib/          # Utilities (Axios config, formatting)
│   │   ├── pages/        # Route pages (Auth, User Dashboard, Admin Dashboard)
├── server/
│   ├── config/           # DB & Cloudinary config
│   ├── controllers/      # Route logic handlers
│   ├── middleware/       # Auth, AdminAuth, Error handling, Multer
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   └── server.js         # Express entry point
└── README.md
```

## 🛡️ Security Measures
- **Password Hashing:** `bcryptjs`
- **Authentication:** HttpOnly / Bearer JWT
- **API Protection:** `helmet` for HTTP headers, `express-rate-limit` to prevent brute force.
- **Validation:** Frontend `zod` validation, Backend `express-validator` (where applicable) and Mongoose schema validation.
