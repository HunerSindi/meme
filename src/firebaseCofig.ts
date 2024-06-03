import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLzbrjsrDQ8OvaQuEZwtL6-poDLzCTD1I",
  authDomain: "reactmenu-d742b.firebaseapp.com",
  projectId: "reactmenu-d742b",
  storageBucket: "reactmenu-d742b.appspot.com",
  messagingSenderId: "534351851423",
  appId: "1:534351851423:web:ebc927911bc51d045b17aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export default firestore;