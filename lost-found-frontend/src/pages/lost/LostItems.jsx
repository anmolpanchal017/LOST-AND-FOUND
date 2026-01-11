import { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import { searchFilter } from "../../utils/searchFilter";
import { useNavigate } from "react-router-dom";

export default function LostItems() {
  const { user } = useContext(AuthContext);
  const { searchTerm } = useContext(SearchContext);
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH LOST ITEMS
  useEffect(() => {
    const fetchLostItems = async () => {
      const q = query(
        collection(db, "lostItems"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const activeItems = data.filter(
        (item) => item.isResolved !== true
      );

      setItems(activeItems);
      setLoading(false);
    };

    fetchLostItems();
  }, []);

  const filteredItems = searchFilter(items, searchTerm);

  // CLAIM LOST ITEM
  const handleClaim = async (item) => {
    await addDoc(collection(db, "claims"), {
      itemId: item.id,
      itemTitle: item.title,
      category: item.category,
      finderId: item.userId,
      claimedBy: user.uid,
      message: "I believe this lost item belongs to me.",
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Claim request sent ✅");
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 600, margin: "auto", padding: 16 }}>
        <h2>🔍 Lost Items</h2>

        {loading && <p>Loading...</p>}

        {!loading && filteredItems.length === 0 && (
          <p>No matching lost items.</p>
        )}

        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/item/lost/${item.id}`)}
            style={{
              background: "#fff",
              marginBottom: 24,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{
                  width: "100%",
                  height: 280,
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ padding: 12 }}>
              <h3>{item.title}</h3>
              <p><b>Category:</b> {item.category}</p>
              <p>{item.description}</p>

              {item.locationText && <p>📍 {item.locationText}</p>}
              {item.phone && <p>📞 {item.phone}</p>}

              {item.date && (
                <p style={{ fontSize: 12, color: "#666" }}>
                  Lost on: {item.date}
                </p>
              )}

              {item.userId !== user?.uid && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 VERY IMPORTANT
                    handleClaim(item);
                  }}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    padding: 10,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Claim This Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
