import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react"; // useState import kiya
import { SearchContext } from "../../context/SearchContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  
  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Route change pe search clear aur Menu close
  useEffect(() => {
    setSearchTerm("");
    setIsMenuOpen(false); // Page change hone par menu band ho jaye
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

        {/* DESKTOP NAV LINKS (Hidden on Mobile) */}
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

        {/* RIGHT SECTION (Search + Logout for Desktop) */}
        <div className="right-section desktop-only">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>

        {/* HAMBURGER ICON (Visible only on Mobile) */}
        <button 
          className={`hamburger ${isMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* MOBILE MENU DROPDOWN */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
           {/* Mobile Search */}
           <div className="mobile-search">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {links.map((item) => (
            <button
              key={item.path}
              className={`nav-btn mobile-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
            </button>
          ))}
          
          <button className="logout mobile-logout" onClick={logout}>
            Logout
          </button>
        </div>

      </nav>
    </header>
  );
}