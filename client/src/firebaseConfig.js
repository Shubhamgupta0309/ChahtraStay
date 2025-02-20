import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2xkzkyJHnXKc6CTcCwryEnZgOBx3SiKA",
  authDomain: "chhatrastay.firebaseapp.com",
  projectId: "chhatrastay",
  storageBucket: "chhatrastay.firebasestorage.app",
  messagingSenderId: "180162341575",
  appId: "1:180162341575:web:551f9677bd09b05064ace2",
  measurementId: "G-HE7DXWH16X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
