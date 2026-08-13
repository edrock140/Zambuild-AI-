import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const app = initializeApp({ projectId: "gen-lang-client-0659775712" });
try {
  const db = getFirestore(app, "ai-studio-zambuildai-53277d4f-eef9-4aff-80a2-3d2e5e120cca");
  console.log("SUCCESS!");
} catch (e) {
  console.error(e);
}
