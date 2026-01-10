import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import Navbar from "../../components/common/Navbar";


export default function MyClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyClaims = async () => {
      setLoading(true);

      const q = query(
        collection(db, "claims"),
        where("claimedBy", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClaims(data);
      setLoading(false);
    };

    fetchMyClaims();
  }, [user.uid]);

  if (loading) return <p>Loading your claims...</p>;

  return (
  <>
    <Navbar />

    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Claims</h2>

      {claims.length === 0 && (
        <p className="text-gray-500">No claims yet.</p>
      )}

      {claims.map((claim) => (
        <div
          key={claim.id}
          className="bg-white shadow rounded p-4"
        >
          <h3 className="font-semibold">
            {claim.title}
          </h3>

          <p className="text-sm text-gray-600">
            Status:{" "}
            <span className="font-medium">
              {claim.status}
            </span>
          </p>

          {claim.message && (
            <p className="mt-2">
              Message: {claim.message}
            </p>
          )}
        </div>
      ))}
    </div>
  </>
);
}