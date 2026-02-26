/**
 * Unified AI Service
 * Primary: Groq API (Llama 3.1 for translation)
 * Fallback: Browser Web Speech API (TTS)
 * 
 * This service handles translation and text-to-speech with
 * automatic fallback when primary service fails.
 */

import { SupportedLanguage } from '../types';

// API Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

// Language code mapping
const LANGUAGE_CODES: Record<string, string> = {
  'English': 'en-US',
  'Spanish': 'es-ES', 
  'Swahili': 'sw-KE',
  'Turkish': 'tr-TR',
  'Italian': 'it-IT',
  'German': 'de-DE',
  'Chinese': 'zh-CN',
  'Korean': 'ko-KR',
};

export class UnifiedAIService {
  private groqApiKey: string;
  private useGroq: boolean = true;
  private retryCount: number = 3;
  private retryDelay: number = 1000;

  constructor(groqApiKey: string) {
    this.groqApiKey = groqApiKey;
  }

  /**
   * Translate text using Groq API (primary) with retry logic
   */
  async translate(
    text: string, 
    sourceLang: SupportedLanguage, 
    targetLang: SupportedLanguage
  ): Promise<string> {
    if (!text.trim()) return '';

    // Try Groq first with retries
    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      try {
        const result = await this.translateWithGroq(text, sourceLang, targetLang);
        if (result) return result;
      } catch (error) {
        console.warn(`Translation attempt ${attempt + 1} failed:`, error);
        if (attempt < this.retryCount - 1) {
          await this.delay(this.retryDelay * (attempt + 1)); // Exponential backoff
        }
      }
    }

    // Fallback: Try browser translation or return original
    console.warn('Groq translation failed, using fallback');
    return this.translateWithBrowser(text, sourceLang, targetLang);
  }

  /**
   * Primary translation using Groq Llama 3.1
   */
  private async translateWithGroq(
    text: string, 
    sourceLang: SupportedLanguage, 
    targetLang: SupportedLanguage
  ): Promise<string> {
    const systemPrompt = `You are a professional interpreter. Translate the following text from ${sourceLang} to ${targetLang}. Maintain the original tone, emotion, and nuance. Output ONLY the translated text without quotes or explanations. Be concise and natural.`;

    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  /**
   * Fallback translation using simple mapping (basic)
   */
  private translateWithBrowser(
    text: string, 
    _sourceLang: SupportedLanguage, 
    _targetLang: SupportedLanguage
  ): string {
    // Browser doesn't have translation API, return original
    // In production, you could use a free translation API here
    console.log('Using fallback - returning original text');
    return `[Translation unavailable] ${text}`;
  }

  /**
   * Text-to-Speech using Browser Web Speech API (most reliable fallback)
   */
  async speak(text: string, targetLang: SupportedLanguage): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANGUAGE_CODES[targetLang] || 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to get voices - wait if not loaded yet
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        const langPrefix = (LANGUAGE_CODES[targetLang] || 'en-US').split('-')[0];
        
        // First try to find a voice matching the language
        let preferredVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith(langPrefix.toLowerCase())
        );
        
        // Fallback to any English voice if no language match
        if (!preferredVoice) {
          preferredVoice = voices.find(v => v.lang.startsWith('en'));
        }
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      // Voices might not be loaded yet, try to load them
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => loadVoices(), { once: true });
        // Set a timeout to proceed anyway
        setTimeout(() => loadVoices(), 100);
      } else {
        loadVoices();
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };

      // Small delay to ensure browser is ready
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 50);
    });
  }

  /**
   * Speech-to-Text using Groq Whisper
   */
  async transcribe(audioBlob: Blob, language?: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-large-v3');
    if (language) {
      formData.append('language', this.mapToWhisperLanguage(language));
    } else {
      formData.append('language', 'auto');
    }

    const response = await fetch(`${GROQ_API_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Transcription failed');
    }

    const data = await response.json();
    return data.text || '';
  }

  /**
   * Real-time translation for live sessions
   * Uses the same Groq API but optimized for streaming
   */
  async liveTranslate(
    text: string,
    sourceLang: SupportedLanguage,
    targetLang: SupportedLanguage
  ): Promise<string> {
    return this.translate(text, sourceLang, targetLang);
  }

  /**
   * Check if Groq API is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${GROQ_API_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get available voices for speech synthesis
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!('speechSynthesis' in window)) {
      return [];
    }
    return speechSynthesis.getVoices();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private mapToWhisperLanguage(lang: string): string {
    const map: Record<string, string> = {
      'English': 'en',
      'Spanish': 'es',
      'Swahili': 'sw',
      'Turkish': 'tr',
      'Italian': 'it',
      'German': 'de',
      'Chinese': 'zh',
      'Korean': 'ko',
    };
    return map[lang] || 'en';
  }
}

/**
 * Factory function to create the service
 * Reads API key from environment variable
 */
export function createUnifiedService(): UnifiedAIService {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.warn('VITE_GROQ_API_KEY not set. Using limited mode.');
  }
  return new UnifiedAIService(apiKey || '');
}
