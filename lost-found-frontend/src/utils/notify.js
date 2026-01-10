import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const sendNotification = async ({
  userId,
  title,
  message,
}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      read: false,
      createdAt: Timestamp.now(),
    });
  } catch (err) {
    console.error("Notification error:", err);
  }
};
