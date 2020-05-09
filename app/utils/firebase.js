import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB5cyQAGU_WqLyccd9uhu2PF2s7_7EX0NQ",
    authDomain: "app-restaurants-react-native.firebaseapp.com",
    databaseURL: "https://app-restaurants-react-native.firebaseio.com",
    projectId: "app-restaurants-react-native",
    storageBucket: "app-restaurants-react-native.appspot.com",
    messagingSenderId: "498011052619",
    appId: "1:498011052619:web:dba942bf1b08feed958bce"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);