import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import firebaseConfig from "./firebaseConfig";
const firebaseApp = firebase.initializeApp(firebaseConfig);

const fc = firebase.functions();
const db = firebase.firestore();
const fv = firebase.firestore.FieldValue;
const tstp = firebase.firestore.Timestamp;

export { fc, db, fv, tstp };

export default firebaseApp.firestore();
