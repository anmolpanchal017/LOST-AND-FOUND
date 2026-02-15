import React from "react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* BRAND SECTION */}
        <div className="footer-brand">
          <h2 className="footer-logo">Lost & Found</h2>
          <p className="footer-tagline">Helping people reconnect with their belongings.</p>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/my-claims">My Claims</a></li>
            <li><a href="/notifications">Notifications</a></li>
          </ul>
        </div>

        {/* DEVELOPER CREDITS (Professional Highlight) */}
        <div className="footer-devs">
          <h4>Developed By</h4>
          <div className="dev-names">
            <span className="dev-badge">Anmol Panchal</span>
            <span className="dev-separator">&</span>
            <span className="dev-badge">Tanmay Rathod</span>
          </div>
          <p className="tech-stack">Built with ❤️ using Firebase</p>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="footer-bottom">
        <p>© {currentYear} Lost & Found. All rights reserved.</p>
      </div>
    </footer>
  );
}
