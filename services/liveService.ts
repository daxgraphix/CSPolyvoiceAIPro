import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';
import { SupportedLanguage } from '../types';

interface ConnectOptions {
  apiKey: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  voiceName: string;
  onOpen: () => void;
  onMessage: (message: LiveServerMessage) => void;
  onClose: (event: CloseEvent) => void;
  onError: (event: ErrorEvent) => void;
}

export class LiveService {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async connect({
    sourceLang,
    targetLang,
    voiceName,
    onOpen,
    onMessage,
    onClose,
    onError,
  }: ConnectOptions) {
    const session = await this.client.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: onOpen,
        onmessage: onMessage,
        onclose: onClose,
        onerror: onError,
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION(sourceLang, targetLang),
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName,
            },
          },
        },
        inputAudioTranscription: {}, 
        outputAudioTranscription: {},
      },
    });

    return session;
  }
}