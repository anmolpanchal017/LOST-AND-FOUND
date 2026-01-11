import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import "./FinderClaims.css";

export default function FinderClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchIncomingClaims = async () => {
      try {
        // ✅ CORRECT LOGIC:
        // Hum wo claims dhund rahe hain jahan 'finderId' == 'Current User'
        // Matlab: "Mere items par kis kis ne claim kiya hai?"
        
        const q = query(
          collection(db, "claims"), 
          where("finderId", "==", user.uid) // Sirf Finder ko ye claims dikhenge
        );

        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setClaims(data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomingClaims();
  }, [user]);

  // Status Update Function
  const handleStatus = async (claimId, newStatus) => {
    try {
      // Optimistic UI Update
      setClaims(prev => prev.map(c => 
        c.id === claimId ? { ...c, status: newStatus } : c
      ));

      // Firebase Update
      const claimRef = doc(db, "claims", claimId);
      await updateDoc(claimRef, { status: newStatus });
      
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="loading-text">Loading requests...</div>;

  return (
    <div className="finder-claims-container">
      {claims.length === 0 ? (
        <div className="no-claims">
           <p>No claims received on your items yet.</p>
        </div>
      ) : (
        <div className="claims-list">
          {claims.map((claim) => (
            <div key={claim.id} className="request-card">
              
              <div className="req-header">
                <div className="req-info">
                  <span className="item-label">Item Requested:</span>
                  <span className="item-name">📦 {claim.itemTitle || "Unknown Item"}</span>
                </div>
                <span className="req-date">
                  {claim.createdAt?.toDate ? claim.createdAt.toDate().toLocaleDateString() : "Today"}
                </span>
              </div>

              <div className="req-body">
                <p className="claim-message">
                  <strong>Message from Claimer:</strong> <br/>
                  "{claim.message}"
                </p>
                
                <div className="req-status-row">
                  <span>Current Status:</span>
                  <span className={`status-pill ${claim.status || "pending"}`}>
                    {claim.status || "PENDING"}
                  </span>
                </div>
              </div>

              {/* ✅ SAFETY CHECK: Buttons sirf tab dikhao jab status Pending ho */}
              {claim.status === "pending" && (
                <div className="action-buttons">
                  <button 
                    className="btn-approve" 
                    onClick={() => handleStatus(claim.id, "approved")}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    className="btn-reject" 
                    onClick={() => handleStatus(claim.id, "rejected")}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

              {/* Feedback after decision */}
              {claim.status === "approved" && (
                <div className="decision-msg success">You have approved this claim. The item is marked as returned.</div>
              )}
              {claim.status === "rejected" && (
                <div className="decision-msg error">You rejected this claim.</div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}