import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendNotification } from "../../utils/notify";

export default function ClaimForm({ foundItem, onClose }) {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert("Please enter a message explaining why this belongs to you.");
      return;
    }

    setLoading(true);

    try {
      // ✅ 1. SAVE CLAIM TO FIRESTORE (With Correct Logic)
      await addDoc(collection(db, "claims"), {
        userId: user.uid,              // Claimer (Main)
        finderId: foundItem.userId,    // 🔥 CRITICAL FIX: Finder ki ID (Jisko request jayegi)
        
        itemTitle: foundItem.title || "Unknown Item",
        itemId: foundItem.id,          // Found Item ka reference ID
        
        message: message,
        status: "pending",             // Initial Status
        createdAt: serverTimestamp(),
      });

      // ✅ 2. SEND NOTIFICATION (Optional Helper)
      if (foundItem.userId) {
        await sendNotification({
          userId: foundItem.userId,
          title: "New Claim Request",
          message: `Someone claimed: ${foundItem.title || "an item"}. Check your dashboard.`,
        });
      }

      alert("Claim request sent successfully! ✅");
      onClose(); // Modal band karo
    } catch (error) {
      console.error("CLAIM ERROR:", error);
      alert("Failed to send claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Wrapper div se inline styles hata diye hain taaki CSS handle kare
    <div className="claim-form-content">
      
      <h2>Claim This Item</h2>
      
      <p>
        Item: <strong>{foundItem.title}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explain detailed proof of ownership (e.g., color, unique marks, contents)..."
          required
          rows="4"
        />

        {/* Buttons: CSS 'order' property se ye upar-neeche set honge */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Sending Request..." : "Submit Claim"}
          </button>
          
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}