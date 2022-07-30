// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, child, get } from "firebase/database";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBINe1JWwdULFnBLwPpXbrnOj61QrRBcBI",
  authDomain: "cpsc-2650-final-project.firebaseapp.com",
  databaseURL: "https://cpsc-2650-final-project-default-rtdb.firebaseio.com",
  projectId: "cpsc-2650-final-project",
  storageBucket: "cpsc-2650-final-project.appspot.com",
  messagingSenderId: "974072486977",
  appId: "1:974072486977:web:e6945868bd81b110883ac0",
  measurementId: "G-XSCJ0TXNMT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const providerGithub = new GithubAuthProvider();
export const providerGoogle = new GoogleAuthProvider();

