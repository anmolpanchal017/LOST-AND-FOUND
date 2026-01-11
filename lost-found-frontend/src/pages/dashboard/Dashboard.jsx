import Navbar from "../../components/common/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LostForm from "../lost/LostForm";
import FoundForm from "../found/FoundForm";
import FoundList from "../found/FoundList";
import FinderClaims from "../claims/FinderClaims";
import "./Dashboard.css"; // Import the CSS file

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
           
      <div className="dashboard-container">
        {/* HERO HEADER */}
        <header className="dashboard-header">
          <h1 className="welcome-title">
            Welcome, {user.displayName}! 👋
          </h1>
          <p className="welcome-subtitle">
            Manage your lost and found items effortlessly.
          </p>
        </header>

        {/* FORMS SECTION */}
        <section className="forms-section">
          <h2 className="section-title">📝 Quick Actions</h2>
          <div className="forms-grid">
            <div className="form-card">
              <div className="card-icon">🔍</div>
              <h3>Report Lost Item</h3>
              <LostForm />
            </div>
            <div className="form-card">
              <div className="card-icon">✅</div>
              <h3>Report Found Item</h3>
              <FoundForm />
            </div>
          </div>
        </section>

        {/* FOUND ITEMS SECTION */}
        <section className="items-section">
          <h2 className="section-title">📦 Found Items</h2>
          <div className="items-card">
            <FoundList />
          </div>
        </section>

        {/* CLAIMS SECTION */}
        <section className="claims-section">
          <h2 className="section-title">📋 Your Claims</h2>
          <div className="claims-card">
            <FinderClaims />
          </div>
        </section>
      </div>
    </>
  );
}