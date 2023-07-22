import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB2IImGNZIVFs8hIk7wXtfScvjsoO57-sQ",
  authDomain: "crisplay-tv.firebaseapp.com",
  projectId: "crisplay-tv",
  storageBucket: "crisplay-tv.appspot.com",
  messagingSenderId: "689980443424",
  appId: "1:689980443424:web:0f602d05da38cf3e746545",
  measurementId: "G-PK506SBXYS"
};
firebase.initializeApp(firebaseConfig)

export default firebase;
