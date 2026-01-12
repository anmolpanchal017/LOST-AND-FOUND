import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";

export default function AdminDashboard() {
  const { user, role } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 900, margin: "auto", padding: 24 }}>
        <h1>🛡 Admin Dashboard</h1>

        <p>
          <strong>Name:</strong> {user?.displayName}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>
            {role}
          </span>
        </p>

        <hr style={{ margin: "20px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={cardStyle}>
            <h3>📦 Manage Lost Items</h3>
            <p>View / delete inappropriate lost items</p>
          </div>

          <div style={cardStyle}>
            <h3>✅ Manage Found Items</h3>
            <p>Moderate found items</p>
          </div>

          <div style={cardStyle}>
            <h3>👤 Manage Users</h3>
            <p>Block / unblock users</p>
          </div>

          <div style={cardStyle}>
            <h3>🤖 AI Match Review</h3>
            <p>Approve AI suggested matches</p>
          </div>
        </div>
      </div>
    </>
  );
}

const cardStyle = {
  padding: 16,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
