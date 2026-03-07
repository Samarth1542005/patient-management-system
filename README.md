# 🏥 Patient Management System

A full-stack web application for managing patient records, appointments, and prescriptions — built with a modern, production-grade tech stack.

## 🚀 Live Demo
> Coming soon (deploying on Vercel + Render)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + shadcn/ui |
| State Management | Zustand |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Deployment | Vercel (frontend) + Render (backend) |

## ✨ Features

### Doctor
- Secure login with role-based access
- View and manage all patients
- Confirm, complete or cancel appointments
- Write prescriptions with medicines
- Record patient vital signs
- Add patient medical history
- Dashboard with stats (total patients, appointments, prescriptions)

### Patient
- Secure login with role-based access
- View and update own profile
- Book appointments with doctors
- View prescriptions and medicines
- View full medical history and vital signs trends

## 🗄️ Database Schema
```
User → Doctor / Patient (1:1)
Patient → Appointments → Prescriptions → Medicines
Patient → MedicalHistory
Patient → VitalSigns
```

## 📁 Project Structure
```
patient-management-system/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/   # Auth, Doctor, Patient pages
│       ├── components/
│       ├── store/   # Zustand
│       ├── hooks/
│       └── api/     # Axios
│
└── server/          # Express backend
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── services/
    │   └── utils/
    └── prisma/
        └── schema.prisma
```

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Protected |

### Patients
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/patients/me` | Patient |
| PATCH | `/api/patients/me` | Patient |
| GET | `/api/patients` | Doctor |
| GET | `/api/patients/:id` | Doctor |
| GET | `/api/patients/:id/history` | Doctor + Patient |
| POST | `/api/patients/:id/medical-history` | Doctor |
| POST | `/api/patients/:id/vitals` | Doctor |

### Appointments
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/appointments` | Patient |
| GET | `/api/appointments/my` | Patient |
| PATCH | `/api/appointments/:id/cancel` | Patient |
| GET | `/api/appointments` | Doctor |
| PATCH | `/api/appointments/:id/status` | Doctor |

### Prescriptions
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/prescriptions` | Doctor |
| GET | `/api/prescriptions/my` | Patient |
| GET | `/api/prescriptions/:id` | Doctor + Patient |
| GET | `/api/prescriptions/patient/:id` | Doctor |

### Doctors
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/doctors` | Protected |
| GET | `/api/doctors/me` | Doctor |
| PATCH | `/api/doctors/me` | Doctor |
| GET | `/api/doctors/stats` | Doctor |

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm
- Supabase account

### Steps
```bash
# Clone the repo
git clone https://github.com/Samarth1542005/patient-management-system.git
cd patient-management-system

# Setup server
cd server
npm install
cp .env.example .env
# Fill in your .env values

# Run migrations
npx prisma migrate dev

# Start server
npm run dev

# Setup client (new terminal)
cd client
npm install
npm run dev
```

## 🔑 Environment Variables
```bash
PORT=
CLIENT_URL=
DATABASE_URL=
SUPABASE_JWT_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## 👨‍💻 Author
**Samarth Raut**
- GitHub: [@Samarth1542005](https://github.com/Samarth1542005)
- LinkedIn: [your-linkedin]

## 📄 License
MIT