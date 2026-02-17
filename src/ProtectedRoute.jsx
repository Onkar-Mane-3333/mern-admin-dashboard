import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // const isLoggedIn = false; // 👈 change to true to test

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
