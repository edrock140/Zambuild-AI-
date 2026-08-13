import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    await setDoc(doc(db, "test", "1"), { test: true });
    console.log("SUCCESS");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
test();
