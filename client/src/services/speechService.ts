import type { SupportedLanguage } from '../types';

class SpeechService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string, language: SupportedLanguage = 'en-US', rate: number = 1, volume: number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.volume = volume;
      utterance.pitch = 1;

      // Try to find a good voice for the language
      const voices = this.synthesis.getVoices();
      const langVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
      if (langVoice) utterance.voice = langVoice;

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(event);
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  get isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }
}

export const speechService = new SpeechService();
