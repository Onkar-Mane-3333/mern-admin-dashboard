import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

//“The component wrapped inside <AdminRoute>.”
// <AdminRoute>
//   <Users />
// </AdminRoute>

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);  //reads the data stored inside the JWT token.

    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" />;
    }

  } catch {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;
