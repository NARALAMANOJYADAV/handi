const express = require('express');
const router = express.Router();

// AI command processing endpoint
// Uses OpenAI API if configured, otherwise falls back to simple NLP
router.post('/process', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // Check if OpenAI is configured
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a voice command parser for an accessibility web assistant. Parse the user's voice command and return a JSON response with:
              - intent: one of [open_website, search, scroll, click, navigate_back, navigate_forward, refresh, new_tab, read_page, stop_reading, type_text, play_video, pause_video, volume_up, volume_down, emergency, dark_mode, high_contrast, large_text, reader_mode, get_time, get_date, open_app, chat, unknown]
              - actions: array of { type: "open_url"|"search"|"scroll"|"click"|"navigate", target?: string, value?: string }
              - response: a friendly voice response string for the user (required for 'chat' intent or general questions)
              
              Respond ONLY with valid JSON.`,
            },
            {
              role: 'user',
              content: `Parse this voice command (language: ${language}): "${text}"`,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content);
        return res.json(aiResponse);
      } catch (aiError) {
        console.error('OpenAI error:', aiError.message);
        // Fall through to basic NLP
      }
    }

    // Basic NLP fallback
    const result = basicNlpProcess(text, language);
    res.json(result);
  } catch (error) {
    console.error('AI process error:', error);
    res.status(500).json({ message: 'Error processing command' });
  }
});

function basicNlpProcess(text, language) {
  const lower = text.toLowerCase().trim();
  
  // Handle greetings and basic conversation even in basic mode
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste)/i.test(lower)) {
    return {
      intent: 'chat',
      response: "Hello! How can I help you today?",
      actions: []
    };
  }

  if (/who are you/i.test(lower)) {
    return {
      intent: 'chat',
      response: "I am HandiVoice, your voice-controlled accessibility assistant.",
      actions: []
    };
  }

  if (/(time|date)/i.test(lower)) {
    const intent = lower.includes('time') ? 'get_time' : 'get_date';
    return { intent, actions: [{ type: 'navigate', target: intent }] };
  }

  // Multi-step command detection
  const steps = lower.split(/\s+and\s+/);
  const actions = [];
  let intent = 'unknown';

  for (const step of steps) {
    if (/open\s+|navigate to|go to/.test(step)) {
      const target = step.replace(/(?:can you |please )?(?:open|navigate to|go to)\s+/i, '').replace(/\s+app$/i, '').trim();
      if (target.includes('train')) {
        intent = 'open_app';
        actions.push({ type: 'open_url', target: 'where is my train' });
      } else {
        intent = 'open_website';
        actions.push({ type: 'open_url', target });
      }
    } else if (/search\s+/.test(step)) {
      const query = step.replace(/(?:search|search for|look up)\s+/i, '').trim();
      intent = 'search';
      actions.push({ type: 'search', value: query });
    } else if (/play\s+/.test(step)) {
      intent = 'play_video';
      actions.push({ type: 'click', target: 'play' });
    } else if (/scroll\s+/.test(step)) {
      const dir = step.includes('up') ? 'up' : 'down';
      intent = 'scroll';
      actions.push({ type: 'scroll', target: dir });
    }
  }

  if (actions.length === 0) {
    // If we don't know the command, treat it as a chat query to avoid "I don't understand"
    return {
      intent: 'chat',
      response: `You said: "${text}". I'm not sure how to do that yet, but I'm learning!`,
      actions: []
    };
  }

  return { intent, actions };
}

module.exports = router;
