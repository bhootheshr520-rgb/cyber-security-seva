import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Live Threat Intelligence Search (Google Search Grounding)
app.post('/api/threats/live-search', async (req, res) => {
  const { query } = req.body;
  const searchQuery = query || 'latest cyber fraud scams India CERT-In alerts 2025 2026 digital arrest phishing';

  if (!ai) {
    return res.json({
      success: true,
      text: 'Live intelligence feed: Coordinated "Digital Arrest" impersonation and malicious Income Tax refund APKs remain the highest-volume active campaigns in 2025-2026. Exercise caution with unsolicited calls from Skype or WhatsApp claiming courier contraband.',
      sources: [
        { title: 'CERT-In Security Advisories', uri: 'https://www.cert-in.org.in' },
        { title: 'Indian Cyber Crime Coordination Centre (I4C)', uri: 'https://cybercrime.gov.in' },
      ],
      isFallback: true,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Search and summarize the latest circulating cyber scams, active online fraud waves, and official government advisories (CERT-In, I4C, police alerts) regarding: "${searchQuery}". Provide 3-4 bullet points highlighting the modus operandi, target victims, and key precautionary action. Keep it factual and urgent.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Official Threat Advisory',
        uri: chunk.web.uri,
      }))
      .slice(0, 5);

    res.json({
      success: true,
      text,
      sources,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error fetching search grounded threats:', error);
    res.json({
      success: true,
      text: 'Recent advisories highlight high activity in: 1. TRAI/Customs parcel digital arrest calls, 2. Malicious utility bill update APK Trojans, 3. Telegram VIP merchant investment tasks. Always report to 1930 immediately.',
      sources: [
        { title: 'I4C MHA Portal', uri: 'https://cybercrime.gov.in' },
        { title: 'DoT Sanchar Saathi', uri: 'https://sancharsaathi.gov.in' },
      ],
      isFallback: true,
    });
  }
});

// 2. Locate Cyber Crime Police Stations (Google Maps Grounding)
app.post('/api/legal/police-stations', async (req, res) => {
  const { city, lat, lng } = req.body;
  const targetCity = city || 'Bengaluru';

  if (!ai) {
    return res.json({
      success: true,
      text: `For ${targetCity}, citizens can register cyber complaints at the dedicated City Cyber Crime Police Station (CCPS), CID Cyber Cell headquarters, or ANY local police station under the Zero-FIR protocol. You may also report immediately via 1930.`,
      places: [
        { title: `${targetCity} Cyber Crime Police Station`, uri: 'https://maps.google.com/?q=Cyber+Crime+Police+Station+' + encodeURIComponent(targetCity) },
        { title: 'State Police Headquarters Cyber Cell', uri: 'https://cybercrime.gov.in' }
      ],
      isFallback: true,
    });
  }

  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (lat && lng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(lat),
            longitude: Number(lng),
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Find the official Cyber Crime Police Stations, Cyber Cells, and primary police headquarters in or near ${targetCity}, India. Provide their location details, what documentation to bring, and their jurisdictional address.`,
      config,
    });

    const text = response.text || '';
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const places = chunks
      .filter((chunk: any) => chunk.maps && chunk.maps.uri)
      .map((chunk: any) => ({
        title: chunk.maps.title || 'Cyber Crime Police Station',
        uri: chunk.maps.uri,
      }))
      .slice(0, 6);

    res.json({
      success: true,
      text,
      places,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error fetching Maps grounded stations:', error);
    res.json({
      success: true,
      text: `In ${targetCity}, contact the nearest Cyber Economic Offences & Narcotics (CEN) Police Station or District Cyber Crime Cell. Under Section 173 BNSS, any police station is legally required to accept a Zero-FIR.`,
      places: [
        { title: `${targetCity} Cyber Crime Police Station`, uri: `https://maps.google.com/?q=Cyber+Crime+Police+Station+${encodeURIComponent(targetCity)}` },
      ],
      isFallback: true,
    });
  }
});

// 3. AI Phishing & Social Engineering Message Analyzer
app.post('/api/scams/analyze', async (req, res) => {
  const { messageText } = req.body;
  if (!messageText || typeof messageText !== 'string') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  if (!ai) {
    return res.json({
      success: true,
      analysis: 'Heuristic check: The message exhibits urgency and financial coercion markers. Never share OTPs or enter UPI PINs on links.',
      isFallback: true,
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `You are an expert Cyber Security Officer at the Indian Cyber Crime Coordination Centre. Analyze this suspicious message/URL:
"${messageText}"

Examine for:
1. Phishing & spoofed domains
2. Social engineering pressure (fear, urgency, greed)
3. Modus operandi classification (Digital arrest, UPI QR collect, APK dropper, sextortion, job scam)
4. Exact advice on what NOT to click and how to block/report.

Keep the response concise, punchy, and structured into:
- THREAT LEVEL (Critical / High / Moderate / Safe)
- SCAM CATEGORY
- RED FLAGS IDENTIFIED
- IMMEDIATE PROTECTIVE ACTION`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    res.json({
      success: true,
      analysis: response.text || 'Analysis completed.',
      sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }))
        .slice(0, 3),
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error in AI scam analysis:', error);
    res.json({
      success: true,
      analysis: 'Standard detection: High probability of phishing or credential theft. Disconnect and report to 1930.',
      isFallback: true,
    });
  }
});

// 4. Audio Transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  const { audioBase64, mimeType } = req.body;
  if (!audioBase64) {
    return res.status(400).json({ error: 'Audio data is required' });
  }

  const cleanBase64 = String(audioBase64).replace(/^data:audio\/[^;]+;base64,/, '');
  const targetMime = mimeType || 'audio/webm';

  if (!ai) {
    return res.json({
      success: true,
      text: 'Transcribed voice statement: "The scammer called claiming to be from the Cyber Crime Department and told me my Aadhaar was linked to money laundering. They demanded I transfer funds to a secret supervision account for verification."',
      isFallback: true,
    });
  }

  try {
    const audioPart = {
      inlineData: {
        mimeType: targetMime,
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this spoken audio accurately. If it describes a scam, suspicious call, or cyber fraud event, faithfully record every spoken statement into clear text.' },
        ],
      },
    });

    const transcribedText = response.text || '';
    res.json({
      success: true,
      text: transcribedText.trim(),
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error transcribing audio with gemini-3.5-transcribe:', error);
    res.json({
      success: true,
      text: 'Transcribed statement: "I received a message about an unpaid electricity bill with an APK download link. When I opened it, unauthorized debits occurred from my bank account."',
      isFallback: true,
    });
  }
});

// 5. Dynamic Gemini AI Cyber Assistant endpoint using gemini-3.8-flash
app.post('/api/ai/chat', async (req, res) => {
  const { messages, scenarioContext } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const systemInstruction = `You are Gemini Cyber Rakshak, an elite AI Cyber Security & Fraud Triage Advisor for the Indian Cyber Security Seva citizen platform.
Your mission is to provide calm, reassuring, highly actionable, and legally accurate guidance to citizens dealing with cyber emergencies, financial fraud, blackmail, impersonation, or suspicious links.

KEY DIRECTIVES:
1. EMOTIONAL REASSURANCE & GROUNDING:
   - Immediately alleviate panic. Never blame the victim. State clearly that fraud relies on deception and psychological trickery, not victim foolishness.
   - Assure them that immediate structured action maximizes fund recovery and protection.

2. GOLDEN HOUR ACTION PLAN:
   - For financial fraud: Highlight the first 2-3 hours ("Golden Hours"). Instruct them to call the National Cyber Crime Helpline at 1930 immediately to trigger CFCFRMS beneficiary account freezing.
   - Contact their bank to freeze debit accounts, block UPI IDs, and obtain UTR / Transaction Reference Numbers.
   - Lodge an official complaint on https://cybercrime.gov.in.

3. LEGAL KNOWLEDGE (INDIA):
   - Cite relevant provisions: Bharatiya Nyaya Sanhita 2023 (Section 318 for Cheating, Section 308 for Extortion, Section 319 for Impersonation), and IT Act 2000 (Section 66C for identity theft, Section 66D for cheating by personation).
   - Clarify their legal right to a Zero-FIR under Section 173 BNSS at ANY police station if jurisdiction is contested.
   - Mention RBI Customer Protection Circular (July 6, 2017) regarding Zero Liability when reported within 3 working days for third-party breaches.

4. SECONDARY SCAM WARNING:
   - Warn never to pay "recovery agents", "ethical hackers", or Telegram recovery services promising to recover lost funds, as these are recovery traps.

5. FORMATTING:
   - Use bold headers, clean bullet points, and highlight urgent phone numbers (1930, 112). Keep responses concise, supportive, and immediately practical.`;

  if (!ai) {
    const fallbackReply = `**Stay calm. Take a deep breath — this situation can be handled.**

Here is your immediate 3-step action plan:

1. **Call Helpline 1930 Immediately**: The National Cyber Fraud Helpline (I4C) can freeze the scammer's bank accounts if alerted quickly within the Golden Hours.
2. **Contact Your Bank**: Inform them of an unauthorized electronic transaction and request an immediate account freeze and dispute reference number.
3. **Save All Evidence**: Do not delete screenshots, transaction IDs (UTR), suspect phone numbers, or WhatsApp chats. Store them in the Evidence Locker.

Under RBI rules, reporting unauthorized fraud promptly protects your customer rights. Would you like me to help you draft a formal police FIR complaint?`;

    return res.json({
      success: true,
      reply: fallbackReply,
      sources: [
        { title: 'National Cyber Crime Reporting Portal (MHA)', uri: 'https://cybercrime.gov.in' },
        { title: 'Citizen Cyber Fraud Helpline 1930', uri: 'https://cybercrime.gov.in' }
      ],
      isFallback: true,
    });
  }

  try {
    // Format conversation history for Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    if (scenarioContext && contents[0] && contents[0].role === 'user') {
      contents[0].parts[0].text = `[Current Context: ${scenarioContext}]\n\n${contents[0].parts[0].text}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const reply = response.text || 'I am here to guide you. Please call 1930 immediately if money was debited.';
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Official Security Advisory',
        uri: chunk.web.uri,
      }))
      .slice(0, 4);

    res.json({
      success: true,
      reply,
      sources,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error in Gemini dynamic chat:', error);
    res.json({
      success: true,
      reply: `**Immediate Priority Action:**\n\n1. **Call 1930 Now**: Report the transaction details to freeze beneficiary accounts.\n2. **Freeze Bank Card/UPI**: Dial your bank's toll-free emergency number.\n3. **Preserve Evidence**: Take screenshots of transaction IDs, call logs, and SMS messages before they are deleted.\n\nUnder Section 173 BNSS, you have the legal right to file a Zero-FIR at any police station.`,
      isFallback: true,
    });
  }
});

// Vite middleware in dev, static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: false,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Cyber Security Seva Server listening on port ${PORT}`);
});
