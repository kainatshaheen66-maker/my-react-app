import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC03_HqBzfKjeidvQ81N5bdpxhc_d__5xY",
  authDomain: "quickmart-2e3ae.firebaseapp.com",
  projectId: "quickmart-2e3ae",
  storageBucket: "quickmart-2e3ae.appspot.com",
  messagingSenderId: "593021551702",
  appId: "1:593021551702:web:00879003bfdaed8bc627f7",
  measurementId: "G-3B7Y9919B7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const analytics = getAnalytics(app);