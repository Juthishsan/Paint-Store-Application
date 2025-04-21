import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyCp7BvFYAXj9yaY7foIXDsy7leV6KpmUbY",
    authDomain: "venkateshwara-paints.firebaseapp.com",
    databaseURL: "https://venkateshwara-paints-default-rtdb.firebaseio.com",
    projectId: "venkateshwara-paints",
    storageBucket: "venkateshwara-paints.appspot.com",
    messagingSenderId: "604458166096",
    appId: "1:604458166096:web:a6225fd48aa5d471eb2e55",
    measurementId: "G-Q9F4H8X05P"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, db, auth, storage }
