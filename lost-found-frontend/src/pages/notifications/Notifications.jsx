import { useEffect, useState, useContext } from "react";
import { 
  collection, query, where, orderBy, onSnapshot, 
  updateDoc, doc, deleteDoc, writeBatch 
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/common/Navbar";
import { Bell, BellOff, CheckCheck, Trash2, Mail, MailOpen, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "notifications", id), { isRead: true });
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "notifications", id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    
    const batch = writeBatch(db);
    unread.forEach((n) => {
      const ref = doc(db, "notifications", n.id);
      batch.update(ref, { isRead: true });
    });
    
    try {
      await batch.commit();
      toast.success("All marked as read");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-24 items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-slate-500 font-medium">Checking for updates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />

      <main className="flex-grow container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-sm">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">Notifications</h1>
              <p className="text-slate-500 text-sm">Stay updated on your item reports and claims.</p>
            </div>
          </div>
          
          {notifications.length > 0 && (
            <button 
              onClick={markAllRead}
              className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all"
            >
              <CheckCheck size={16} className="text-primary" />
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="p-5 bg-slate-50 rounded-full text-slate-300 mb-6 ring-8 ring-slate-50/50">
              <BellOff size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">All Clear!</h3>
            <p className="text-slate-500 max-w-sm mt-2">No new notifications at the moment. We'll alert you when someone interacts with your items.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={`group relative bg-white border rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 cursor-pointer overflow-hidden
                  ${n.isRead 
                    ? "border-slate-100 opacity-75 hover:opacity-100" 
                    : "border-primary/20 shadow-lg shadow-primary/5 bg-gradient-to-r from-white to-primary/5"}`}
              >
                {!n.isRead && <div className="absolute top-0 left-0 w-1 h-full bg-primary" />}
                
                <div className={`p-3 rounded-xl shadow-sm
                  ${n.isRead ? "bg-slate-50 text-slate-400" : "bg-primary text-white"}`}>
                  {n.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-bold truncate tracking-tight
                      ${n.isRead ? "text-slate-600" : "text-slate-900 text-lg"}`}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0 bg-slate-50 px-2 py-1 rounded-md">
                      <Calendar size={12} />
                      {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed
                    ${n.isRead ? "text-slate-500" : "text-slate-700 font-medium"}`}>
                    {n.message}
                  </p>
                </div>

                <button 
                  onClick={(e) => deleteNotification(e, n.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}