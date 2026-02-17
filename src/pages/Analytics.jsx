import { useEffect, useState } from "react";

function Analytics() {
  const [users, setUsers] = useState([]);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        getAIInsight(data);
      });
  }, []);

  // function generateInsight(data) {
  //   const adminCount = data.filter(u => u.role === "admin").length;
  //   const managerCount = data.filter(u => u.role === "manager").length;
  //   const userCount = data.filter(u => u.role === "user").length;

  //   if (adminCount > 2) {
  //     setInsight("High number of admins detected.");
  //   } else if (userCount > adminCount) {
  //     setInsight("Most accounts are normal users.");
  //   } else {
  //     setInsight("User roles look balanced.");
  //   }
  // }

   function getAIInsight(data) {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/ai-insight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ users: data }),
    })
      .then(res => res.json())
      .then(result => setInsight(result.insight))
      .catch(err => {
      console.log("AI fetch error:", err);
      setInsight("AI insight unavailable");
      });
  }

  return (
    <div>
      <h2>AI Analytics</h2>

      <p>Total Users: {users.length}</p>
      {/* <p>Admins: {users.filter(u => u.role === "admin").length}</p>
      <p>Managers: {users.filter(u => u.role === "manager").length}</p>
      <p>Users: {users.filter(u => u.role === "user").length}</p> */}

      <div style={{ marginTop: "20px" }}>
        <strong>AI Insight:</strong>
        <p>{insight}</p>
      </div>
    </div>
  );
}

export default Analytics;
