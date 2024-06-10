import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBzi9l7L644Qu6vcAXi4raDTGcmGlMTmR8",
    authDomain: "react-notes-7815b.firebaseapp.com",
    projectId: "react-notes-7815b",
    storageBucket: "react-notes-7815b.appspot.com",
    messagingSenderId: "963860866727",
    appId: "1:963860866727:web:20bdd20ef87aaa13a6dd82"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")