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
import { MapPin, Phone, Calendar, Tag, Package, Loader2, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />

      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Package size={22} />
              </div>
              <span className="text-green-600 font-bold text-sm uppercase tracking-wider">Community Found</span>
            </div>
            <h1 className="text-4xl font-bold font-serif text-slate-900 tracking-tight">Found Items</h1>
            <p className="text-slate-500 mt-2">Browse items found by our helpful community members.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="text-lg font-medium">Scanning for items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Package size={64} className="text-slate-200 mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">No Items Found</h3>
            <p className="text-slate-500 max-w-md mt-2">
              {searchTerm 
                ? `We couldn't find any found items matching "${searchTerm}". Try a different term.`
                : "No found items currently listed. Check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer"
                onClick={() => navigate(`/item/found/${item.id}`)}
              >
                {/* IMAGE AREA */}
                <div className="relative h-48 overflow-hidden bg-slate-100 italic flex items-center justify-center text-slate-400 text-sm p-4 text-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Tag size={32} strokeWidth={1.5} />
                      <p>No image provided</p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold text-green-600 uppercase tracking-widest ring-1 ring-green-500/10">
                    {item.category}
                  </div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow italic">"{item.description}"</p>
                  
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                      <MapPin size={16} className="text-slate-400" />
                      <span className="truncate">{item.locationText || "Multiple locations"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                      <Calendar size={16} className="text-slate-400" />
                      <span>{item.date || "Unknown date"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="flex-grow flex items-center justify-center gap-2 py-3 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all"
                      onClick={(e) => handleClaim(e, item)}
                    >
                      Claim This Item
                    </button>
                    <button className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}