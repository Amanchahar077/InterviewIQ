import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-d3852.firebaseapp.com",
  projectId: "interviewiq-d3852",
  storageBucket: "interviewiq-d3852.firebasestorage.app",
  messagingSenderId: "319791328756",
  appId: "1:319791328756:web:9cebc4ec44b926095d1da1",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
