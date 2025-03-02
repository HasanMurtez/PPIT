import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDReys_Ohf0zL1MngFgDWXmm3QVdSqKGdE",
  authDomain: "carbuysell-709ad.firebaseapp.com",
  projectId: "carbuysell-709ad",
  storageBucket: "carbuysell-709ad.firebasestorage.app",
  messagingSenderId: "498198979275",
  appId: "1:498198979275:web:381743462002127b10714e",
  measurementId: "G-3M24WVZCED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, };