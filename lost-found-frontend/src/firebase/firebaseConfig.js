// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ YE LINE MISSING THI
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHOPW9UoX8fO4opCNfpp1InhWkGp6CYtM",
  authDomain: "lost-and-found-1de84.firebaseapp.com",
  projectId: "lost-and-found-1de84",
  storageBucket: "lost-and-found-1de84.firebasestorage.app",
  messagingSenderId: "282077694748",
  appId: "1:282077694748:web:3d67973edf7f5ee5bfc8d9",
  measurementId: "G-BSMRQD4EZD"
};




const app = initializeApp(firebaseConfig);

// ✅ ab getAuth defined hai
export const auth = getAuth(app);
export const db = getFirestore(app);
