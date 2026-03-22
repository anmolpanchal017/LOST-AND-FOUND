import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import { ArrowLeft, MapPin, Phone, Calendar, Tag, ShieldCheck, Loader2, Package, Info } from "lucide-react";

export default function ItemDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="p-5 bg-white shadow-xl rounded-full text-slate-300 mb-6">
          <Info size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Item Not Found</h2>
        <p className="text-slate-500 mt-2">The item you're looking for might have been removed or resolved.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    );
  }

  const isLost = type === "lost";
  const themeColor = isLost ? "orange" : "green";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24 pb-12">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 transition-transform group-hover:-translate-x-1">
            <ArrowLeft size={16} />
          </div>
          Back to list
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          {/* IMAGE SECTION */}
          <div className="md:w-1/2 relative bg-slate-100 flex items-center justify-center p-4">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover max-h-[500px] md:max-h-none rounded-3xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-slate-300 py-24">
                <Package size={80} strokeWidth={1} />
                <p className="font-medium">No image available</p>
              </div>
            )}
            
            <div className={`absolute top-6 left-6 px-4 py-1.5 backdrop-blur-md shadow-lg rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ring-1
              ${isLost 
                ? "bg-orange-500/90 text-white ring-orange-400/20" 
                : "bg-green-600/90 text-white ring-green-500/20"}`}>
              {type} REPORT
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ring-1
                  ${isLost ? "text-orange-600 bg-orange-50 ring-orange-200/50" : "text-green-600 bg-green-50 ring-green-200/50"}`}>
                  {item.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-blue-400" />
                  Verified Report
                </span>
              </div>
              <h1 className="text-4xl font-bold font-serif text-slate-900 leading-tight mb-4 tracking-tight">
                {item.title}
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 border-slate-100 pl-6 py-1">
                "{item.description}"
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-10">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location</p>
                  <p className="text-slate-800 font-bold">{item.locationText || "Location not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm">
                  <Calendar size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {isLost ? "Lost on" : "Found on"}
                  </p>
                  <p className="text-slate-800 font-bold">{item.date || "Date not specified"}</p>
                </div>
              </div>

              {item.phone && (
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all shadow-sm">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contact Details</p>
                    <p className="text-slate-800 font-bold">{item.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {item.userId !== item.currentUserId && (
              <button className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]
                ${isLost 
                  ? "bg-orange-600 hover:bg-orange-700 shadow-orange-200/50" 
                  : "bg-green-600 hover:bg-green-700 shadow-green-200/50"}`}>
                {isLost ? "I Found This Item" : "This is my item"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
