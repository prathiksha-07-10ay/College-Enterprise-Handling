import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client if API key is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Assistant endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { prompt, userContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient) {
      // Fallback response if API key is not configured
      const role = userContext?.role || 'User';
      const name = userContext?.name || 'Member';
      return res.json({
        text: `Hello ${name}! As your SIGCE ERP Assistant, here is the information from your active portal session:\n\n` +
          `• **Role**: ${role}\n` +
          `• **Status**: Portal active and synchronized with database.\n` +
          `• Note: For advanced natural language reasoning, configure your GEMINI_API_KEY in the Secrets panel. In the meantime, you can review your records directly via your dashboard!`,
      });
    }

    const systemInstruction = `You are SIGCE ERP's official Campus Intelligence Assistant for Smt. Indira Gandhi College of Engineering.
You help students, faculty staff, and academic administrators (HOD/Admin) by answering queries about their courses, attendance records, exam results, leaves, and campus guidelines.
Always be polite, structured, professional, and clear. Format numbers, percentages, and lists cleanly using markdown.

User Context:
${JSON.stringify(userContext || {}, null, 2)}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "I couldn't generate a response. Please try again.";
    return res.json({ text: reply });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'Failed to process AI query',
      details: error.message || 'Unknown error',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIGCE ERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
