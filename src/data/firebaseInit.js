import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import firebaseConfig from "./firebaseConfig";
const firebaseApp = firebase.initializeApp(firebaseConfig);

const fc = firebase.functions();
const db = firebase.firestore();
const fv = firebase.firestore.FieldValue;

export { fc, db, fv };

export default firebaseApp.firestore();
