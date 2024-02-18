// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA-Gm5sQK7lXrVhaSzaJ3yNQlg0d7gqb2o",
  authDomain: "ethicshield-d6166.firebaseapp.com",
  projectId: "ethicshield-d6166",
  storageBucket: "ethicshield-d6166.appspot.com",
  messagingSenderId: "79904135948",
  appId: "1:79904135948:web:97873df8bd24ffad99c729"
};
// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default firebase_app;