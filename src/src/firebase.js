import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYwK-Py9LJWncgQPaY93eMrEposDtdLhM",
  authDomain: "yourprice-app.firebaseapp.com",
  projectId: "yourprice-app",
  storageBucket: "yourprice-app.firebasestorage.app",
  messagingSenderId: "975464969793",
  appId: "1:975464969793:web:b2df5426deb0275cf378c0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
