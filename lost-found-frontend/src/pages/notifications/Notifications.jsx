import { useEffect, useState, useContext } from "react";
import { 
  collection, query, where, orderBy, onSnapshot, 
  updateDoc, doc, deleteDoc, writeBatch 
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import "./Notifications.css";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Query: Get notifications for current user, ordered by time
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

  // ✅ Mark Single as Read
  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "notifications", id), { isRead: true });
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  // ✅ Delete Notification
  const deleteNotification = async (e, id) => {
    e.stopPropagation(); // Card click hone se rokne ke liye
    if (window.confirm("Delete this notification?")) {
      await deleteDoc(doc(db, "notifications", id));
    }
  };

  // ✅ Mark ALL as Read (Batch Write)
  const markAllRead = async () => {
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.isRead) {
        const ref = doc(db, "notifications", n.id);
        batch.update(ref, { isRead: true });
      }
    });
    await batch.commit();
  };

  if (loading) return <div className="notif-loading">Loading updates...</div>;

  return (
    <div className="notifications-container">
      
      {/* Header Section */}
      <div className="notif-header">
        <h1 className="notifications-title">🔔 Notifications</h1>
        {notifications.length > 0 && (
          <button className="mark-all-btn" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔕</span>
          <p>No new notifications</p>
        </div>
      )}

      {/* List */}
      <div className="notif-list">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-card ${n.isRead ? "read" : "unread"}`}
            onClick={() => !n.isRead && markAsRead(n.id)}
          >
            <div className="notif-icon">
              {n.isRead ? "📩" : "qh"} {/* Icon change based on status */}
            </div>

            <div className="notification-content">
              <h3>{n.title}</h3>
              <p>{n.message}</p>
              <span className="time-ago">
                {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : "Just now"}
              </span>
            </div>

            {/* Actions (Dot or Delete) */}
            <div className="notif-actions">
              {!n.isRead && <span className="glow-dot" title="Unread"></span>}
              <button 
                className="delete-btn" 
                onClick={(e) => deleteNotification(e, n.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}