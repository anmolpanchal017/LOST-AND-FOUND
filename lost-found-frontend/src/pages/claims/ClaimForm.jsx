import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
 import { sendNotification } from "../../utils/notify";

export default function ClaimForm({ foundItem, onClose }) {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "claims"), {
        foundItemId: foundItem.id,
        claimedBy: user.uid,
        finderId: foundItem.userId,
        message,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      await sendNotification({
  userId: foundItem.userId, // finder
  title: "New Claim Received",
  message: "Someone has claimed an item you found.",
});


      alert("Claim request sent ✅");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Claim failed ❌");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        background: "white",
        padding: 20,
        width: 400,
        borderRadius: 8,
      }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: 10 }}>
        Claim This Item
      </h2>

      <p style={{ fontSize: 14, marginBottom: 10 }}>
        Item: <b>{foundItem.title}</b>
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explain why this item belongs to you"
          required
          style={{
            width: "100%",
            height: 100,
            border: "1px solid #ccc",
            padding: 8,
          }}
        />

        <div style={{ marginTop: 15, textAlign: "right" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              marginRight: 10,
              padding: "6px 12px",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "6px 12px",
              background: "green",
              color: "white",
            }}
          >
            {loading ? "Sending..." : "Submit Claim"}
          </button>
        </div>
      </form>
    </div>
  );
}
