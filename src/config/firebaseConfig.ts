import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../firebase-service-account.json";

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

const auth = getAuth();
const db = getFirestore();

export { auth, db };