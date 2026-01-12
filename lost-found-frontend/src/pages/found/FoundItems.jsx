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

// ✅ Import CSS File
import "./FoundItems.css";

export default function FoundItems() {
  const { user } = useContext(AuthContext);
  const { searchTerm } = useContext(SearchContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const q = query(
          collection(db, "foundItems"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const activeItems = data.filter((item) => item.isResolved !== true);
        setItems(activeItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchFoundItems();
  }, []);

  const filteredItems = searchFilter(items, searchTerm);

  // CLAIM HANDLE
  const handleClaim = async (e, item) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to claim items!");
      return;
    }
    const toastId = toast.loading("Sending claim request...");
    try {
      await addDoc(collection(db, "claims"), {
        itemId: item.id,
        itemTitle: item.title,
        category: item.category,
        finderId: item.userId,
        claimedBy: user.uid,
        message: "This item belongs to me.",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Claim request sent! ✅", { id: toastId });
    } catch (error) {
      console.error("Claim Error:", error);
      toast.error("Failed to send claim", { id: toastId });
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Container */}
      <div className="found-page-container">
        
        <h2 className="page-title">📦 Found Items</h2>

        {loading && <p className="status-text">Loading items...</p>}

        {!loading && filteredItems.length === 0 && (
          <p className="status-text">No found items match your search.</p>
        )}

        {/* Grid Container */}
        <div className="found-items-grid">
          {filteredItems.map((item) => (
            
            <div
              key={item.id}
              className="found-card"
              onClick={() => navigate(`/item/found/${item.id}`)}
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
                  <p className="card-date">Found on: {item.date}</p>
                )}

                {/* Claim Button */}
                {item.userId !== user?.uid && (
                  <button
                    className="claim-btn"
                    onClick={(e) => handleClaim(e, item)}
                  >
                    Claim This Item
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