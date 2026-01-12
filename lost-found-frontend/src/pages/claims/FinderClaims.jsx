import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import "./FinderClaims.css";
import toast from "react-hot-toast";

export default function FinderClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchIncomingClaims = async () => {
      try {
        const q = query(
          collection(db, "claims"),
          where("finderId", "==", user.uid),
          where("status", "==", "pending")
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setClaims(data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomingClaims();
  }, [user]);

  // -----------------------------
  // APPROVE / REJECT (FINAL FIX)
  // -----------------------------
  const handleStatus = async (claimId, newStatus, itemId) => {
    try {
      // 1️⃣ Update claim status
      await updateDoc(doc(db, "claims", claimId), {
        status: newStatus,
      });

      // 2️⃣ If approved → mark item as resolved
      if (newStatus === "approved") {
        // Try both collections safely
        try {
          await updateDoc(doc(db, "lostItems", itemId), {
            isResolved: true,
          });
        } catch {}

        try {
          await updateDoc(doc(db, "foundItems", itemId), {
            isResolved: true,
          });
        } catch {}
      }

      // 3️⃣ Remove claim from UI
      setClaims((prev) =>
        prev.filter((claim) => claim.id !== claimId)
      );
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="loading-text">Loading requests...</div>;
  }

  return (
    <div className="finder-claims-container">
      {claims.length === 0 ? (
        <div className="no-claims">
          <p>No pending claims on your items.</p>
        </div>
      ) : (
        <div className="claims-list">
          {claims.map((claim) => (
            <div key={claim.id} className="request-card">
              <div className="req-header">
                <div className="req-info">
                  <span className="item-label">
                    Item Requested:
                  </span>
                  <span className="item-name">
                    📦 {claim.itemTitle || "Unknown Item"}
                  </span>
                </div>
                <span className="req-date">
                  {claim.createdAt?.toDate
                    ? claim.createdAt
                        .toDate()
                        .toLocaleDateString()
                    : "Today"}
                </span>
              </div>

              <div className="req-body">
                <p className="claim-message">
                  <strong>Message from Claimer:</strong>
                  <br />
                  "{claim.message}"
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="action-buttons">
                <button
                  className="btn-approve"
                  onClick={() =>
                    handleStatus(
                      claim.id,
                      "approved",
                      claim.itemId   // 🔥 IMPORTANT
                    )
                  }
                >
                  ✅ Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() =>
                    handleStatus(
                      claim.id,
                      "rejected",
                      claim.itemId
                    )
                  }
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
