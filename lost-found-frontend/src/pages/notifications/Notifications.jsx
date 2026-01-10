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


export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchNotifications();
  }, [user.uid]);

  return (
  <>
    <Navbar />

    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">
        Notifications
      </h2>

      {notifications.length === 0 && (
        <p className="text-gray-500">
          No notifications yet.
        </p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-4 rounded shadow ${
            n.read ? "bg-gray-100" : "bg-white"
          }`}
        >
          <p className="font-semibold">{n.title}</p>
          <p className="text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  </>
);

}
