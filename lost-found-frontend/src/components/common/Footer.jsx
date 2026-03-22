import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-left">
          <h3>Lost & Found</h3>
          <p>Helping people reconnect with their belongings.</p>
        </div>

        {/* CENTER */}
        <div className="footer-center">
          <a href="/dashboard">Dashboard</a>
          <a href="/my-claims">My Claims</a>
          <a href="/notifications">Notifications</a>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <p>© {new Date().getFullYear()} Lost & Found</p>
          <span>Built with ❤️ using Firebase</span>
        </div>
      </div>
    </footer>
  );
}
