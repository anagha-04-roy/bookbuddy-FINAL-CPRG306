import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBMxL7BCwvaJ1T0BVECv5NdBBi5RsXIv18",
  authDomain: "bookbuddy-f5a06.firebaseapp.com",
  projectId: "bookbuddy-f5a06",
  storageBucket: "bookbuddy-f5a06.firebasestorage.app",
  messagingSenderId: "436125830885",
  appId: "1:436125830885:web:3c63e03679b676d6084e0c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);