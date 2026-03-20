import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBp_4KYIJZuob1FZl-YshcsnjludFgYue4",
  authDomain: "news-blog-6e56e.firebaseapp.com",
  databaseURL: "https://news-blog-6e56e-default-rtdb.firebaseio.com",
  projectId: "news-blog-6e56e",
  storageBucket: "news-blog-6e56e.firebasestorage.app",
  messagingSenderId: "101056660603",
  appId: "1:101056660603:web:250baa912f7cb18d90cede",
  measurementId: "G-VWB6GN7R2R"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos Auth y DB para poder usarlos en otras partes del proyecto (Login, Noticias, etc.)
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };