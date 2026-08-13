const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp({
  projectId: "gen-lang-client-0659775712",
});
const db = getFirestore(app, "ai-studio-zambuildai-53277d4f-eef9-4aff-80a2-3d2e5e120cca");

async function run() {
  try {
    const res = await db.collection("users").limit(1).get();
    console.log("SUCCESS:", res.empty);
  } catch(e) {
    console.error("ERROR:", e);
  }
}
run();
