import { useState, useEffect, useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { 
  Home, 
  Camera, 
  CheckCircle, 
  ClipboardList, 
  Bell, 
  Search, 
  LogOut, 
  Menu, 
  X,
  PackageSearch
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearchTerm("");
    setIsMenuOpen(false);
  }, [location.pathname, setSearchTerm]);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Lost Items", path: "/lost-items", icon: Camera },
    { label: "Found Items", path: "/found-items", icon: CheckCircle },
    { label: "My Claims", path: "/my-claims", icon: ClipboardList },
    { label: "Notifications", path: "/notifications", icon: Bell },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}>
      <nav className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 rounded-2xl transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-white/50 backdrop-blur-md"}`}>
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/dashboard")}
          >
            <div className="p-2 bg-primary rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <PackageSearch size={24} />
            </div>
            <span className="text-xl font-bold font-serif tracking-tight text-slate-800">
              LOST<span className="text-primary">&</span>FOUND
            </span>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <button
                key={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  location.pathname === item.path 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          {/* RIGHT SECTION (Search + Logout) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 bg-slate-100/50 border-transparent border focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all w-48 focus:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium border border-transparent hover:border-red-100"
              onClick={logout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen pb-6" : "max-h-0"}`}>
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 mt-2">
            {/* Mobile Search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {navLinks.map((item) => (
              <button
                key={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === item.path 
                    ? "bg-primary text-white" 
                    : "text-slate-600 active:bg-slate-100"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            
            <button 
              className="flex items-center gap-3 px-4 py-3 text-red-500 active:bg-red-50 rounded-xl transition-colors font-medium mt-2"
              onClick={logout}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}