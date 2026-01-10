import { auth } from "../firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export const googleLogin = () => {
  return signInWithPopup(auth, provider);
};

export const emailLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
