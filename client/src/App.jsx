import Landing from "./pages/Landing";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Doctor pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import PatientList from "./pages/doctor/PatientList";
import PatientDetail from "./pages/doctor/PatientDetail";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";

// Patient pages
import PatientDashboard from "./pages/patient/Dashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import MyHistory from "./pages/patient/MyHistory";
import SymptomChecker from "./pages/patient/SymptomChecker";
import ReportAnalyzer from "./pages/patient/ReportAnalyzer";

// Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/login" replace />;

  return children;
};

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard"} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard"} replace />
            ) : (
              <Signup />
            )
          }
        />

        {/* Doctor routes */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute role="DOCTOR"><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/patients" element={<ProtectedRoute role="DOCTOR"><PatientList /></ProtectedRoute>} />
        <Route path="/doctor/patients/:id" element={<ProtectedRoute role="DOCTOR"><PatientDetail /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute role="DOCTOR"><DoctorAppointments /></ProtectedRoute>} />
        <Route path="/doctor/prescriptions" element={<ProtectedRoute role="DOCTOR"><DoctorPrescriptions /></ProtectedRoute>} />

        {/* Patient routes */}
        <Route path="/patient/dashboard" element={<ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/appointments" element={<ProtectedRoute role="PATIENT"><MyAppointments /></ProtectedRoute>} />
        <Route path="/patient/prescriptions" element={<ProtectedRoute role="PATIENT"><MyPrescriptions /></ProtectedRoute>} />
        <Route path="/patient/history" element={<ProtectedRoute role="PATIENT"><MyHistory /></ProtectedRoute>} />
        <Route path="/patient/symptom-checker" element={<ProtectedRoute role="PATIENT"><SymptomChecker /></ProtectedRoute>} />
        <Route path="/patient/report-analyzer" element={<ProtectedRoute role="PATIENT"><ReportAnalyzer /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? (user?.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard") : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}