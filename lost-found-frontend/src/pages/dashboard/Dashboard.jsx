import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer"; // 👈 IMPORT KAREIN
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LostForm from "../lost/LostForm";
import FoundForm from "../found/FoundForm";
import FinderClaims from "../claims/FinderClaims";
import "./Dashboard.css"; 

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
            
      <div className="dashboard-container">
        
        {/* HEADER */}
        <header className="dashboard-header">
          <h1 className="welcome-title">Welcome, {user.displayName}! <span className="wave-emoji">👋</span></h1>
          <p className="welcome-subtitle">Manage your lost and found items effortlessly.</p>
        </header>

        {/* FORMS */}
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

        {/* CLAIMS */}
        <section className="claims-section">
          <h2 className="section-title">📋 Your Claims</h2>
          <div className="claims-full-width">
            <FinderClaims />
          </div>
        </section>

      </div>

      {/* 🔥 FOOTER ADDED HERE (Container ke bahar taaki full width rahe) */}
      <Footer />
      
    </>
  );
}