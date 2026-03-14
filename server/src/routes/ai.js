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
              - intent: one of [open_website, search, scroll, click, navigate_back, navigate_forward, refresh, new_tab, read_page, stop_reading, type_text, play_video, pause_video, volume_up, volume_down, emergency, dark_mode, high_contrast, large_text, reader_mode, unknown]
              - actions: array of { type: "open_url"|"search"|"scroll"|"click"|"navigate", target?: string, value?: string }
              
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
  const lower = text.toLowerCase();
  
  // Multi-step command detection
  const steps = lower.split(/\s+and\s+/);
  const actions = [];

  for (const step of steps) {
    if (/open\s+/.test(step)) {
      const target = step.replace(/(?:can you |please )?open\s+/i, '').trim();
      actions.push({ type: 'open_url', target });
    } else if (/search\s+/.test(step)) {
      const query = step.replace(/(?:search|search for|look up)\s+/i, '').trim();
      actions.push({ type: 'search', value: query });
    } else if (/play\s+/.test(step)) {
      actions.push({ type: 'click', target: 'play' });
    } else if (/read\s+/.test(step)) {
      actions.push({ type: 'navigate', target: 'read' });
    } else if (/scroll\s+/.test(step)) {
      const dir = step.includes('up') ? 'up' : 'down';
      actions.push({ type: 'scroll', target: dir });
    }
  }

  if (actions.length === 0) {
    actions.push({ type: 'navigate', target: 'unknown', value: text });
  }

  return { intent: actions[0]?.type || 'unknown', actions };
}

module.exports = router;
