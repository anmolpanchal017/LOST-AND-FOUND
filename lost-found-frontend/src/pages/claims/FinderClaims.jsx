import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Calendar, MessageSquare, CheckCircle2, XCircle, Package, Loader2, Info } from "lucide-react";

export default function FinderClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchIncomingClaims = async () => {
      try {
        const q = query(
          collection(db, "claims"),
          where("finderId", "==", user.uid),
          where("status", "==", "pending")
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setClaims(data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomingClaims();
  }, [user]);

  const handleStatus = async (claimId, newStatus, itemId) => {
    try {
      await updateDoc(doc(db, "claims", claimId), {
        status: newStatus,
      });

      if (newStatus === "approved") {
        try {
          await updateDoc(doc(db, "lostItems", itemId), {
            isResolved: true,
          });
        } catch {}

        try {
          await updateDoc(doc(db, "foundItems", itemId), {
            isResolved: true,
          });
        } catch {}
      }

      setClaims((prev) =>
        prev.filter((claim) => claim.id !== claimId)
      );
      toast.success(`Claim ${newStatus} successfully`);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <span className="font-medium">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {claims.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="p-3 bg-white rounded-full shadow-sm text-slate-300 mb-4">
            <Info size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Pending Requests</h3>
          <p className="text-slate-500 max-w-xs mt-1">You don't have any pending claims on your listed items right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-none mb-1">
                      {claim.itemTitle || "Unknown Item"}
                    </h4>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Item Requested
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Calendar size={14} />
                  {claim.createdAt?.toDate
                    ? claim.createdAt.toDate().toLocaleDateString()
                    : "Today"}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 relative">
                <MessageSquare className="absolute -top-2 -left-2 text-slate-200 bg-white rounded-full p-0.5" size={20} />
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{claim.message}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <button
                  className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-100"
                  onClick={() => handleStatus(claim.id, "approved", claim.itemId)}
                >
                  <CheckCircle2 size={18} />
                  Approve
                </button>
                <button
                  className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-[0.98] transition-all"
                  onClick={() => handleStatus(claim.id, "rejected", claim.itemId)}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
