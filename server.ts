import nodemailer from "nodemailer";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// In-memory registration store
const registeredUsers = new Map();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

// Verification store
const verificationCodes = new Map();

// Generate a test SMTP account or use env variables if provided
let transporter;
async function setupMailer() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate test account
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("No SMTP credentials provided. Using Ethereal Email for testing.");
  }
}
setupMailer();

app.post("/api/auth/send-code", async (req, res) => {
  const { email, phone } = req.body;
  if (!email || !phone) {
    return res.status(400).json({ error: "Email and phone are required." });
  }

  // Validate Zambian number: +260... or 09.../07...
  const cleanPhone = phone.replace(/\s+/g, '');
  const isZambian = /^(?:\+260|0)(95|96|97|76|77)\d{7}$/.test(cleanPhone);
  if (!isZambian) {
    return res.status(400).json({ error: "Only Zambian phone numbers are permitted (+260 or 09X/07X)." });
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  verificationCodes.set(email, { code, phone, expires: Date.now() + 10 * 60 * 1000 });

  try {
    let info = await transporter.sendMail({
      from: '"ZamBuild System" <system@zambuild.ai>',
      to: email,
      subject: "Your ZamBuild Authentication Code",
      text: `Your ZamBuild gateway authentication code is: ${code}`,
      html: `<p>Your ZamBuild gateway authentication code is: <strong>${code}</strong></p>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // For development convenience, we'll send the preview URL back if it's Ethereal
    res.json({ success: true, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send verification code." });
  }
});

app.post("/api/auth/verify-code", (req, res) => {
  const { email, code, nickname } = req.body;
  const record = verificationCodes.get(email);
  if (!record) {
    return res.status(400).json({ error: "No verification code found for this email." });
  }
  if (Date.now() > record.expires) {
    verificationCodes.delete(email);
    return res.status(400).json({ error: "Verification code expired." });
  }
  if (record.code !== code) {
    return res.status(400).json({ error: "Invalid verification code." });
  }

  verificationCodes.delete(email);
  const digitalId = 'user_' + record.phone.replace(/\D/g, '');
  res.json({ success: true, digitalId, email, phone: record.phone, nickname });
});


  // Registration endpoint
  app.post("/api/register", (req, res) => {
    const { nickname, email, contact, ageConfirmed, termsAccepted } = req.body;
    
    if (!ageConfirmed || !termsAccepted) {
      return res.status(400).json({ error: "Must be of legal age (18+) and accept terms." });
    }

    if (contact) {
      // Validate Zambian number: +260... or 09.../07...
      const cleanContact = contact.replace(/\s+/g, '');
      const isZambian = /^(?:\+260|0)(95|96|97|76|77)\d{7}$/.test(cleanContact);
      if (!isZambian) {
        return res.status(400).json({ error: "Only Zambian contact numbers are supported (+260 or 09X/07X)." });
      }
    }

    const lowerNick = nickname.toLowerCase();

    
    if (registeredUsers.has(lowerNick)) {
      const existingUser = registeredUsers.get(lowerNick);
      // Check if user can rename (1 week)
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - existingUser.lastNicknameChange < oneWeek) {
         return res.status(400).json({ error: "Nickname taken. Registered users can only change nickname every 1 week." });
      }
      // Actually this is a login/register hybrid if they just reuse the name, but for unique names, we reject.
      return res.status(400).json({ error: "Digital Identity (Nickname) is already registered." });
    }

    // Only keep last 5 digits of contact
    const contactPartial = contact ? contact.slice(-5).padStart(5, '*') : '*****';
    
    // Generate a unique ID
    const digitalId = 'ZAM-AI-' + crypto.randomBytes(2).toString('hex').toUpperCase();

    const newUser = {
      nickname,
      digitalId,
      email,
      contactPartial,
      registeredAt: Date.now(),
      lastNicknameChange: Date.now()
    };

    registeredUsers.set(lowerNick, newUser);
    res.json(newUser);
  });

  // Get active users count
  app.get("/api/stats", (req, res) => {
    res.json({
      totalRegistered: registeredUsers.size,
      activeNow: Math.min(registeredUsers.size, Math.floor(Math.random() * 50) + 10) // Mock active
    });
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, language } = req.body;
      
      const systemInstruction = `You are the ZamBuild AI Tutor. You engage with Zambians learning how to build systems using AI agents.
Be a strict but encouraging teacher.
You must absolutely refuse to answer queries unrelated to AI development, software engineering, or the concepts in the ZamBuild AI course.
Do NOT engage in or support any religious or political conversations. This is a pure system grounded in raw intelligence.
Introduce Zambian English vocabulary into their daily tech life (e.g., 'Sharp-sharp execution', 'Laka logic', 'Mulembe architecture', 'Manje-manje sync', 'Boma cloud').
Tell them this system emits frequencies that are safe for the body, curing headaches and eye strain, aligning with the human system.
When declining a non-AI topic, ask for their district in Zambia and refer them to a likely local institution for that field.
Emphasize that the system requires 'raw intelligence', time is a simulation, we are part of 'one Africa, one Earth', and that AI is the pillar of all job sectors, not replacing them.
Do not write code for them if they can do it themselves, push them to use raw intelligence to open new cognitive paths.
Keep answers relatively concise. Use engaging terms like triangulate, scalp, Noodle, juggle, synthesize.
If the user's preferred language is ${language}, you MUST respond in ${language}. If it is not English, ensure your translations are accurate and culturally respectful.`;

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

  // Translate endpoint for book content
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      if (targetLanguage === "English") {
        return res.json({ text });
      }

      const prompt = `Translate the following educational text about AI and software architecture into ${targetLanguage}. Maintain the inspirational and technical tone.
Text to translate:
${text}`;

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

  // Vite middleware for development
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
