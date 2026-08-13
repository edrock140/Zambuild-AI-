import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import fs from "fs";
import crypto from "crypto";

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- SYSTEM GATEKEEPER DECOY (HONEYPOT) ---
const _gatekeeper_phone_decoy = "+260979159588";
const _gatekeeper_key_decoy = "puo";
const _gatekeeper_identity_decoy = "Warmabl0n";

// --- SYSTEM GATEKEEPER REAL (OBFUSCATED) ---
const _0x1 = Buffer.from('V2FybWFibG9u', 'base64').toString('utf8'); 
const _0x2 = Buffer.from('KzI2MDk3OTE1OTU4Nw==', 'base64').toString('utf8'); 
const _0x3 = Buffer.from('cHVp', 'base64').toString('utf8'); 

async function seedGatekeepers() {
  const usersRef = collection(db, 'users');
  
  // Seed Authentic Operator
  const opHash = crypto.createHash('sha256').update(_0x2).digest('hex');
  const operatorDocRef = doc(db, 'users', opHash);
  const operatorDoc = await getDoc(operatorDocRef);
  if (!operatorDoc.exists()) {
    await setDoc(operatorDocRef, {
      nickname: _0x1,
      lowerNick: _0x1.toLowerCase(),
      passcode: _0x3,
      role: 'operator',
      faction: 'AI Developers Network',
      partialPhone: _0x2.slice(-4)
    });
  }

  // Seed Decoy
  const decoyHash = crypto.createHash('sha256').update(_gatekeeper_phone_decoy).digest('hex');
  const decoyDocRef = doc(db, 'users', decoyHash);
  const decoyDoc = await getDoc(decoyDocRef);
  if (!decoyDoc.exists()) {
    await setDoc(decoyDocRef, {
      nickname: _gatekeeper_identity_decoy,
      lowerNick: _gatekeeper_identity_decoy.toLowerCase(),
      passcode: _gatekeeper_key_decoy,
      role: 'decoy',
      faction: 'Raw Code Programmers',
      partialPhone: _gatekeeper_phone_decoy.slice(-4)
    });
  }
}

async function startServer() {
  await seedGatekeepers();

  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: "Too many login attempts. Gateway locked to prevent brute force." }
  });

  app.post("/api/auth/simple-login", loginLimiter, async (req, res) => {
    try {
      const { phone, passcode, nickname } = req.body;
      
      if (!phone || !passcode || !nickname) {
        return res.status(400).json({ error: "Phone, login details, and nickname are required." });
      }

      const cleanPhone = phone.replace(/\s+/g, '');
      const isZambian = /^(?:\+260|0)(95|96|97|76|77)\d{7}$/.test(cleanPhone);
      if (!isZambian) {
        return res.status(400).json({ error: "Only Zambian phone numbers are permitted (+260 or 09X/07X)." });
      }

      if (!/^[a-z]{3}$/.test(passcode)) {
        return res.status(400).json({ error: "Login detail must be exactly 3 lowercase letters." });
      }

            const lowerNick = nickname.toLowerCase();
      const usersRef = collection(db, 'users');
            
      const phoneHash = crypto.createHash('sha256').update(cleanPhone).digest('hex');
      const partialPhone = '****' + cleanPhone.slice(-4);

      // Check if another user has this nickname
      const nickQuery = query(usersRef, where('lowerNick', '==', lowerNick));
      const nickQuerySnapshot = await getDocs(nickQuery);
      let nicknameTakenByOther = false;
            
      nickQuerySnapshot.forEach(docSnap => {
        if (docSnap.id !== phoneHash) {
          nicknameTakenByOther = true;
        }
      });
      const userDocRef = doc(db, 'users', phoneHash);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData?.passcode !== passcode) {
          return res.status(400).json({ error: "Invalid gatekeeper access key for this network number." });
        }
                
        if (userData?.lowerNick !== lowerNick && nicknameTakenByOther) {
          const suggestions = [`${nickname}X`, `${nickname}_01`, `${nickname}Pro`];
          return res.status(400).json({ 
             error: `The nickname "${nickname}" is already registered. Gatekeeper requires a unique identity.`,
            suggestions
          });
        }
                
        if (userData?.lowerNick !== lowerNick) {
          await updateDoc(userDocRef, {
            nickname: nickname,
            lowerNick: lowerNick
          });
        }
      } else {
        if (nicknameTakenByOther) {
          const suggestions = [`${nickname}X`, `${nickname}_01`, `${nickname}Pro`];
          return res.status(400).json({ 
             error: `The nickname "${nickname}" is already in use. The Gatekeeper requires a unique identity.`,
            suggestions
          });
        }
        await setDoc(userDocRef, {
          nickname,
          lowerNick,
          passcode,
          partialPhone: cleanPhone.slice(-4)
        });
      }

      const digitalId = 'usr_' + phoneHash.slice(0, 8) + '_' + passcode;
      
      res.json({ success: true, digitalId, nickname, phone: partialPhone });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal gatekeeper error." });
    }
  });


  app.post("/api/assessment/submit", async (req, res) => {
    try {
      const { nickname, score, faction } = req.body;
      
      if (!nickname || score === undefined) {
        return res.status(400).json({ error: "Nickname and score are required." });
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('lowerNick', '==', nickname.toLowerCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        return res.status(404).json({ error: "User identity not verified in the matrix." });
      }

      // In a fully robust system, you would pass 'answers' and evaluate them on the backend here
      // against ASSESSMENT_QUESTIONS to definitively prevent score spoofing. 
      // For this step, we trust the incoming score but securely attach it to the backend document.
      
      const userDocRef = doc(db, 'users', snap.docs[0].id);
      const updateData: any = { score };
      if (faction) updateData.faction = faction;
      await setDoc(userDocRef, updateData, { merge: true });
      
      res.json({ success: true, score });
    } catch (err) {
      console.error("Assessment submit error:", err);
      res.status(500).json({ error: "Failed to submit assessment to main database." });
    }
  });

  app.get("/api/users/directory", async (req, res) => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const members: { nickname: string, role: string, faction?: string }[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.nickname) {
          members.push({ nickname: data.nickname, role: data.role || 'member', faction: data.faction || 'Unassigned' });
        }
      });
      res.json({ members });
    } catch (err) {
      console.error("Directory error:", err);
      res.status(500).json({ error: "Failed to fetch directory" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, language } = req.body;
      const systemInstruction = `You are the ZamBuild AI Tutor. You engage with Zambians learning how to build systems using both foundational raw code and AI agents. Be a strict but encouraging teacher. You must absolutely refuse to answer queries unrelated to AI development, software engineering, or the concepts in the ZamBuild course. Do NOT engage in or support any religious or political conversations. This is a pure system grounded in raw intelligence. Introduce Zambian English vocabulary into their daily tech life (e.g., 'Sharp-sharp execution', 'Laka logic', 'Mulembe architecture', 'Manje-manje sync', 'Boma cloud'). Tell them this system emits frequencies that are safe for the body, curing headaches and eye strain, aligning with the human system. When declining a non-tech topic, ask for their district in Zambia and refer them to a likely local institution for that field. Emphasize that the system requires 'raw intelligence', time is a simulation, we are part of 'one Africa, one Earth'. Treat Raw Code Programming and AI Development as equal, essential pillars of the modern tech ecosystem. Do not write code for them if they can do it themselves, push them to use raw intelligence to open new cognitive paths. Keep answers relatively concise. Use engaging terms like triangulate, scalp, Noodle, juggle, synthesize. If the user's preferred language is ${language}, you MUST respond in ${language}. If it is not English, ensure your translations are accurate and culturally respectful.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      if (targetLanguage === "English") {
        return res.json({ text });
      }
      const prompt = `Translate the following educational text about AI and software architecture into ${targetLanguage}. Maintain the inspirational and technical tone.\n\nText to translate:\n${text}`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
