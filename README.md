# 🏥 MediCare — Patient Management System

A production-ready full-stack healthcare management platform built with **React**, **Node.js**, **Express**, and **Prisma ORM**. MediCare enables doctors and patients to manage appointments, prescriptions, medical records, and vital signs through a clean, modern interface.

🌐 **Live Demo:** [patient-management-system-six-teal.vercel.app](https://patient-management-system-six-teal.vercel.app)

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)
![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Test Credentials](#-test-credentials)
- [Author](#-author)

---

## ✨ Features

### 🔐 Authentication & Security
- Email verification flow with Supabase Auth
- JWT-based authentication with role-based access control (Doctor / Patient)
- Protected routes on both frontend and backend
- Verified doctor badge via NMC registration number

### 🤖 AI-Powered Features
- **Symptom Checker** — Patients describe symptoms and get AI-powered analysis including possible conditions, severity level, recommended specialist, and general advice (powered by Groq LLaMA)

### 👨‍⚕️ Doctor Portal
- **Dashboard** — Stats overview with NMC verification banner and verified badge
- **Patient List** — Search, paginate, and view all assigned patients
- **Patient Detail** — Tabbed view of medical history, vital signs, prescriptions, and appointments
- **Appointments** — Confirm, complete, or cancel appointments with status filters
- **Prescriptions** — Create detailed prescriptions with multiple medicines and dosages
- **NMC Verification** — Doctors can verify their profile with their NMC registration number

### 🧑‍💼 Patient Portal
- **Dashboard** — Overview of upcoming appointments and recent prescriptions
- **My Appointments** — Book new appointments, view status, and cancel pending ones
- **My Prescriptions** — View all prescriptions with medicine details
- **My History** — View medical conditions and vital sign trends
- **Symptom Checker** — AI-powered symptom analysis

### 🎨 UI/UX
- Clean, modern design with consistent design system
- Smooth animations and transitions
- Reusable component classes (cards, buttons, forms, modals, badges)
- Empty states, loading spinners, and error handling throughout
- Responsive sidebar navigation with role-based menu items

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| React Router v6 | Client-side routing |
| Zustand | Global state management |
| Axios | HTTP client |
| Lucide React | Icon library |
| Tailwind CSS v4 | Utility CSS framework |
| Vite | Build tool & dev server |
| Supabase JS | Email verification callback |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js v5 | Web framework |
| Prisma ORM v5 | Database ORM |
| PostgreSQL | Relational database (Supabase) |
| Supabase Auth | Authentication & email verification |
| Groq API (LLaMA) | AI symptom analysis |
| cors | Cross-origin requests |
| dotenv | Environment config |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Supabase | Database + Auth |

---

## 📁 Project Structure
```
patient-management-system/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios API functions
│   │   ├── components/
│   │   │   └── layout/         # Sidebar, PageWrapper
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Signup, EmailVerificationPending, VerifyEmail
│   │   │   ├── doctor/         # Dashboard, PatientList, PatientDetail, Appointments, Prescriptions
│   │   │   └── patient/        # Dashboard, MyAppointments, MyPrescriptions, MyHistory, SymptomChecker
│   │   ├── store/
│   │   │   └── authStore.js    # Zustand auth store
│   │   ├── App.jsx             # Routes & layout
│   │   └── main.jsx            # Entry point
│   └── vercel.json             # Vercel routing config
│
├── server/                     # Express backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.js             # NMC registry seed data
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middlewares/        # Auth & role middleware
│   │   ├── routes/             # Express route definitions
│   │   ├── utils/              # Response helpers
│   │   └── app.js              # Express app setup
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **Supabase** account (free tier)
- **Groq** API key (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/Samarth1542005/patient-management-system.git
cd patient-management-system
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=8000
CLIENT_URL=http://localhost:5173
DATABASE_URL=your_supabase_connection_pooler_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Run database migrations and seed NMC data:
```bash
npx prisma migrate dev
npx prisma generate
npm run seed
```

Start the server:
```bash
npm run dev
```

### 3. Setup the frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the dev server:
```bash
npm run dev
```

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8000) |
| `CLIENT_URL` | Frontend URL for CORS |
| `DATABASE_URL` | Supabase PostgreSQL connection pooler URL |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret |
| `GROQ_API_KEY` | Groq API key for AI symptom checker |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login & receive JWT |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/resend-verification` | Resend verification email |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/me` | Get own profile |
| PATCH | `/api/doctors/me` | Update own profile |
| GET | `/api/doctors/stats` | Get dashboard stats |
| POST | `/api/doctors/verify-nmc` | Verify NMC registration number |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Book a new appointment |
| GET | `/api/appointments/my` | Get patient's appointments |
| GET | `/api/appointments/doctor` | Get doctor's appointments |
| PATCH | `/api/appointments/:id/status` | Update appointment status |
| DELETE | `/api/appointments/:id` | Cancel an appointment |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients (Doctor) |
| GET | `/api/patients/:id` | Get patient detail |
| POST | `/api/patients/:id/history` | Add medical condition |
| POST | `/api/patients/:id/vitals` | Record vital signs |

### Prescriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/prescriptions` | Create a prescription |
| GET | `/api/prescriptions/my` | Get patient's prescriptions |
| GET | `/api/prescriptions/patient/:id` | Get prescriptions for a patient |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/symptom-check` | AI-powered symptom analysis |

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Doctor | dr.rajesh@gmail.com | Doctor@123 |
| Patient | rautsamarth282@gmail.com | your_password |

> **Note:** The backend is hosted on Render's free tier and may take 30–50 seconds to wake up on first request.

---

## 👤 Author

**Samarth Raut**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samarth-raut-028835281)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?logo=github&logoColor=white)](https://github.com/Samarth1542005)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).