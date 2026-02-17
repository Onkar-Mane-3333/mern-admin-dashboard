// import { Link } from "react-router-dom";

// function Users() {
//   return (
//     <div>
//       <h1>👥 Users</h1>

//       <ul>
//         <li><Link to="/users/1">User 1</Link></li>
//         <li><Link to="/users/2">User 2</Link></li>
//         <li><Link to="/users/3">User 3</Link></li>
//       </ul>
//     </div>
//   );
// }

// export default Users;

import { useEffect, useState } from "react";
import "../styles/users.css";


function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://mern-admin-dashboard-5xlx.onrender.com/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data =>{
          setUsers(data);
          setLoading(false);
      })
      .catch(() => alert("Failed to load users"));
  }, []);


  function handleDeleteUser(id) {

  const confirmDelete = window.confirm("Are you sure you want to delete this user?");  //This shows a browser popup dialog with:OK  and  Cancel .This code is used to ask the user for confirmation before deleting something.
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  fetch(`https://mern-admin-dashboard-5xlx.onrender.com/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(() => {
      setUsers(prev => prev.filter(user => user._id !== id));  //.filter(...)This creates a new array without the deleted user.
    })
    .catch(() => alert("Delete failed"));
}

  function handleUpdateUser(id) {
    const token = localStorage.getItem("token");

    fetch(`https://mern-admin-dashboard-5xlx.onrender.com/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then(res => res.json())
      .then(updatedUser => {
        setUsers(prev =>
          prev.map(user =>
            user._id === id ? updatedUser : user
          )
        );

        setEditingUserId(null);
        setNewRole("");
      })
      .catch(() => alert("Update failed"));
  }

  function handleCancelEdit() {
  setEditingUserId(null);
  setNewRole("");
  }

  if (loading) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}


  return (
  <div>
    <h2>Users</h2>
    
    {users.length === 0 ? (
      <p>No users available</p>
    ) : (
      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
          <tr key={user._id}>
            <td>{user.email}</td>

            <td>
              {editingUserId === user._id ? (
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              ) : (
                user.role
              )}
            </td>

            <td>
              {editingUserId === user._id ? (
                <>
                  <button
                    className="save-btn"
                    onClick={() => handleUpdateUser(user._id)}>
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingUserId(user._id);
                    setNewRole(user.role);
                  }}
                >
                  Edit
                </button>
              )}

              <button
                className="delete-btn"
                onClick={() => handleDeleteUser(user._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}

        </tbody>
      </table>
    )}
  </div>
);
}

export default Users;

