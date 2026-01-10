import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { sendNotification } from "../../utils/notify";


export default function FinderClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    const q = query(
      collection(db, "claims"),
      where("finderId", "==", user.uid)
    );
    const snap = await getDocs(q);
    setClaims(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateStatus = async (claim, status) => {
  await updateDoc(doc(db, "claims", claim.id), { status });

  await sendNotification({
    userId: claim.claimedBy,
    title: `Claim ${status}`,
    message: `Your claim has been ${status}.`,
  });

  alert(`Claim ${status} ✅`);
  fetchClaims();
};


  if (loading) return <p>Loading claims...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Claims on Your Found Items</h2>

      {claims.length === 0 && <p>No claims yet.</p>}

      {claims.map(c => (
        <div key={c.id} className="border p-4 rounded bg-white">
          <p><b>Message:</b> {c.message}</p>
          <p><b>Status:</b> {c.status}</p>

          {c.status === "pending" && (
            <div className="mt-3 flex gap-3">
              <button onClick={() => updateStatus(c, "approved")}>Approve</button>
              <button onClick={() => updateStatus(c, "rejected")}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
