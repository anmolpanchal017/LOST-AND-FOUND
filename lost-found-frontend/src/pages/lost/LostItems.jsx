import { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection, getDocs, addDoc, serverTimestamp, orderBy, query,
} from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import { searchFilter } from "../../utils/searchFilter";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ✅ Import CSS
import "./LostItems.css";

export default function LostItems() {
  const { user } = useContext(AuthContext);
  const { searchTerm } = useContext(SearchContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH LOST ITEMS
  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const q = query(
          collection(db, "lostItems"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const activeItems = data.filter((item) => item.isResolved !== true);
        setItems(activeItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to load lost items");
      } finally {
        setLoading(false);
      }
    };
    fetchLostItems();
  }, []);

  const filteredItems = searchFilter(items, searchTerm);

  // CLAIM (FOUND IT)
  const handleClaim = async (e, item) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to claim items!");
      return;
    }

    const toastId = toast.loading("Sending notification...");

    try {
      await addDoc(collection(db, "claims"), {
        itemId: item.id,
        itemTitle: item.title,
        category: item.category,
        finderId: item.userId, // Jiska item khoya hai (Owner)
        claimedBy: user.uid,   // Jisne dhunda (Finder)
        message: "I found this item and want to return it.",
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent to owner! ✅", { id: toastId });
    } catch (error) {
      console.error("Error sending claim:", error);
      toast.error("Failed to send request", { id: toastId });
    }
  };

  return (
    <>
      <Navbar />

      <div className="lost-page-container">
        <h2 className="page-title">🔍 Lost Items</h2>

        {loading && <p className="status-text">Loading lost items...</p>}

        {!loading && filteredItems.length === 0 && (
          <p className="status-text">No matching lost items found.</p>
        )}

        <div className="lost-items-grid">
          {filteredItems.map((item) => (
            
            <div
              key={item.id}
              className="lost-card"
              onClick={() => navigate(`/item/lost/${item.id}`)}
            >
              {/* Image */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="card-image"
                />
              )}

              {/* Content */}
              <div className="card-content">
                <h3>{item.title}</h3>
                <p><strong>Category:</strong> {item.category}</p>
                <p>{item.description}</p>

                {item.locationText && <p>📍 {item.locationText}</p>}
                {item.phone && <p>📞 {item.phone}</p>}

                {item.date && (
                  <p className="card-date">Lost on: {item.date}</p>
                )}

                {/* Claim Button */}
                {item.userId !== user?.uid && (
                  <button
                    className="claim-btn"
                    onClick={(e) => handleClaim(e, item)}
                  >
                    I Found This!
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}