import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"; // For mobile menu

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // Placeholder: Implement search logic
      console.log("Search:", e.target.value);
    }
  };

  const links = [
    { label: "Dashboard", path: "/dashboard", icon: "🏠" },
    { label: "My Claims", path: "/my-claims", icon: "📋" },
    { label: "Notifications", path: "/notifications", icon: "🔔" },
  ];

  return (
    <header className="header">
      <div className="navbar-wrapper">
        <nav className="navbar">
          {/* LOGO SECTION */}
          <div className="logo-section" onClick={() => navigate("/dashboard")}>
            <div className="logo-icon">L</div> {/* Icon placeholder */}
            <div className="logo-text">
              LOST <span>&</span> FOUND
            </div>
          </div>

          {/* NAV LINKS (Desktop) */}
          <div className="nav-links">
            {links.map((item) => (
              <button
                key={item.path}
                className={`nav-btn ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
                aria-current={location.pathname === item.path ? "page" : undefined}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>

          {/* RIGHT SECTION */}
          <div className="right-section">
            <div className="search-container">
              <input
                type="text"
                className="search"
                placeholder="Search"
                onKeyDown={handleSearch}
                aria-label="Search"
              />
            </div>
            <button className="logout" onClick={logout} aria-label="Logout">
              Logout
            </button>
          </div>

          {/* HAMBURGER MENU (Mobile) */}
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* MOBILE MENU DROPDOWN */}
          {isMenuOpen && (
            <div className="mobile-menu">
              {links.map((item) => (
                <button
                  key={item.path}
                  className={`nav-btn ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}