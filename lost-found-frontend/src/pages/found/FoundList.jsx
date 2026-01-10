import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ClaimForm from "../claims/ClaimForm";

export default function FoundList() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const snap = await getDocs(collection(db, "foundItems"));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
    };
    fetchItems();
  }, []);

  return (
    <>
      <div className="space-y-4 mt-10">
        <h2 className="text-xl font-bold">Found Items</h2>

        {items.map(item => (
          <div key={item.id} className="border p-4 rounded bg-white">
            <h3 className="font-semibold">{item.title}</h3>
            <p>{item.description}</p>

            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt="item"
                className="h-24 mt-2 rounded"
              />
            )}

            {/* ✅ CLAIM BUTTON */}
            {item.userId !== user.uid && (
              <button
                onClick={() => {
                  console.log("CLAIM CLICKED FOR:", item.id);
                  setSelectedItem(item);
                }}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Claim This Item
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ✅ MODAL */}
      {selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <ClaimForm
            foundItem={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      )}
    </>
  );
}
