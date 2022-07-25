// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBde2Zpnk_lUrjkqco4G4qepayaP3gQZtY",
  authDomain: "cpsc-2650-project-b6cd7.firebaseapp.com",
  projectId: "cpsc-2650-project-b6cd7",
  storageBucket: "cpsc-2650-project-b6cd7.appspot.com",
  messagingSenderId: "276962384708",
  appId: "1:276962384708:web:691ebcfb94b78647f71511",
  measurementId: "G-DSBKQXTMJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const provider = new GithubAuthProvider();

