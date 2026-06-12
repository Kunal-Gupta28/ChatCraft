import { Navigate, Outlet } from "react-router-dom";

const UserAuth = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default UserAuth;