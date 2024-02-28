// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3UC_PWjzs8guGmj26sMKdCTkbo2taV9U",
  authDomain: "task-management-system-auth.firebaseapp.com",
  projectId: "task-management-system-auth",
  storageBucket: "task-management-system-auth.appspot.com",
  messagingSenderId: "143431950941",
  appId: "1:143431950941:web:fd18b6dd319265d768e3b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
