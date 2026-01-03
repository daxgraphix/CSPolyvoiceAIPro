import { GoogleGenAI, Modality } from '@google/genai';

export class TranslationService {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional interpreter. Translate the following text from ${sourceLang} to ${targetLang}. Maintain the original tone and nuance. Output ONLY the translated text without quotes or explanations.\n\nText: "${text}"`,
      });
      return response.text || '';
    } catch (error) {
      console.error('Translation error:', error);
      return '';
    }
  }

  async speak(text: string, voiceName: string): Promise<Uint8Array | null> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });
      
      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64) return null;
      
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.error('TTS error:', error);
      return null;
    }
  }
}