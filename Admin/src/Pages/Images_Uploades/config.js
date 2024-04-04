// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa6VTr-ZwtgZ3TNj7N57vgVeY7TB7w2N0",
  authDomain: "finalproject-faf31.firebaseapp.com",
  projectId: "finalproject-faf31",
  storageBucket: "finalproject-faf31.appspot.com",
  messagingSenderId: "575564415129",
  appId: "1:575564415129:web:8030c108cb198130733808",
  measurementId: "G-039L21DG71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { app, storage };
