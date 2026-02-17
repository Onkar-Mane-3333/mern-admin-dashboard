import { useParams } from "react-router-dom";

function UserDetails() {
  const { id } = useParams(); // 👈 magic. URL ke dynamic part (:id) ki value component me lene ke liye useParams use hota hai 👍

  return (
    <div>
      <h1>🧾 User Details</h1>
      <p>User ID: {id}</p>
    </div>
  );
}

export default UserDetails;
