/**
 * Browser-based Speech Recognition Service
 * Uses Web Speech API for voice input (no API key required)
 */

import { SupportedLanguage } from '../types';

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

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResult: ((text: string, isFinal: boolean) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private onEnd: (() => void) | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognitionAPI();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      if (this.onResult) {
        this.onResult(transcript, isFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) {
        this.onEnd();
      }
      // Auto-restart if still supposed to be listening
      if (this.isListening && this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      }
    };
  }

  start(
    language: SupportedLanguage,
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('Speech Recognition not supported');
      return false;
    }

    this.recognition.lang = LANGUAGE_CODES[language] || 'en-US';
    this.onResult = onResult;
    this.onError = onError || null;
    this.onEnd = onEnd || null;
    this.isListening = true;

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      this.isListening = false;
      if (onError) onError('Failed to start recognition');
      return false;
    }
  }

  stop(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  }

  get isActive(): boolean {
    return this.isListening;
  }

  static isSupported(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }
}

// Singleton instance
let speechRecognitionInstance: SpeechRecognitionService | null = null;

export function getSpeechRecognition(): SpeechRecognitionService {
  if (!speechRecognitionInstance) {
    speechRecognitionInstance = new SpeechRecognitionService();
  }
  return speechRecognitionInstance;
}
