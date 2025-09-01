# Store Rating Management System

A full-stack web application that allows users to submit ratings (1–5 stars) for registered stores.  
The system includes role-based access (Admin, Store Owner, User) with authentication, store management, and rating features.  

- **Backend**: NestJS (TypeScript)  
- **Frontend**: React 18 + Vite  
- **Database**: PostgreSQL  
- **Styling**: TailwindCSS + shadcn/ui  

---

## 🎥 Demo Video  
https://youtu.be/f1R5oIc8nGY?si=OSBRPoBdcccNO7p8

---

## ⚙️ Features
- JWT Authentication & Authorization  
- Admin dashboard for managing users & stores  
- Store owners can view ratings for their stores  
- Users can rate stores (1–5 stars)  
- Secure password hashing with bcrypt  
- Validation on both client and server side  
- Responsive UI with TailwindCSS  

---

## 🛠️ Prerequisites
- Node.js **18+**  
- PostgreSQL **12+**  
- npm or yarn  

---

## 🗄️ Database Setup
1. Install PostgreSQL and create a database:
   ```sql
   CREATE DATABASE store_rating;
Default local connection settings:

Database: store_rating

Host: localhost
Port: 5432
User: UserName
Password: Password
Configure .env in the backend with your credentials:

.env

"PORT=4000
DB_NAME=store_rating
DB_HOST=localhost
DB_PORT=5432
DB_USER=YourUserName
DB_PASS=YourPassword
CORS_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d"


#Installation & Setup
1. Clone the Repository
git clone <repository-url>
cd store-rating-system

2. Backend Setup
cd backend
npm install

Run database seed (creates default admin user):
npm run build
npm run seed

Start backend server:
npm run start:dev

3. Frontend Setup
cd frontend
npm install
Start frontend server:
npm run dev

App will be available at:
👉 http://localhost:5173

🔑 Default Admin Account
After seeding the DB, login with:
Email: admin@store.com
Password: AdminPass@123

📂 Project Structure
perl
Copy code
store-rating-system/
│── backend/         # NestJS backend
│   └── package.json
│── frontend/        # React frontend (Vite)
│   └── package.json
└── README.md

📜 Available Scripts
Backend
npm run start:dev → Run backend in dev mode
npm run seed → Seed DB with default admin
npm run build → Build backend
Frontend
npm run dev → Run frontend in dev mode
npm run build → Build frontend
npm run preview → Preview production build

🔐 Security Features
JWT Authentication with refresh tokens
Role-based access control (RBAC)
Password hashing with bcrypt
CORS configuration
