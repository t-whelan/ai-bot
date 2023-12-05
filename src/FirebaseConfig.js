// Import the functions you need from the SDKs you need
// Import the necessary function from the 'firebase/app' module
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_BTHUZRvWkWimHgwlhrifaojob2CtSdQ",
  authDomain: "ai-chatbot-f4baf.firebaseapp.com",
  projectId: "ai-chatbot-f4baf",
  storageBucket: "ai-chatbot-f4baf.appspot.com",
  messagingSenderId: "548325644126",
  appId: "1:548325644126:web:4138e0b63a4d0e484de1cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getAuth(app)