import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import "./MyClaims.css";
import toast from "react-hot-toast";

export default function MyClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchClaims = async () => {
      try {
        // ✅ Only FINALIZED claims (approved / rejected)
        const q = query(
          collection(db, "claims"),
          where("status", "!=", "pending")
        );

        const snap = await getDocs(q);
        const allClaims = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ Sirf wo claims jisme user involved ho
        const filtered = allClaims.filter(
          (c) =>
            c.claimedBy === user.uid || // user ne claim kiya
            c.finderId === user.uid     // user ke item par claim aaya
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
        {/* HEADER */}
        <div className="myclaims-header">
          <h1 className="page-title">My Claims History</h1>
          <p className="page-subtitle">
            Approved or rejected claims are shown here.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            Loading your claims...
          </div>
        )}

        {/* EMPTY */}
        {!loading && claims.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No Finalized Claims</h3>
            <p>No approved or rejected claims yet.</p>
          </div>
        )}

        {/* CLAIMS GRID */}
        <div className="claims-grid">
          {claims.map((claim) => (
            <div key={claim.id} className="claim-card">
              <div className="card-top">
                <h3 className="item-title">
                  {claim.itemTitle || "Unknown Item"}
                </h3>

                <span
                  className={`status-badge ${claim.status}`}
                >
                  <span className="status-dot"></span>
                  {claim.status.toUpperCase()}
                </span>
              </div>

              <div className="card-body">
                <p className="claim-message">
                  <span className="label">Message:</span>{" "}
                  "{claim.message || "No message"}"
                </p>

                <div className="meta-info">
                  <span className="date">
                    📅{" "}
                    {claim.createdAt?.toDate
                      ? claim.createdAt
                          .toDate()
                          .toLocaleDateString()
                      : "—"}
                  </span>

                  <span className="role-badge">
                    {claim.claimedBy === user.uid
                      ? "You claimed this item"
                      : "Your item was claimed"}
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
