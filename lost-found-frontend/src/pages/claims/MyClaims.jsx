import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../../components/common/Navbar"; // Ensure Navbar is included
import "./MyClaims.css";

export default function MyClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchClaims = async () => {
      try {
        const snap = await getDocs(collection(db, "claims"));
        const allClaims = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter: Show claims where user is either the Requester or the Finder
        const filtered = allClaims.filter(
          (c) =>
            c.userId === user.uid ||
            c.claimerId === user.uid ||
            c.claimedBy === user.uid
        );

        setClaims(filtered);
      } catch (err) {
        console.error("CLAIMS FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user]);

  return (
    <>
      <Navbar />
      
      <div className="myclaims-container">
        
        {/* Header Section */}
        <div className="myclaims-header">
          <h1 className="page-title">My Claims History</h1>
          <p className="page-subtitle">Track the status of items you have claimed or reported.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div> Loading your claims...
          </div>
        )}

        {/* Empty State */}
        {!loading && claims.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No Claims Found</h3>
            <p>You haven't submitted or received any claims yet.</p>
          </div>
        )}

        {/* Claims List Grid */}
        <div className="claims-grid">
          {claims.map((claim) => (
            <div key={claim.id} className="claim-card">
              
              <div className="card-top">
                <h3 className="item-title">{claim.itemTitle || "Unknown Item"}</h3>
                <span className={`status-badge ${claim.status || "pending"}`}>
                  <span className="status-dot"></span>
                  {claim.status || "PENDING"}
                </span>
              </div>

              <div className="card-body">
                <p className="claim-message">
                  <span className="label">Message:</span> "{claim.message}"
                </p>
                
                <div className="meta-info">
                  <span className="date">
                    📅 {claim.createdAt?.toDate ? claim.createdAt.toDate().toLocaleDateString() : "Just now"}
                  </span>
                  <span className="role-badge">
                    {claim.userId === user.uid ? "You found this" : "You claimed this"}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </>
  );
}