import { useJwt } from "react-jwt";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAuthRoute = () => {
  const token = localStorage.getItem("auth-token");

  const { isExpired } = useJwt(token);

  if (token && !isExpired) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedAuthRoute;
