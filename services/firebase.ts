import * as firebaseApp from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// -----------------------------------------------------------
// Configuración de Firebase
// -----------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBc9if8KJPP-k2YQXPL2ARPyVy2Zy-gF7A",
  authDomain: "finance-app-95802.firebaseapp.com",
  databaseURL: "https://finance-app-95802-default-rtdb.firebaseio.com",
  projectId: "finance-app-95802",
  storageBucket: "finance-app-95802.firebasestorage.app",
  messagingSenderId: "323146251641",
  appId: "1:323146251641:web:4e3fd4698221c92f7283a8",
  measurementId: "G-ERG7DD6ZKR"
};

// Validamos si la configuración es real
const isConfigured = firebaseConfig.apiKey !== "TU_API_KEY_AQUI";

let db: Firestore | null = null;
let app: any = null;

if (isConfigured) {
    try {
        console.log("Intentando conectar a Firebase...");
        // Use namespace import access for initializeApp to resolve TS error
        app = firebaseApp.initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("🔥 Firebase conectado exitosamente");
    } catch (e) {
        console.error("Error conectando Firebase:", e);
    }
} else {
    console.log("⚠️ Firebase no configurado. Usando modo LocalStorage.");
}

export { db };