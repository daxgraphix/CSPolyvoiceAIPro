import { SupportedLanguage, VoiceProfile } from './types';

export const LANGUAGES: SupportedLanguage[] = [
  SupportedLanguage.English,
  SupportedLanguage.Spanish,
  SupportedLanguage.Swahili,
  SupportedLanguage.Turkish,
  SupportedLanguage.Italian,
  SupportedLanguage.German,
  SupportedLanguage.Chinese,
  SupportedLanguage.Korean,
];

export const DEFAULT_VOICES: VoiceProfile[] = [
  { 
    id: 'v1', 
    name: 'Kore', 
    isCloned: false, 
    baseVoiceName: 'Kore',
    description: 'Balanced and clear, suitable for general conversation.',
    tags: ['Balanced', 'Neutral']
  },
  { 
    id: 'v2', 
    name: 'Fenrir', 
    isCloned: false, 
    baseVoiceName: 'Fenrir',
    description: 'Deep and authoritative tone for professional contexts.',
    tags: ['Deep', 'Authoritative'] 
  },
  { 
    id: 'v3', 
    name: 'Puck', 
    isCloned: false, 
    baseVoiceName: 'Puck',
    description: 'Energetic and lively, great for casual chats.',
    tags: ['Energetic', 'Lively']
  },
  { 
    id: 'v4', 
    name: 'Zephyr', 
    isCloned: false, 
    baseVoiceName: 'Zephyr',
    description: 'Calm and soothing, ideal for assistance.',
    tags: ['Calm', 'Soothing']
  },
  { 
    id: 'v5', 
    name: 'Charon', 
    isCloned: false, 
    baseVoiceName: 'Charon',
    description: 'Crisp and professional news-reader style.',
    tags: ['Professional', 'Crisp']
  },
];

export const INITIAL_SYSTEM_INSTRUCTION = (src: string, tgt: string) => `
You are a professional, real-time simultaneous interpreter. 
Your task is to translate spoken audio between ${src} and ${tgt}.
- If you hear ${src}, translate it to ${tgt}.
- If you hear ${tgt}, translate it to ${src}.
- Maintain the original tone, emotion, and nuance.
- Do not answer questions found in the text; only translate them.
- Keep translations concise and natural.
`;