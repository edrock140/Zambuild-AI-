import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0659775712",
  appId: "1:4044972505:web:9cc99662aa648f502139c8",
  apiKey: "AIzaSyDIw2BMe4M7qgLoA1ysKc5fc7RF3mqwoyc",
  authDomain: "gen-lang-client-0659775712.firebaseapp.com",
  storageBucket: "gen-lang-client-0659775712.firebasestorage.app",
  messagingSenderId: "4044972505",
  measurementId: "",
  oAuthClientId:
    "4044972505-huirmsrkagjlqj6bakd086nn984ajb42.apps.googleusercontent.com",
  recaptchaSiteKey: "",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const saveUserToDb = async (user: any) => {
  if (!user?.digitalId) return;
  const userRef = doc(db, "users", user.digitalId);
  await setDoc(userRef, user, { merge: true });
};

export const getUserFromDb = async (digitalId: string) => {
  const userRef = doc(db, "users", digitalId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
};

export const updateUserScore = async (digitalId: string, score: number) => {
  const userRef = doc(db, "users", digitalId);
  await setDoc(userRef, { score }, { merge: true });
};

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://mail.google.com/");
