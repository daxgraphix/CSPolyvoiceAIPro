import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, StopCircle, Settings, History, Activity, Play, Plus, Keyboard, Send, AudioWaveform, Volume2, X, VolumeX, Sun, Moon, ChevronRight, ChevronLeft, Fingerprint, Wifi, WifiOff } from 'lucide-react';
import { LiveService } from './services/liveService';
import { TranslationService } from './services/translationService';
import { createPcmBlob, base64ToUint8Array, decodeAudioData } from './utils/audio';
import { LanguageSelector } from './components/LanguageSelector';
import { ChatInterface } from './components/ChatInterface';
import { Waveform } from './components/Waveform';
import { VoiceCloning } from './components/VoiceCloning';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { HistoryView } from './components/HistoryView';
import { Toast } from './components/Toast';
import { Message, SupportedLanguage, ViewState, AppState, ToastState } from './types';
import { DEFAULT_VOICES } from './constants';
import { LiveServerMessage } from '@google/genai';

const API_KEY = process.env.API_KEY || '';

const App: React.FC = () => {
  // Application State
  const [view, setView] = useState<ViewState>('splash');
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isConnected, setIsConnected] = useState(true); // Network status simulation
  
  // Real-time HUD state
  const [realtimeTranscript, setRealtimeTranscript] = useState<string>('');

  const [appState, setAppState] = useState<AppState>({
    sourceLang: SupportedLanguage.English,
    targetLang: SupportedLanguage.Spanish,
    selectedVoiceId: DEFAULT_VOICES[0].id,
    clonedVoices: [],
    speechRate: 1.0,
    theme: 'dark',
    isMuted: false,
  });

  // Services
  const liveService = useRef<LiveService | null>(null);
  const translationService = useRef<TranslationService | null>(null);
  
  // Audio Refs
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // Initialize Services & Load Data
  useEffect(() => {
    if (!API_KEY) {
      console.warn("API Key is missing");
      showToast("System Alert: API Key not detected.", 'error');
    }
    liveService.current = new LiveService(API_KEY);
    translationService.current = new TranslationService(API_KEY);
    
    // Offline/Online listeners
    window.addEventListener('online', () => setIsConnected(true));
    window.addEventListener('offline', () => setIsConnected(false));
    
    // Load history
    try {
      const savedHistory = localStorage.getItem('cs_polyvoice_history');
      if (savedHistory) {
        // Hydrate dates
        const parsed = JSON.parse(savedHistory).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(parsed);
      }
      
      // Load Settings
      const savedSettings = localStorage.getItem('cs_polyvoice_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setAppState(prev => ({
          ...prev,
          ...parsedSettings
        }));
      }
    } catch (e) {
      console.error("Failed to load local data", e);
    }

    return () => {
      stopSession();
      window.removeEventListener('online', () => setIsConnected(true));
      window.removeEventListener('offline', () => setIsConnected(false));
    };
  }, []);

  // Persist History
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('cs_polyvoice_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Persist Settings & Apply Theme
  useEffect(() => {
    localStorage.setItem('cs_polyvoice_settings', JSON.stringify(appState));
    
    // Apply Theme
    document.documentElement.setAttribute('data-theme', appState.theme);
  }, [appState]);

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  const getSelectedVoice = useCallback(() => {
    const all = [...DEFAULT_VOICES, ...appState.clonedVoices];
    return all.find(v => v.id === appState.selectedVoiceId) || DEFAULT_VOICES[0];
  }, [appState.clonedVoices, appState.selectedVoiceId]);

  // --- Audio Utilities ---

  const playText = async (text: string, voiceOverride?: string) => {
    if (appState.isMuted) {
      showToast("Sound is muted", 'info');
      return;
    }
    if (!translationService.current || !text.trim()) return;
    
    try {
      const voice = voiceOverride 
        ? { baseVoiceName: voiceOverride } // Temporary object for override
        : getSelectedVoice();
        
      const audioBytes = await translationService.current.speak(text, voice.baseVoiceName);
      if (audioBytes) {
        await playOneShotAudio(audioBytes);
      } else {
        showToast("Unable to generate speech for this text.", 'error');
      }
    } catch (e) {
      showToast("TTS Playback Failed", 'error');
    }
  };

  const playOneShotAudio = async (bytes: Uint8Array) => {
    if (appState.isMuted) return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(bytes, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = appState.speechRate;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      console.error("Audio Decode/Play Error", e);
      showToast("Audio playback error", 'error');
    }
  };

  // --- Voice Mode Logic ---

  const startSession = async () => {
    if (!liveService.current || isActive) return;

    if (!API_KEY) {
      showToast("Configuration Error: API Key missing.", 'error');
      return;
    }

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      audioContextRef.current = audioCtx;
      nextStartTimeRef.current = audioCtx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      }});

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      sourceNodeRef.current = source;
      processorRef.current = processor;

      const voice = getSelectedVoice();

      const session = await liveService.current.connect({
        apiKey: API_KEY,
        sourceLang: appState.sourceLang,
        targetLang: appState.targetLang,
        voiceName: voice.baseVoiceName,
        onOpen: () => {
          setIsActive(true);
          showToast("Live Uplink Established", 'success');
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onMessage: handleServerMessage,
        onClose: () => {
          setIsActive(false);
          stopAudioProcessing();
          setRealtimeTranscript('');
          showToast("Uplink Closed", 'info');
        },
        onError: (e) => {
          console.error("Session error event:", e);
          setIsActive(false);
          stopAudioProcessing();
          setRealtimeTranscript('');
          let msg = "Connection interrupted";
          if (e instanceof Error) {
            msg = e.message;
          } else if ((e as any).error?.message) {
            msg = (e as any).error.message;
          }
          showToast(msg, 'error');
        }
      });

      sessionRef.current = session;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const blob = createPcmBlob(inputData);
        session.sendRealtimeInput({ media: blob });
      };

    } catch (err: any) {
      console.error("Failed to start session:", err);
      stopAudioProcessing();
      
      let errorMessage = "Microphone access denied or hardware error";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      if (errorMessage.toLowerCase().includes("unavailable")) {
         errorMessage = "Service temporarily unavailable. Please try again later.";
      } else if (errorMessage.toLowerCase().includes("permission")) {
         errorMessage = "Microphone permission required.";
      }
      
      showToast(errorMessage, 'error');
    }
  };

  const stopSession = () => {
    sessionRef.current = null;
    stopAudioProcessing();
    setIsActive(false);
    setRealtimeTranscript('');
  };

  const stopAudioProcessing = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const handleServerMessage = async (message: LiveServerMessage) => {
    try {
      const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
      if (audioData && audioContextRef.current && !appState.isMuted) {
        const ctx = audioContextRef.current;
        const audioBytes = base64ToUint8Array(audioData);
        const audioBuffer = await decodeAudioData(audioBytes, ctx);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = appState.speechRate;
        
        source.connect(ctx.destination);
        
        const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
        source.start(startTime);
        nextStartTimeRef.current = startTime + (audioBuffer.duration / appState.speechRate);
      }

      const serverContent = message.serverContent;
      if (serverContent) {
          if (serverContent.inputTranscription?.text) {
              const text = serverContent.inputTranscription.text;
              addOrUpdateMessage('user', text, false);
              setRealtimeTranscript(prev => prev + text);
          }
          if (serverContent.outputTranscription?.text) {
              addOrUpdateMessage('model', serverContent.outputTranscription.text, false);
          }
          
          if (serverContent.turnComplete) {
              setRealtimeTranscript(''); 
              setMessages(prev => {
                  const newMsgs = [...prev];
                  if (newMsgs.length > 0) {
                      newMsgs[newMsgs.length - 1].isFinal = true;
                  }
                  return newMsgs;
              });
          }
      }
    } catch(e) {
      console.error("Stream processing error", e);
    }
  };

  // --- Text Mode Logic ---

  const handleTextSubmit = async () => {
    if (!inputText.trim() || !translationService.current) return;
    
    const textToTranslate = inputText;
    setInputText('');
    setIsTranslating(true);

    addOrUpdateMessage('user', textToTranslate, true);

    try {
      const translatedText = await translationService.current.translate(
        textToTranslate,
        appState.sourceLang,
        appState.targetLang
      );

      addOrUpdateMessage('model', translatedText, true);

      // Speak if not muted
      if (!appState.isMuted) {
          const voice = getSelectedVoice();
          const audioBytes = await translationService.current.speak(translatedText, voice.baseVoiceName);
          
          if (audioBytes) {
             playOneShotAudio(audioBytes);
          }
      }

    } catch (e) {
      console.error(e);
      showToast("Translation failed. Please try again.", 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  // --- Helpers ---

  const addOrUpdateMessage = (role: 'user' | 'model', text: string, isFinal = false) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last && last.role === role && !last.isFinal) {
        return [...prev.slice(0, -1), { ...last, text: last.text + text, isFinal }];
      }
      return [...prev, {
        id: Date.now().toString(),
        role,
        text,
        timestamp: new Date(),
        isFinal
      }];
    });
  };

  const toggleActive = () => {
    if (isActive) stopSession();
    else startSession();
  };

  // --- Sub-Views ---

  const renderSettings = () => (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative z-20 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surface/80 backdrop-blur-md">
         <button onClick={() => setView('translate')} className="p-2 -ml-2 rounded-full text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold tracking-tight text-white uppercase">Configuration</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth no-scrollbar">
          {/* General Controls */}
          <div>
            <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Interface & Audio
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setAppState(p => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-surface/50 hover:bg-surfaceHighlight transition-all group"
              >
                <span className="text-sm font-semibold text-white">Theme</span>
                {appState.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary group-hover:text-primaryGlow transition-colors" />
                ) : (
                  <Sun className="w-5 h-5 text-accent group-hover:text-accentGlow transition-colors" />
                )}
              </button>

              <button 
                onClick={() => setAppState(p => ({ ...p, isMuted: !p.isMuted }))}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${appState.isMuted ? 'bg-danger/10 border-danger/50' : 'border-white/5 bg-surface/50 hover:bg-surfaceHighlight'}`}
              >
                <span className={`text-sm font-semibold ${appState.isMuted ? 'text-danger' : 'text-white'}`}>Sound</span>
                {appState.isMuted ? (
                  <VolumeX className="w-5 h-5 text-danger" />
                ) : (
                  <Volume2 className="w-5 h-5 text-success group-hover:text-green-400" />
                )}
              </button>
            </div>
          </div>

          {/* Speed Control */}
          <div>
             <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Neural Playback Rate
             </h3>
             <div className="glass-panel p-1 rounded-xl flex items-center bg-black/20">
               {[0.8, 1.0, 1.25].map(rate => (
                 <button
                   key={rate}
                   onClick={() => setAppState(p => ({ ...p, speechRate: rate as any }))}
                   className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${appState.speechRate === rate ? 'bg-white/10 text-white shadow-md border border-white/5' : 'text-slate-500 hover:text-white'}`}
                 >
                   {rate === 1.0 ? 'Normal' : `${rate}x`}
                 </button>
               ))}
             </div>
          </div>

          {/* Voice Engine - Vertical List */}
          <div className="pb-24">
              <h3 className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> Voice Neural Profiles
              </h3>
              <div className="space-y-3">
                  {[...DEFAULT_VOICES, ...appState.clonedVoices].map(voice => (
                      <div 
                         key={voice.id}
                         onClick={() => setAppState(prev => ({ ...prev, selectedVoiceId: voice.id }))}
                         className={`relative p-4 rounded-xl border transition-all cursor-pointer group overflow-hidden ${
                           appState.selectedVoiceId === voice.id 
                           ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                           : 'bg-surface/50 border-white/5 hover:border-white/20'
                         }`}
                      >
                          <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border border-white/10 ${voice.isCloned ? 'bg-accent/10 text-accent' : 'bg-surfaceHighlight text-slate-300'}`}>
                                      {voice.name.charAt(0)}
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2">
                                          <span className={`font-semibold text-sm ${voice.isCloned ? 'text-accent' : 'text-white'}`}>{voice.name}</span>
                                          {voice.isCloned && <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 tracking-wider">CLONE</span>}
                                      </div>
                                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-[180px] line-clamp-1">{voice.description}</p>
                                  </div>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); playText("Voice synthesis test complete.", voice.baseVoiceName); }}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
                              >
                                  <Play className="w-3.5 h-3.5" />
                              </button>
                          </div>
                      </div>
                  ))}
                  
                  <button 
                      onClick={() => setView('cloning')}
                      className="w-full py-4 border border-dashed border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group mt-6"
                  >
                      <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs">INITIALIZE NEW CLONE</span>
                  </button>
              </div>
          </div>
      </div>
    </div>
  );

  // --- Main Render ---

  if (view === 'splash') {
    return <SplashScreen onComplete={() => setView('onboarding')} />;
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={() => setView('translate')} />;
  }

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden touch-none">
      
      {/* Main App Container - Full Screen Mobile / Phone Frame Desktop */}
      <div 
        className="relative z-10 w-full h-[100dvh] sm:h-[90vh] sm:max-w-[420px] bg-background/90 sm:rounded-[2.5rem] sm:border sm:border-white/10 sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden flex flex-col transition-all duration-300 ring-1 ring-white/5"
      >
        
        {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}

        {/* Dynamic Views */}
        {view === 'cloning' ? (
          <VoiceCloning 
            onCancel={() => setView('settings')}
            onCloneCreate={(profile) => {
              setAppState(prev => ({
                ...prev,
                clonedVoices: [...prev.clonedVoices, profile],
                selectedVoiceId: profile.id
              }));
              setView('settings');
              showToast("Voice Clone Created", 'success');
            }}
            onPreview={(baseVoice) => {
              playText("Hello, this is a preview of my personal voice.", baseVoice);
            }}
          />
        ) : view === 'history' ? (
           <HistoryView 
             history={messages}
             onBack={() => setView('translate')}
             onClear={() => {
                setMessages([]);
                localStorage.removeItem('cs_polyvoice_history');
                showToast("Memory Purged", 'info');
             }}
             onPlay={(text) => playText(text)}
           />
        ) : view === 'settings' ? (
           renderSettings()
        ) : (
          <>
            {/* Enterprise Header */}
            <header className="px-6 py-5 flex items-center justify-between z-20 bg-background/60 backdrop-blur-xl border-b border-white/5 shrink-0">
               <button 
                  onClick={() => setView('history')}
                  className="p-2.5 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <History className="w-5 h-5" />
                </button>
              
              <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold tracking-wide text-white">CS PolyVoice</span>
                    <span className="px-1.5 py-0.5 bg-primary/20 text-primaryGlow text-[8px] font-mono rounded border border-primary/20">PRO</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success shadow-[0_0_5px_#10b981]' : 'bg-danger'}`}></div>
                    <span className="text-[9px] text-slate-500 font-mono tracking-wider">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
                  </div>
              </div>
              
              <button 
                onClick={() => setView('settings')}
                className="p-2.5 -mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <div className="px-4 py-3 z-10 shrink-0">
                  <LanguageSelector 
                    source={appState.sourceLang}
                    target={appState.targetLang}
                    onSourceChange={(l) => setAppState(p => ({ ...p, sourceLang: l }))}
                    onTargetChange={(l) => setAppState(p => ({ ...p, targetLang: l }))}
                    onSwap={() => setAppState(p => ({ ...p, sourceLang: p.targetLang, targetLang: p.sourceLang }))}
                    disabled={isActive}
                  />
                </div>

                {/* Chat Area */}
                <ChatInterface messages={messages} onPlay={(text) => playText(text)} />

                {/* Bottom Dock */}
                <div className="relative z-20 shrink-0">
                   
                   {/* Mode Switcher Floating Pill */}
                   <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-xl">
                       <button 
                         onClick={() => !isActive && setInputMode('voice')}
                         className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${inputMode === 'voice' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                       >
                         <AudioWaveform className="w-4 h-4" />
                         <span className="text-xs font-bold">Voice</span>
                       </button>
                       <button 
                         onClick={() => !isActive && setInputMode('text')}
                         className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${inputMode === 'text' ? 'bg-surfaceHighlight text-white shadow-lg border border-white/5' : 'text-slate-400 hover:text-white'}`}
                       >
                         <Keyboard className="w-4 h-4" />
                         <span className="text-xs font-bold">Text</span>
                       </button>
                   </div>

                   {/* Controls Container */}
                   <div className="px-6 pb-8 pt-6 bg-surface/90 backdrop-blur-2xl border-t border-white/5 rounded-t-[2rem] shadow-[0_-10px_60px_rgba(0,0,0,0.7)]">
                     
                     {inputMode === 'voice' ? (
                       <div className="flex flex-col items-center gap-6">
                         
                         {/* Live Transcript Overlay */}
                         {isActive && realtimeTranscript && (
                           <div className="absolute -top-32 w-full px-6 pointer-events-none">
                             <div className="glass-panel p-4 rounded-xl border-l-2 border-l-accent animate-in fade-in slide-in-from-bottom-2 bg-black/60">
                               <p className="font-mono text-[10px] text-accent mb-1 uppercase tracking-widest opacity-80">Incoming Stream</p>
                               <p className="text-white text-sm leading-relaxed line-clamp-2 font-medium">
                                 {realtimeTranscript}
                                 <span className="inline-block w-1.5 h-3 ml-1 bg-accent animate-pulse"></span>
                               </p>
                             </div>
                           </div>
                         )}

                         <div className="w-full">
                            <Waveform active={isActive} />
                         </div>
                         
                         <div className="flex items-center gap-8 w-full justify-center">
                           <button
                             onClick={toggleActive}
                             className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group ${
                               isActive 
                                 ? 'bg-danger shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-100 rotate-180' 
                                 : 'bg-white shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]'
                             }`}
                           >
                             {isActive ? (
                               <X className="w-8 h-8 text-white" strokeWidth={3} />
                             ) : (
                               <Mic className="w-8 h-8 text-black" strokeWidth={2.5} />
                             )}
                           </button>
                         </div>
                         
                         <p className="font-mono text-[9px] text-slate-500 tracking-[0.25em] uppercase opacity-70">
                           {isActive ? <span className="text-danger animate-pulse flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-danger"></span>LIVE UPLINK ACTIVE</span> : 'TAP TO TRANSMIT'}
                         </p>
                       </div>
                     ) : (
                       <div className="flex flex-col gap-3 animate-fade-in">
                         <div className="relative group">
                           <textarea
                             value={inputText}
                             onChange={(e) => setInputText(e.target.value)}
                             placeholder={`Type in ${appState.sourceLang}...`}
                             className="w-full bg-black/20 border border-slate-700/50 rounded-2xl p-4 pr-14 text-white placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:bg-black/40 transition-all h-32 resize-none leading-relaxed text-sm"
                             onKeyDown={(e) => {
                               if(e.key === 'Enter' && !e.shiftKey) {
                                 e.preventDefault();
                                 handleTextSubmit();
                               }
                             }}
                           />
                           <div className="absolute right-3 bottom-3 flex gap-2">
                             <button 
                               onClick={handleTextSubmit}
                               disabled={!inputText.trim() || isTranslating}
                               className="p-2.5 bg-accent text-black rounded-xl hover:bg-accentGlow disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/10"
                             >
                               {isTranslating ? <Activity className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                             </button>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                </div>
              </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;