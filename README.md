
# Store Rating Management System

A full‑stack web app where users rate registered stores (⭐1–5). Includes role‑based access (Admin, Store Owner, User), authentication, store management, and rating features.

> **Stack**: NestJS (TypeScript) · React 18 + Vite · PostgreSQL · TailwindCSS + shadcn/ui

---

## 🎥 Demo

[![Store Rating Demo](https://img.youtube.com/vi/f1R5oIc8nGY/0.jpg)](https://youtu.be/f1R5oIc8nGY?si=OSBRPoBdcccNO7p8)

---

## ✨ Features
- JWT **Authentication** (access + refresh tokens)
- **RBAC**: Admin / Store Owner / User
- Admin dashboard: manage users & stores
- Store Owners: view ratings for their stores
- Users: rate stores (1–5 stars), edit own rating
- **bcrypt** password hashing
- Client & server **validation**
- Responsive UI (Tailwind + shadcn/ui)

---

## 🧩 Project Structure
```
store-rating-system/
│── backend/          # NestJS API (TypeScript)
│   ├── src/
│   ├── prisma|typeorm/  # depends on ORM used
│   ├── .env.example
│   └── package.json
│── frontend/         # React 18 + Vite
│   ├── src/
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites
- Node.js **18+**
- PostgreSQL **12+**
- npm or yarn

---

## 🚀 Quick Start (Local)
```bash
# 1) Clone
git clone <repository-url> store-rating-system
cd store-rating-system

# 2) Start database (choose one)
#    A) Use local Postgres you already have
#    B) Or spin up via Docker (optional)
# docker run --name store-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=store_rating -p 5432:5432 -d postgres:16

# 3) Backend
cd backend
cp .env.example .env   # then edit values
npm install
npm run build
npm run seed           # creates default admin user
npm run start:dev      # API at http://localhost:4000

# 4) Frontend
cd ../frontend
cp .env.example .env   # then edit values
npm install
npm run dev            # UI at http://localhost:5173
```

---

## 🗄️ Database Setup
Create the database (if not using Docker image):
```sql
CREATE DATABASE store_rating;
```
**Default local connection**
- Host: `localhost`
- Port: `5432`
- DB: `store_rating`
- User: `postgres` (or your user)
- Password: `your password`

---

## 🔐 Environment Variables

### Backend `.env` (example)
```
# Server
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating
DB_USER=postgres
DB_PASS=postgres

# Auth
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

### Frontend `.env` (example)
```
VITE_API_URL=http://localhost:4000
```

> **Tip:** Ensure there are **no stray characters** in `.env` (e.g., quotes or trailing letters). Each line should be `KEY=VALUE` with no quotes.

---

## 🧪 Seeding & Default Login
After `npm run seed` in **backend**:
- **Admin**
  - Email: `admin@store.com`
  - Password: `AdminPass@123`

> If you change these defaults, update `seed` script logic accordingly.

---

## 🖥️ Scripts

### Backend
- `npm run start:dev` – run API in watch mode (Nest)
- `npm run build` – compile TypeScript
- `npm run seed` – seed DB with default admin (and sample data if provided)

### Frontend
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build

---


## 🧰 Tech Notes
- **NestJS**: Modules for Auth, Users, Stores, Ratings
- **ORM**: TypeORM or Prisma (ensure one is selected & documented)
- **Validation**: class‑validator / class‑transformer DTOs
- **Frontend**: React Query / Axios for data fetching; shadcn/ui for components


