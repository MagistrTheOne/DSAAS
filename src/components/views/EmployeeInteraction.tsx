import { useState, useRef, useEffect } from 'react';
import { Employee } from '../../types';
import { ArrowLeft, Send, Mic, Volume2, Square, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { generateChatResponse, generateSpeech, getGeminiClient } from '../../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';

interface EmployeeInteractionProps {
  employee: Employee;
  onBack: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  id: number;
}

// ─── CSS Sphere ────────────────────────────────────────────────────────────────
function Sphere({ isLive, isStartingLive }: { isLive: boolean; isStartingLive: boolean }) {
  return (
    <>
      <style>{`
        @keyframes sphere-idle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.01); }
        }
        @keyframes sphere-pulse {
          0%, 100% { transform: translateY(0px) scale(1); box-shadow: 0 0 40px 8px rgba(52,211,153,0.25), inset -30px -30px 60px rgba(0,0,0,0.5), inset 20px 20px 40px rgba(255,255,255,0.08); }
          25%       { transform: translateY(-12px) scale(1.04); box-shadow: 0 0 80px 20px rgba(52,211,153,0.45), inset -30px -30px 60px rgba(0,0,0,0.5), inset 20px 20px 40px rgba(255,255,255,0.12); }
          75%       { transform: translateY(-4px) scale(0.97); box-shadow: 0 0 30px 4px rgba(52,211,153,0.15), inset -30px -30px 60px rgba(0,0,0,0.5), inset 20px 20px 40px rgba(255,255,255,0.06); }
        }
        @keyframes ring-rotate     { from { transform: rotateX(75deg) rotateZ(0deg);    } to { transform: rotateX(75deg) rotateZ(360deg);  } }
        @keyframes ring-rotate-rev { from { transform: rotateX(75deg) rotateZ(0deg);    } to { transform: rotateX(75deg) rotateZ(-360deg); } }
        @keyframes dot-orbit     { from { transform: rotate(0deg) translateX(72px) rotate(0deg);    } to { transform: rotate(360deg) translateX(72px) rotate(-360deg);  } }
        @keyframes dot-orbit-rev { from { transform: rotate(0deg) translateX(56px) rotate(0deg);    } to { transform: rotate(-360deg) translateX(56px) rotate(360deg); } }
        @keyframes shimmer-sweep {
          0%   { opacity: 0.0; transform: translateX(-100%) translateY(-100%) rotate(30deg); }
          30%  { opacity: 0.6; }
          60%  { opacity: 0.3; }
          100% { opacity: 0.0; transform: translateX(100%) translateY(100%) rotate(30deg); }
        }
        @keyframes starting-ping {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .sphere-idle  { animation: sphere-idle  4s ease-in-out infinite; }
        .sphere-live  { animation: sphere-pulse 1.6s ease-in-out infinite; }
        .ring-1 { animation: ring-rotate     6s linear infinite; }
        .ring-2 { animation: ring-rotate-rev 9s linear infinite; }
        .dot-1  { animation: dot-orbit     3s linear infinite; }
        .dot-2  { animation: dot-orbit-rev 5s linear infinite; }
        .shimmer{ animation: shimmer-sweep 3.5s ease-in-out infinite; }
        .ping-ring { animation: starting-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>

      <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
        {/* Ping rings when starting */}
        {isStartingLive && (
          <>
            <div className="ping-ring absolute rounded-full border border-emerald-400/40" style={{ width: 140, height: 140 }} />
            <div className="ping-ring absolute rounded-full border border-emerald-400/20" style={{ width: 140, height: 140, animationDelay: '0.4s' }} />
          </>
        )}

        {/* Orbit rings */}
        {isLive && (
          <div className="absolute" style={{ width: 160, height: 160 }}>
            <div className="ring-1 absolute inset-0 rounded-full border border-emerald-400/30" />
            <div className="ring-2 absolute inset-4 rounded-full border border-emerald-300/20" />
          </div>
        )}

        {/* Orbital dots */}
        {isLive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="dot-1 absolute w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px 2px rgba(52,211,153,0.8)' }} />
            <div className="dot-2 absolute w-1.5 h-1.5 rounded-full bg-emerald-300" style={{ boxShadow: '0 0 6px 2px rgba(110,231,183,0.6)' }} />
          </div>
        )}

        {/* Main sphere */}
        <div
          className={`relative rounded-full ${isLive ? 'sphere-live' : 'sphere-idle'}`}
          style={{
            width: 120, height: 120,
            background: isLive
              ? 'radial-gradient(circle at 35% 35%, rgba(110,231,183,0.25) 0%, rgba(16,185,129,0.15) 40%, rgba(4,120,87,0.08) 100%)'
              : 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12) 0%, rgba(120,120,140,0.06) 50%, rgba(20,20,30,0.04) 100%)',
            boxShadow: isLive
              ? '0 0 40px 8px rgba(52,211,153,0.25), inset -30px -30px 60px rgba(0,0,0,0.5), inset 20px 20px 40px rgba(255,255,255,0.08)'
              : '0 0 20px 4px rgba(255,255,255,0.04), inset -30px -30px 60px rgba(0,0,0,0.6), inset 20px 20px 40px rgba(255,255,255,0.06)',
            border: isLive ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(255,255,255,0.08)',
            transition: 'border-color 0.5s, background 0.5s',
          }}
        >
          {/* Glass shimmer */}
          <div
            className="shimmer absolute inset-0 rounded-full overflow-hidden"
            style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', mixBlendMode: 'overlay' }}
          />
          {/* Specular highlight */}
          <div
            className="absolute"
            style={{ top: '18%', left: '22%', width: '28%', height: '18%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 100%)', filter: 'blur(3px)' }}
          />
          {isLive && (
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(52,211,153,0.2) 0%, transparent 70%)' }} />
          )}
        </div>

        {/* Ground shadow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: 80, height: 12, background: isLive ? 'rgba(52,211,153,0.15)' : 'rgba(0,0,0,0.3)', borderRadius: '50%', filter: 'blur(10px)', transition: 'background 0.5s' }}
        />
      </div>
    </>
  );
}

// ─── Live Voice Overlay ────────────────────────────────────────────────────────
function LiveOverlay({ isLive, isStartingLive, employee, onStop }: {
  isLive: boolean;
  isStartingLive: boolean;
  employee: Employee;
  onStop: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (isLive || isStartingLive) {
      setLeaving(false);
      setMounted(true);
    } else if (mounted) {
      setLeaving(true);
      const t = setTimeout(() => { setMounted(false); setLeaving(false); }, 500);
      return () => clearTimeout(t);
    }
  }, [isLive, isStartingLive]);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes overlay-in  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlay-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes content-in  { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes content-out { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(24px) scale(0.96); } }
        .overlay-bg   { animation: ${leaving ? 'overlay-out' : 'overlay-in'} 0.5s ease forwards; }
        .overlay-body { animation: ${leaving ? 'content-out' : 'content-in'} 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        @keyframes wave-bar { 0%, 100% { height: 4px; } 50% { height: 28px; } }
        .wave-bar { animation: wave-bar ease-in-out infinite; border-radius: 4px; }
      `}</style>

      <div
        className="overlay-bg absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ background: 'rgba(5,5,5,0.88)', backdropFilter: 'blur(16px)' }}
      >
        <div className="overlay-body flex flex-col items-center gap-8">
          <Sphere isLive={isLive} isStartingLive={isStartingLive} />

          <div className="text-center">
            <div className="text-white text-xl font-light tracking-wide mb-1">{employee.name}</div>
            <div className="text-emerald-400 text-sm tracking-widest uppercase">
              {isStartingLive ? 'Connecting…' : 'Live Voice Active'}
            </div>
          </div>

          {isLive && (
            <div className="flex items-center gap-1.5" style={{ height: 36 }}>
              {[0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 0.4, 0.7, 1.0, 0.8, 0.5].map((delay, i) => (
                <div
                  key={i}
                  className="wave-bar bg-emerald-400"
                  style={{ width: 3, animationDuration: `${0.6 + delay * 0.5}s`, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          )}

          <button
            onClick={onStop}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-all active:scale-95"
          >
            <Square size={14} />
            End Session
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function EmployeeInteraction({ employee, onBack }: EmployeeInteractionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isStartingLive, setIsStartingLive] = useState(false);
  const sessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const systemInstruction = `You are ${employee.name}, a digital employee working as a ${employee.profession} in the ${employee.department || 'General'} department. Your skills include: ${employee.skills.join(', ')}. ${employee.instructions ? `Additional system instructions: ${employee.instructions}. ` : ''}${employee.complianceMode ? 'STRICT COMPLIANCE MODE ENABLED: You must ONLY answer based on the provided knowledge base. Do not hallucinate or provide information outside of your instructions.' : ''} ${employee.knowledgeBase?.length ? `Your knowledge base includes: ${employee.knowledgeBase.join(', ')}.` : ''} Respond professionally and concisely.`;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, id: msgIdRef.current++ }]);
    setIsLoading(true);

    try {
      const response = await generateChatResponse(userMsg, systemInstruction);
      if (response) {
        setMessages(prev => [...prev, { role: 'ai', content: response, id: msgIdRef.current++ }]);
        try {
          const audioBase64 = await generateSpeech(response, employee.voiceName);
          if (audioBase64) new Audio(`data:audio/mp3;base64,${audioBase64}`).play();
        } catch (e) { console.error('TTS Error:', e); }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error processing your request.", id: msgIdRef.current++ }]);
    } finally {
      setIsLoading(false);
    }
  };

  const stopLiveSession = () => {
    sessionRef.current?.close();
    setIsLive(false);
    setIsStartingLive(false);
  };

  const toggleLiveSession = async () => {
    if (isLive || isStartingLive) { stopLiveSession(); return; }

    try {
      setIsStartingLive(true);
      const ai = getGeminiClient();
      // Микрофон — 16000 Hz (требование Gemini Live API)
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      // Воспроизведение — 24000 Hz (модель отдаёт PCM 24k)
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      const zeroGain = inputCtx.createGain();
      zeroGain.gain.value = 0;
      source.connect(processor);
      processor.connect(zeroGain);
      zeroGain.connect(inputCtx.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: employee.voiceName } } },
          systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setIsStartingLive(false);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
              const buffer = new ArrayBuffer(pcm16.length * 2);
              const view = new DataView(buffer);
              for (let i = 0; i < pcm16.length; i++) view.setInt16(i * 2, pcm16[i], true);
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' } }));
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            const inlineData = (message as any)?.serverContent?.modelTurn?.parts?.[0]?.inlineData as { data?: string; mimeType?: string } | undefined;
            const base64Audio = inlineData?.data;
            if (!base64Audio) return;
            const mimeType = inlineData?.mimeType;
            const binaryString = atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

            if (mimeType?.includes('audio/pcm')) {
              // Модель отдаёт raw PCM 24000 Hz — воспроизводим через outputCtx (24k)
              const pcm16 = new Int16Array(bytes.buffer);
              const audioBuffer = outputCtx.createBuffer(1, pcm16.length, 24000);
              const channelData = audioBuffer.getChannelData(0);
              for (let i = 0; i < pcm16.length; i++) channelData[i] = pcm16[i] / 32768;
              const src = outputCtx.createBufferSource();
              src.buffer = audioBuffer; src.connect(outputCtx.destination); src.start();
              return;
            }
            // Encoded audio — decodeAudioData сам определит rate
            const audioBuffer = await outputCtx.decodeAudioData(bytes.buffer);
            const src = outputCtx.createBufferSource();
            src.buffer = audioBuffer; src.connect(outputCtx.destination); src.start();
          },
          onclose: () => {
            setIsLive(false); setIsStartingLive(false);
            processor.disconnect(); source.disconnect();
            stream.getTracks().forEach(t => t.stop());
            inputCtx.close();
            outputCtx.close();
          },
          onerror: (e: any) => { console.error('Live API Error:', e); setIsLive(false); setIsStartingLive(false); },
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to start live session:', error);
      setIsLive(false); setIsStartingLive(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes msg-in-ai   { from { opacity:0; transform: translateX(-14px) scale(0.97); } to { opacity:1; transform: none; } }
        @keyframes msg-in-user { from { opacity:0; transform: translateX(14px) scale(0.97); } to { opacity:1; transform: none; } }
        .msg-ai   { animation: msg-in-ai   0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .msg-user { animation: msg-in-user 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity:0.4; }
          40%            { transform: scale(1.0); opacity:1; }
        }
        .bounce-dot { animation: bounce-dot 1.2s ease-in-out infinite; }
      `}</style>

      <div className="h-full flex flex-col bg-[#0a0a0a] relative overflow-hidden">
        <LiveOverlay isLive={isLive} isStartingLive={isStartingLive} employee={employee} onStop={stopLiveSession} />

        {/* Header */}
        <header className="flex items-center gap-4 p-5 border-b border-white/5 bg-[#050505] z-10">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
            <ArrowLeft size={18} className="text-white" />
          </button>

          <div className="flex items-center gap-3">
            {employee.avatarUrl.toLowerCase().endsWith('.mp4') ? (
              <video src={employee.avatarUrl} poster={employee.avatarUrl.replace(/\.mp4$/i, '.jpg')} muted playsInline autoPlay loop preload="metadata" className="w-11 h-11 rounded-full object-cover border border-white/10" />
            ) : (
              <img src={employee.avatarUrl} alt={employee.name} className="w-11 h-11 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium text-white">{employee.name}</h2>
                {employee.complianceMode && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider border border-emerald-500/20">
                    <ShieldCheck size={10} /> Compliance
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                {employee.profession}
                {employee.department && <><span className="opacity-40">•</span>{employee.department}</>}
                {employee.knowledgeBase?.length > 0 && <><span className="opacity-40">•</span><FileText size={10} />{employee.knowledgeBase.length} docs</>}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Swarm</div>
              <div className="text-sm font-mono text-emerald-400">${employee.economicSwarm.toLocaleString()}</div>
            </div>

            <button
              onClick={toggleLiveSession}
              disabled={isStartingLive}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all active:scale-95 ${
                isLive ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                : isStartingLive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed'
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {isLive && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2">
                  <span className="animate-ping absolute w-full h-full rounded-full bg-red-400 opacity-60" />
                  <span className="relative block w-2 h-2 rounded-full bg-red-400" />
                </span>
              )}
              {isLive ? <><Square size={13} /> End Voice</>
                : isStartingLive ? <><Loader2 size={13} className="animate-spin" /> Starting…</>
                : <><Mic size={13} /> Live Voice</>}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Volume2 size={32} className="text-zinc-700" />
              <p className="text-zinc-600 text-sm">Message {employee.name} to get started</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end msg-user' : 'justify-start msg-ai'}`}>
              {msg.role === 'ai' && (
                <img src={employee.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-white/8 mr-2.5 mt-1 shrink-0" />
              )}
              <div className={`max-w-[68%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white text-black rounded-br-sm'
                  : 'bg-[#161616] text-zinc-100 border border-white/6 rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start items-end gap-2.5 msg-ai">
              <img src={employee.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-white/8 shrink-0" />
              <div className="bg-[#161616] border border-white/6 px-4 py-3.5 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} className="bounce-dot w-1.5 h-1.5 rounded-full bg-zinc-500" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 bg-[#050505] border-t border-white/5">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isLive ? 'Voice session active…' : `Message ${employee.name}…`}
              disabled={isLive}
              className="w-full bg-[#111] border border-white/8 rounded-full py-3.5 pl-5 pr-14 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isLive}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white text-black rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all active:scale-90 hover:scale-105"
            >
              <Send size={15} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}