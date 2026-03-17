# 🏥 MediCare — Patient Management System

A full-stack healthcare management platform built with **React**, **Node.js**, **Express**, and **Prisma ORM**. MediCare enables doctors and patients to manage appointments, prescriptions, medical records, and vital signs through a clean, modern interface.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure httpOnly cookies
- Role-based access control (Doctor / Patient)
- Protected routes on both frontend and backend

### 👨‍⚕️ Doctor Portal
- **Dashboard** — Overview of patients, appointments, and quick stats
- **Patient List** — Search, paginate, and view all assigned patients
- **Patient Detail** — View medical history, vital signs, prescriptions, and appointments per patient
- **Appointments** — View, confirm, complete, or cancel patient appointments with status filters
- **Prescriptions** — Create detailed prescriptions with multiple medicines, dosages, and instructions
- **Medical History** — Add and track patient conditions with severity levels
- **Vital Signs** — Record blood pressure, heart rate, temperature, weight, and SpO2

### 🧑‍💼 Patient Portal
- **Dashboard** — Overview of upcoming appointments and recent prescriptions
- **My Appointments** — Book new appointments, view status, and cancel pending ones
- **My Prescriptions** — View all prescriptions with medicine details
- **My Health History** — View medical conditions and vital sign trends over time

### 🎨 UI/UX
- Clean, modern design with consistent design system
- Smooth animations and transitions (fade-in, stagger, scale)
- Reusable component classes (cards, buttons, forms, tables, modals, badges)
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

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| Prisma ORM | Database ORM |
| PostgreSQL | Relational database |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | Cookie handling |
| cors | Cross-origin requests |
| dotenv | Environment config |

---

## 📁 Project Structure

```
patient-management-system/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/                # Axios API functions
│   │   │   ├── auth.js
│   │   │   ├── appointments.js
│   │   │   ├── doctors.js
│   │   │   ├── patients.js
│   │   │   └── prescriptions.js
│   │   ├── components/
│   │   │   └── layout/         # Sidebar, PageWrapper
│   │   ├── lib/
│   │   │   └── utils.js        # Formatters & helpers
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Signup
│   │   │   ├── doctor/         # Dashboard, PatientList, PatientDetail, Appointments, Prescriptions
│   │   │   └── patient/        # Dashboard, MyAppointments, MyPrescriptions, MyHistory
│   │   ├── store/
│   │   │   └── authStore.js    # Zustand auth store
│   │   ├── App.jsx             # Routes & layout
│   │   ├── index.css           # Global styles & design system
│   │   └── main.jsx            # Entry point
│   └── package.json
│
├── server/                     # Express backend
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/          # Auth & role middleware
│   │   ├── routes/             # Express route definitions
│   │   ├── utils/              # JWT helpers, error handler
│   │   └── app.js              # Express app setup
│   ├── server.js               # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** database (local or cloud e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com))
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/patient-management-system.git
cd patient-management-system
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

Run database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`.

### 3. Setup the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

### 4. Open the app

Visit `http://localhost:5173` in your browser. Sign up as a **Doctor** or **Patient** to get started.

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/medicare` |
| `JWT_SECRET` | Secret key for JWT signing | `my-super-secret-key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client (`client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login & receive JWT cookie |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user profile |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Book a new appointment (Patient) |
| GET | `/api/appointments/my` | Get patient's appointments |
| GET | `/api/appointments/doctor` | Get doctor's appointments |
| PATCH | `/api/appointments/:id/status` | Update appointment status (Doctor) |
| DELETE | `/api/appointments/:id` | Cancel an appointment |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients (Doctor) |
| GET | `/api/patients/:id` | Get patient detail with history |
| GET | `/api/patients/:id/history` | Get patient medical history |
| POST | `/api/patients/:id/history` | Add medical condition |
| POST | `/api/patients/:id/vitals` | Record vital signs |

### Prescriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/prescriptions` | Create a prescription (Doctor) |
| GET | `/api/prescriptions/my` | Get patient's prescriptions |
| GET | `/api/prescriptions/patient/:id` | Get prescriptions for a patient (Doctor) |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | Get all doctors |

---


## 👤 Author

**Samarth Raut**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samarth-raut-028835281)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?logo=github&logoColor=white)](https://github.com/Samarth1542005)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).