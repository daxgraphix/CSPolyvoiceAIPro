
export enum SupportedLanguage {
  English = 'English',
  Spanish = 'Spanish',
  Swahili = 'Swahili',
  Turkish = 'Turkish',
  Italian = 'Italian',
  German = 'German',
  Chinese = 'Mandarin Chinese'
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isFinal?: boolean;
}

export interface VoiceProfile {
  id: string;
  name: string;
  isCloned: boolean;
  baseVoiceName: string; 
  description: string;
  tags: string[];
}

export type ViewState = 'splash' | 'onboarding' | 'translate' | 'cloning' | 'history' | 'settings';

export type SpeechRate = 0.8 | 1.0 | 1.25;

export type AppTheme = 'dark' | 'light';

export interface AppState {
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  selectedVoiceId: string;
  clonedVoices: VoiceProfile[];
  speechRate: SpeechRate;
  theme: AppTheme;
  isMuted: boolean;
}

export interface ToastState {
  id: string;
  message: string;
  type: 'error' | 'info' | 'success';
}
