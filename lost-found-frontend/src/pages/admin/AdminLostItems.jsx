import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Navbar from "../../components/common/Navbar";

export default function AdminLostItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const snap = await getDocs(collection(db, "lostItems"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(data);
      setLoading(false);
    };

    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    const ok = window.confirm("Delete this lost item?");
    if (!ok) return;

    await deleteDoc(doc(db, "lostItems", id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
        <h2>🗑 Admin — Lost Items</h2>

        {items.map(item => (
          <div key={item.id} style={card}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p><b>User:</b> {item.userId}</p>

            <button
              style={dangerBtn}
              onClick={() => deleteItem(item.id)}
            >
              ❌ Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

const card = {
  padding: 16,
  marginBottom: 16,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const dangerBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer"
};
