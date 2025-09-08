import { useJwt } from "react-jwt";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("auth-token");
  const { isExpired } = useJwt(token);

  // If user is logged in and tries to visit login/signup → redirect to dashboard
  if (
    (location.pathname === "/login" || location.pathname === "/signup") &&
    token &&
    !isExpired
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // If route is protected, token is missing OR expired → redirect to login
  if (!token || isExpired) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow access
  return <Outlet />;
};

export default ProtectedRoute;
