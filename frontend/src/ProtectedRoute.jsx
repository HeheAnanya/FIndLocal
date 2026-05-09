import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;  // Not logged in
  if (role && user.role !== role) return <Navigate to="/" />; // Wrong role

  return children;
};

export default ProtectedRoute;
