import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import useAuthStore from "../../store/authStore";
import axiosInstance from "../../api/axiosInstance";
import { Loader } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from Supabase after OAuth redirect
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          setError("Authentication failed. Please try again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const token = data.session.access_token;

        // Fetch user profile from our backend
        const res = await axiosInstance.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.data;
        setAuth(token, user);

        if (user.role === "DOCTOR") navigate("/doctor/dashboard");
        else navigate("/patient/dashboard");

      } catch (err) {
        // User exists in Supabase but not in our DB yet
        // Redirect to complete profile setup
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate("/complete-profile", {
            state: { token: data.session.access_token }
          });
        } else {
          setError("Something went wrong. Please try again.");
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#030712",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "inherit",
      }}>
        <div style={{
          textAlign: "center", color: "#ef4444", fontSize: "1rem",
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#030712",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "16px",
    }}>
      <Loader size={32} color="#0ea5e9" style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
        Completing sign in...
      </p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}