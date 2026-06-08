# Promotion and Marketing Subsystem (PMS)

A full-stack web application for SwiftWheels Enterprises to manage vehicle promotions digitally. Built for the National Practical Examination.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, Recharts
- **Backend:** Node.js, Express.js, MySQL, Express Session, BcryptJS
- **Database:** MySQL (Database: PMS)

## Features

- ✅ Session-based Authentication
- ✅ Vehicle Management (CRUD + Search + Pagination)
- ✅ Customer Management (CRUD + Search + Pagination)
- ✅ Promotion Management (CRUD + Search + Pagination)
- ✅ Promotion-Vehicle Assignment
- ✅ Dashboard with Summary Cards & Recent Records
- ✅ Reports with Search, Print, and CSV Export
- ✅ Responsive Design

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm

## Setup Instructions

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run schema and seed scripts
source database/schema.sql
source database/seed.sql

exit
```

### 2. Setup Admin Password

After creating the database, run the seed script to generate the correct password hash:

```bash
cd backend
npm install
node scripts/seedUser.js
```

This creates/updates the admin user with username `admin` and password `admin123`.

### 3. Backend Setup

```bash
cd backend
npm install

# Configure environment (edit if needed)
# .env file is pre-configured for local development

# Start backend server
npm start
# Server runs on http://localhost:5000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 5. Access the Application

Open http://localhost:5173 in your browser.

**Default Login:**
- Username: `admin`
- Password: `admin123`
- Role: Admin

## Project Structure

```
pms/
├── backend/
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── models/        # Database models
│   ├── routes/        # Express routes
│   ├── app.js         # Express app setup
│   └── server.js      # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   ├── routes/      # Protected route wrapper
│   │   └── services/    # API service layer
│   └── index.html
└── database/
    ├── schema.sql       # Database schema
    └── seed.sql         # Sample data
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/session | Check session |
| GET/POST/PUT/DELETE | /api/vehicles | Vehicle CRUD |
| GET/POST/PUT/DELETE | /api/customers | Customer CRUD |
| GET/POST/PUT/DELETE | /api/promotions | Promotion CRUD |
| GET/POST/PUT/DELETE | /api/promotion-vehicles | Assignment CRUD |
| GET | /api/dashboard | Dashboard stats |
| GET | /api/reports | Report data |
