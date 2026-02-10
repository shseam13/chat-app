import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

const connectToFirebaseDB = async () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Connected to Firebase DB");
  } else {
    console.log("Already connected to Firebase DB");
  }
};
// export const db = admin.firestore();
// export const auth = admin.auth();

export default connectToFirebaseDB;
