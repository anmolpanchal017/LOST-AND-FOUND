import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";

export default function ItemDetail() {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const ref = doc(
          db,
          type === "lost" ? "lostItems" : "foundItems",
          id
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {
          setItem(snap.data());
        }
      } catch (err) {
        console.error("ITEM FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, type]);

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Item not found</p>;

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
        )}

        <h2 style={{ marginTop: 16 }}>{item.title}</h2>

        <p><b>Category:</b> {item.category}</p>
        <p>{item.description}</p>

        {item.locationText && <p>📍 {item.locationText}</p>}
        {item.phone && <p>📞 {item.phone}</p>}

        {item.date && (
          <p style={{ fontSize: 13, color: "#666" }}>
            {type === "lost" ? "Lost on:" : "Found on:"} {item.date}
          </p>
        )}
      </div>
    </>
  );
}
