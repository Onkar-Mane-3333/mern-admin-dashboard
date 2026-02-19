import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://mern-admin-dashboard-5xlx.onrender.com/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => alert("Failed to load profile"));
  }, []);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2>Profile</h2>

      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <p>
        <strong>Token expires at:</strong>{" "}
        {new Date(user.exp * 1000).toLocaleString()}
      </p>
    </div>
  );
}

export default Profile;
