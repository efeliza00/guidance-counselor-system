import { createRoot } from "react-dom/client";
import React from "react";
import App from "./app.jsx";

import "./index.css";

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/auth/login.jsx";
import Signup from "../components/auth/signup.jsx";
import ProtectedAuthRoute from "../components/protected-route/protected-auth-route.jsx";
import ProtectedRoute from "../components/protected-route/protected-route.jsx";
import Dashboard from "../components/dashboard/dashboard.jsx";
import AddComplaint from "../components/dashboard/menus/add-complaint.jsx";
import { PrimeReactProvider } from "primereact/api";
import Students from "../components/dashboard/menus/students.jsx";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ToastProvider from "../components/providers/toast-provider.jsx";
import Complaints from "../components/dashboard/menus/complaints.jsx";
import ComplaintDetail from "../components/dashboard/menus/complaint-detail.jsx";
import Overview from "../components/dashboard/menus/overview.jsx";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <PrimeReactProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Navigate to="login" replace />} />

              <Route element={<ProtectedAuthRoute />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="complaints" element={<Complaints />} />
                  <Route path="students" element={<Students />} />
                  <Route
                    path="complaints/:complaintId"
                    element={<ComplaintDetail />}
                  />
                  <Route path="add-complaint" element={<AddComplaint />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </ToastProvider>
    </PrimeReactProvider>
  </React.StrictMode>
);
