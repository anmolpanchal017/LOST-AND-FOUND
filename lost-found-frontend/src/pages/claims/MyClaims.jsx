import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";
import { History, Calendar, MessageSquare, CheckCircle2, XCircle, Package, Loader2, Info, User } from "lucide-react";

export default function MyClaims() {
  const { user } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchClaims = async () => {
      try {
        const q = query(
          collection(db, "claims"),
          where("status", "!=", "pending")
        );

        const snap = await getDocs(q);
        const allClaims = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = allClaims.filter(
          (c) =>
            c.claimedBy === user.uid || 
            c.finderId === user.uid     
        );

        setClaims(filtered);
      } catch (err) {
        console.error("CLAIMS FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />

      <main className="flex-grow container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <History size={22} />
              </div>
              <span className="text-blue-600 font-bold text-sm uppercase tracking-wider underline-offset-4 decoration-blue-200 decoration-2">Activity History</span>
            </div>
            <h1 className="text-4xl font-bold font-serif text-slate-900 tracking-tight">My Claims History</h1>
            <p className="text-slate-500 mt-2">View all your resolved claim requests in one place.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="text-lg font-medium tracking-wide">Retrieving history...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="p-5 bg-slate-50 rounded-full text-slate-300 mb-6 ring-8 ring-slate-50/50">
              <History size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">No Finalized Claims</h3>
            <p className="text-slate-500 max-w-md mt-2">You don't have any approved or rejected claims yet. Keep an eye on your dashboard for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all h-fit animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100 shadow-sm">
                      <Package size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                        {claim.itemTitle || "Unknown Item"}
                      </h4>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <Calendar size={14} />
                        {claim.createdAt?.toDate
                          ? claim.createdAt.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                          : "Unknown date"}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm
                    ${claim.status === 'approved' 
                      ? 'bg-green-100 text-green-700 ring-1 ring-green-600/10' 
                      : 'bg-red-50 text-red-600 ring-1 ring-red-500/10'}`}>
                    {claim.status === 'approved' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {claim.status}
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 mb-6 relative border border-slate-100/50">
                  <MessageSquare className="absolute -top-3 -left-3 text-slate-200 bg-white rounded-full p-0.5 border border-slate-100 shadow-sm" size={24} />
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{claim.message || "No additional message provided."}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/50 text-slate-600 rounded-lg text-xs font-bold ring-1 ring-slate-200/50">
                    <User size={14} />
                    {claim.claimedBy === user.uid ? "Claimer" : "Finder"}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 italic">
                    {claim.claimedBy === user.uid
                      ? "You requested this item"
                      : "Requested for your item"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
