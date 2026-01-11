import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  // Route change pe search clear
  useEffect(() => {
    setSearchTerm("");
  }, [location.pathname, setSearchTerm]);

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const links = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "Lost Items", path: "/lost-items", icon: "📸" },
    { label: "Found Items", path: "/found-items", icon: "✅" },
    { label: "My Claims", path: "/my-claims", icon: "📋" },
    { label: "Notifications", path: "/notifications", icon: "🔔" },
  ];

  return (
    <header className="header">
      <nav className="navbar">

        {/* LOGO */}
        <div className="logo-section" onClick={() => navigate("/dashboard")}>
          <div className="logo-text">LOST & FOUND</div>
        </div>

        {/* NAV LINKS */}
        <div className="nav-links">
          {links.map((item) => (
            <button
              key={item.path}
              className={`nav-btn ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* 🔍 SEARCH — ALWAYS VISIBLE */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search lost or found items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* LOGOUT */}
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
}
