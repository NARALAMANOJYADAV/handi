import type { ParsedCommand, CommandIntent, SupportedLanguage } from '../types';

// Website shortcuts for quick access
const WEBSITE_MAP: Record<string, string> = {
  youtube: 'https://www.youtube.com',
  google: 'https://www.google.com',
  gmail: 'https://mail.google.com',
  facebook: 'https://www.facebook.com',
  twitter: 'https://twitter.com',
  x: 'https://twitter.com',
  instagram: 'https://www.instagram.com',
  linkedin: 'https://www.linkedin.com',
  github: 'https://github.com',
  reddit: 'https://www.reddit.com',
  amazon: 'https://www.amazon.com',
  netflix: 'https://www.netflix.com',
  spotify: 'https://www.spotify.com',
  slack: 'https://slack.com',
  notion: 'https://www.notion.so',
  wikipedia: 'https://www.wikipedia.org',
  whatsapp: 'https://web.whatsapp.com',
  telegram: 'https://web.telegram.org',
  maps: 'https://maps.google.com',
  drive: 'https://drive.google.com',
  docs: 'https://docs.google.com',
  sheets: 'https://sheets.google.com',
  calendar: 'https://calendar.google.com',
  translate: 'https://translate.google.com',
  news: 'https://news.google.com',
};

// Command patterns for natural language parsing
interface CommandPattern {
  patterns: RegExp[];
  intent: CommandIntent;
  extractParams?: (match: RegExpMatchArray, fullText: string) => { target?: string; value?: string };
}

const COMMAND_PATTERNS: CommandPattern[] = [
  // Open website
  {
    patterns: [
      /(?:open|go to|navigate to|visit|launch|load)\s+(.+)/i,
      /(?:can you |please )?(?:open|go to|navigate to|visit|launch)\s+(.+)/i,
    ],
    intent: 'open_website',
    extractParams: (match) => ({ target: match[1]?.trim() }),
  },
  // Search
  {
    patterns: [
      /(?:search|search for|look up|find|google)\s+(.+)/i,
      /(?:search on google|google search)\s+(?:for\s+)?(.+)/i,
      /(?:search (?:on |in )?(?:youtube|google|bing))\s+(?:for\s+)?(.+)/i,
    ],
    intent: 'search',
    extractParams: (match) => ({ value: match[1]?.trim() }),
  },
  // Scroll
  {
    patterns: [
      /scroll\s+(up|down|left|right)(?:\s+(?:a )?(little|lot|bit|more))?/i,
      /(?:please |can you )?scroll\s+(up|down)/i,
      /(?:go |move )\s*(up|down)\s*(?:the page)?/i,
    ],
    intent: 'scroll',
    extractParams: (match) => ({
      target: match[1]?.toLowerCase(),
      value: match[2]?.toLowerCase() || 'normal',
    }),
  },
  // Click
  {
    patterns: [
      /(?:click|tap|press|hit|select)\s+(?:the\s+|on\s+(?:the\s+)?)?(.+?)(?:\s+button|\s+link|\s+tab)?$/i,
      /(?:can you |please )?(?:click|tap|press)\s+(?:on\s+)?(.+)/i,
    ],
    intent: 'click',
    extractParams: (match) => ({ target: match[1]?.trim() }),
  },
  // Navigation
  {
    patterns: [/go\s*back/i, /(?:navigate |go )?back(?:\s+page)?/i, /previous\s+page/i],
    intent: 'navigate_back',
  },
  {
    patterns: [/go\s*forward/i, /(?:navigate |go )?forward(?:\s+page)?/i, /next\s+page/i],
    intent: 'navigate_forward',
  },
  {
    patterns: [/refresh(?:\s+(?:the\s+)?page)?/i, /reload(?:\s+(?:the\s+)?page)?/i],
    intent: 'refresh',
  },
  {
    patterns: [/(?:open|new)\s+tab/i],
    intent: 'new_tab',
  },
  // Read
  {
    patterns: [
      /read\s+(?:this\s+)?(?:page|article|content|text)/i,
      /read\s+(?:the\s+)?(?:latest\s+)?(?:notification|message)/i,
      /(?:start |begin )?reading/i,
    ],
    intent: 'read_page',
  },
  {
    patterns: [/stop\s+reading/i, /(?:stop|cancel|end)\s+(?:the\s+)?(?:reading|speech)/i, /shut\s+up/i, /be\s+quiet/i],
    intent: 'stop_reading',
  },
  // Type text
  {
    patterns: [
      /(?:type|write|input|enter)\s+(.+)/i,
      /(?:can you |please )?(?:type|write)\s+(.+)/i,
    ],
    intent: 'type_text',
    extractParams: (match) => ({ value: match[1]?.trim() }),
  },
  // Video controls
  {
    patterns: [
      /play(?:\s+(?:the\s+)?(?:video|music|song|first video|second video))?/i,
      /(?:start|resume)\s+(?:the\s+)?(?:video|music|playback)/i,
    ],
    intent: 'play_video',
    extractParams: (match) => ({ target: match[0]?.trim() }),
  },
  {
    patterns: [
      /pause(?:\s+(?:the\s+)?(?:video|music|song))?/i,
      /stop(?:\s+(?:the\s+)?(?:video|music))/i,
    ],
    intent: 'pause_video',
  },
  // Volume
  {
    patterns: [/(?:increase|raise|turn up|volume up)\s*(?:the\s+)?(?:volume)?/i],
    intent: 'volume_up',
  },
  {
    patterns: [/(?:decrease|lower|turn down|volume down)\s*(?:the\s+)?(?:volume)?/i],
    intent: 'volume_down',
  },
  // Emergency
  {
    patterns: [/emergency(?:\s+help)?/i, /(?:call|send)\s+(?:for\s+)?(?:help|emergency)/i, /i\s+need\s+help/i, /sos/i],
    intent: 'emergency',
  },
  // Accessibility toggles
  {
    patterns: [/(?:toggle|enable|disable|switch|turn\s+(?:on|off))\s+dark\s*mode/i],
    intent: 'dark_mode',
  },
  {
    patterns: [/(?:toggle|enable|disable|switch|turn\s+(?:on|off))\s+(?:high\s+)?contrast/i],
    intent: 'high_contrast',
  },
  {
    patterns: [/(?:toggle|enable|disable|switch|turn\s+(?:on|off))\s+(?:large|big)\s+text/i],
    intent: 'large_text',
  },
  // Menu
  {
    patterns: [/open\s+(?:the\s+)?menu/i, /show\s+(?:the\s+)?menu/i],
    intent: 'open_menu',
  },
  // Reader mode
  {
    patterns: [/(?:reader|reading|focus)\s+mode/i, /(?:enable|turn on)\s+(?:reader|reading|focus)\s+mode/i],
    intent: 'reader_mode',
  },
];

// Multi-language keyword maps
const LANGUAGE_KEYWORDS: Record<SupportedLanguage, Partial<Record<string, string>>> = {
  'en-US': {},
  'hi-IN': {
    'खोलो': 'open', 'खोज': 'search', 'खोजो': 'search',
    'नीचे': 'down', 'ऊपर': 'up', 'स्क्रॉल': 'scroll',
    'क्लिक': 'click', 'पीछे': 'back', 'आगे': 'forward',
    'पढ़ो': 'read', 'रुको': 'stop', 'लिखो': 'type',
    'चलाओ': 'play', 'रोको': 'pause', 'मदद': 'help',
    'पेज': 'page', 'बटन': 'button',
  },
  'te-IN': {
    'తెరవు': 'open', 'వెతుకు': 'search',
    'క్రిందకు': 'down', 'పైకి': 'up', 'స్క్రోల్': 'scroll',
    'క్లిక్': 'click', 'వెనక్కి': 'back', 'ముందుకు': 'forward',
    'చదవు': 'read', 'ఆపు': 'stop', 'టైప్': 'type',
    'ప్లే': 'play', 'పాజ్': 'pause', 'సహాయం': 'help',
  },
};

function translateToEnglish(text: string, language: SupportedLanguage): string {
  const keywords = LANGUAGE_KEYWORDS[language];
  if (!keywords || language === 'en-US') return text;
  
  let translated = text;
  for (const [foreign, english] of Object.entries(keywords)) {
    translated = translated.replace(new RegExp(foreign, 'gi'), english as string);
  }
  return translated;
}

export function parseCommand(text: string, language: SupportedLanguage = 'en-US'): ParsedCommand {
  // Translate if not English
  const normalizedText = translateToEnglish(text, language).trim();
  
  // Try each pattern
  for (const cmdPattern of COMMAND_PATTERNS) {
    for (const pattern of cmdPattern.patterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        const params = cmdPattern.extractParams ? cmdPattern.extractParams(match, normalizedText) : {};
        return {
          intent: cmdPattern.intent,
          action: cmdPattern.intent.replace(/_/g, ' '),
          target: params.target,
          value: params.value,
          rawText: text,
          confidence: 0.85,
        };
      }
    }
  }

  return {
    intent: 'unknown',
    action: 'unknown',
    rawText: text,
    confidence: 0.0,
  };
}

export function getWebsiteUrl(name: string): string | null {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Check direct match
  if (WEBSITE_MAP[normalized]) return WEBSITE_MAP[normalized];
  
  // Check partial match
  for (const [key, url] of Object.entries(WEBSITE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return url;
  }
  
  // If it looks like a domain, add https
  if (normalized.includes('.') || name.includes('.')) {
    const domain = name.trim().replace(/\s+/g, '');
    if (!domain.startsWith('http')) return `https://${domain}`;
    return domain;
  }
  
  return null;
}

export function getScrollAmount(intensity: string = 'normal'): number {
  switch (intensity) {
    case 'little':
    case 'bit':
      return 200;
    case 'lot':
    case 'more':
      return 800;
    default:
      return 400;
  }
}

export function buildSearchUrl(query: string, engine: string = 'google'): string {
  const encodedQuery = encodeURIComponent(query);
  switch (engine.toLowerCase()) {
    case 'youtube':
      return `https://www.youtube.com/results?search_query=${encodedQuery}`;
    case 'bing':
      return `https://www.bing.com/search?q=${encodedQuery}`;
    default:
      return `https://www.google.com/search?q=${encodedQuery}`;
  }
}
