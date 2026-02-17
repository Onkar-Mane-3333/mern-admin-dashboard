import { useNavigate} from "react-router-dom"
// NavLink ek React Router component hai jo page navigation ke liye use hota hai, aur ye automatically current (active) page ko highlight kar sakta hai.
import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/dashboard.css";
import { User, Settings, Users, LogOut } from "lucide-react";




function Dashboard() {

  const [data, setData] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
  total: 0,
  admins: 0,
  managers: 0,
  users: 0
});



  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  // decode token
  const decoded = jwtDecode(token);   //jwtDecode(token) This function decodes the JWT token and returns its payload.
  setUserEmail(decoded.email);    //This stores the email in React state.


//.then(res . this  res is the Response object returned by fetch().
// It contains things like:
// status code
// headers
// body
// res.ok is true if status is 200–299.
  fetch("https://mern-admin-dashboard-5xlx.onrender.com/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => setData(data))         //saves the API response into React state so it can be displayed.
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/login");
    });

    fetch("https://mern-admin-dashboard-5xlx.onrender.com/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(users => {
      setMetrics({
        total: users.length,
        admins: users.filter(u => u.role === "admin").length,
        managers: users.filter(u => u.role === "manager").length,
        users: users.filter(u => u.role === "user").length
      });
    });
}, [navigate]);

  function handleDeleteUsers() {
  const token = localStorage.getItem("token");

  fetch("https://mern-admin-dashboard-5xlx.onrender.com/users", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(() => alert("Action failed"));
}

  function handleViewUsers() {
  const token = localStorage.getItem("token");

  fetch("https://mern-admin-dashboard-5xlx.onrender.com/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(() => alert("Failed to fetch users"));
}


  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div  className="dashboard-container">
      <div className="sidebar">
      <h1>📊 Dashboard</h1>
      <p>Logged in as: {userEmail}</p>
      {/* <button onClick={handleViewUsers}>View Users</button>
       */}

     <nav className="sidebar-nav">
      <NavLink to="profile" className="nav-link">
        <User size={18} />Profile
      </NavLink>

      <NavLink to="settings" className="nav-link">
        <Settings size={18} />Settings
      </NavLink>
        {/* Show the Users link only if the logged-in user’s role is admin.” 
        data → API response
        user → user object inside data
        role → user’s role
        "admin" → value we are checking .. and ?. is a  Optional chaining is used to avoid errors when accessing nested properties that may not exist yet. Without it, your app can crash.*/}
      {data?.user?.role === "admin" && (
        <NavLink to="users" className="nav-link">
          <Users size={18} /> Users
        </NavLink>
      )}

      <NavLink to="analytics" className="nav-link">
        Analytics
      </NavLink>

      <NavLink to="chat" className="nav-link">
        ChatBox
      </NavLink>


      <button onClick={handleLogout}><LogOut size={18} />Logout</button>
    </nav>

      </div>
 
      <hr />

         {/* API response preview . This code shows the API response in formatted JSON only when data is available. data → content
null → print all lines
2 → spacing between lines
*/}
      {/* {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )} */}

       {/* ADMIN UI HERE This is called role-based UI rendering.*/}
    {/* {data?.user?.role === "admin" && (
      <div style={{ marginTop: "20px" }}>
        <h3>Admin Panel</h3>
        <button onClick={handleDeleteUsers}>Delete Users</button>
        <button>Manage Reports</button>
      </div>
    )} */}

    {/* {users.length > 0 && (
  <div>
    <h3>Users List</h3>
    {users.map(user => (
      <p key={user._id}>
        {user.email} — {user.role}
      </p>
    ))}
  </div>
)} */}

      {/* Child routes render here */}
      <div className="content">
        {/* HEADER BAR */}
        <div className="dashboard-header">
          <h3>Admin Dashboard</h3>
          <span>{userEmail}</span>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Total Users</h4>
            <p>{metrics.total}</p>
          </div>

          <div className="metric-card">
            <h4>Admins</h4>
            <p>{metrics.admins}</p>
          </div>

          <div className="metric-card">
            <h4>Managers</h4>
            <p>{metrics.managers}</p>
          </div>

          <div className="metric-card">
            <h4>Users</h4>
            <p>{metrics.users}</p>
          </div>
        </div>


        {/* PAGE CONTENT */}
        <div className="dashboard-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
