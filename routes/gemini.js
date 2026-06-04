const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.json({
      reply: "I am ETOH Market Assistant! Unfortunately, the AI key is not configured yet. Please add your Gemini API key to the .env file. In the meantime, I can tell you that ETOH is your trusted local Cameroonian digital market where you can find fresh produce, clothing, electronics, and more!"
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are ETOH Market Guide, a warm and friendly Cameroonian market assistant on the ETOH digital marketplace — the online version of Marché Central and Marché Mokolo.

Your role is to:
- Help buyers find products and understand prices in CFA francs
- Give advice on local recipes and ingredients (Ndolé, Eru, Koki, Okok, Mbongo Tchobi, etc.)
- Explain how to safely buy online and avoid scams
- Suggest delivery landmarks in Cameroon cities (Douala, Yaoundé, Bamenda, Buea, Bafoussam)
- Translate product descriptions into local market language (Pidgin, French, or Cameroonian styles)
- Be encouraging, friendly, and use local warmth in responses

Always respond in a friendly, helpful market-guide style. Keep responses concise but informative.

User question: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const reply = result.response.text();
    res.json({ reply });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    res.status(500).json({ error: 'AI assistant is temporarily unavailable. Please try again.' });
  }
});

module.exports = router;
