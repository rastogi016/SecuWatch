import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";

import { useAlertWebSocket } from "./hooks/useWebSocket";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Apache from "./pages/Apache";
import Windows from "./pages/Windows";
import Linux from "./pages/Linux";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const App = () => {
  const [alerts, setAlerts] = useState({ apache: [], windows: [], linux: [] });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const seenAlertIds = useRef(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  useAlertWebSocket((newAlert) => {
    const source = newAlert.source || "unknown";
    if (!seenAlertIds.current.has(newAlert.alert_id)) {
      seenAlertIds.current.add(newAlert.alert_id);
      setAlerts((prev) => ({
        ...prev,
        [source]: [newAlert, ...(prev[source] || [])].sort(
          (a, b) => new Date(b.generated_at) - new Date(a.generated_at)
        ),
      }));
    }
  });

  useEffect(() => {
    fetch("http://localhost:8000/alerts")
      .then((res) => res.json())
      .then((data) => {
        const newAlerts = { apache: [], windows: [], linux: [] };
        ["apache", "windows", "linux"].forEach((source) => {
          const sourceAlerts = data[source] || [];
          newAlerts[source] = sourceAlerts
            .filter((alert) => {
              if (!seenAlertIds.current.has(alert.alert_id)) {
                seenAlertIds.current.add(alert.alert_id);
                return true;
              }
              return false;
            })
            .sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at));
        });
        setAlerts(newAlerts);
      })
      .catch((err) => console.error("Initial fetch error:", err));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProtectedLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard alerts={alerts} />} />
        <Route path="/analytics" element={<Analytics alerts={alerts} />} />
        <Route path="/apache" element={<Apache alerts={alerts.apache} />} />
        <Route path="/windows" element={<Windows alerts={alerts.windows} />} />
        <Route path="/linux" element={<Linux alerts={alerts.linux} />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
};

export default App;
