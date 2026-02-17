import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Analytics from "./pages/Analytics";
import Chatbot from "./pages/Chatbot";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetails />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* REDIRECT */}
      <Route path="/home" element={<Navigate to="/users" />} />
      
      {/* NESTED ROUTES */}
      {/* <Route path="/dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route> */}

      {/* PROTECTED DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route 
        path="users" 
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="chat" element={<Chatbot />} />

      </Route>
          

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;


