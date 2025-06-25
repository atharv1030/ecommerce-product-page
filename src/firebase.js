// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 

const firebaseConfig = {
  apiKey: "AIzaSyAdDZyRpFpflfEghnEB7hZp2lxMZ-NklBg",
  authDomain: "ecom-63e18.firebaseapp.com",
  projectId: "ecom-63e18",
  storageBucket: "ecom-63e18.firebasestorage.app",
  messagingSenderId: "204751525576",
  appId: "1:204751525576:web:6b63c96029a27051f4f7fd",
  measurementId: "G-MFW222K2QV"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
