import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'   // To import the database used for this project


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq0RQug9gEib0vd2J1CP4CyOnWdQ_E5Fs",
  authDomain: "house-marketplace-app-c1709.firebaseapp.com",
  projectId: "house-marketplace-app-c1709",
  storageBucket: "house-marketplace-app-c1709.appspot.com",
  messagingSenderId: "4870235027",
  appId: "1:4870235027:web:444ec78ba83e90f4b73e66"
};

// Initialize Firebase
initializeApp(firebaseConfig)       // To initialize the firebase app
export const db = getFirestore()