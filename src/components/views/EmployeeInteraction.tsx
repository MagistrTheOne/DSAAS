import { useState, useRef, useEffect } from 'react';
import { Employee } from '../../types';
import { ArrowLeft, Send, Mic, Volume2, Square, ShieldCheck, FileText } from 'lucide-react';
import { generateChatResponse, generateSpeech, getGeminiClient } from '../../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';

interface EmployeeInteractionProps {
  employee: Employee;
  onBack: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function EmployeeInteraction({ employee, onBack }: EmployeeInteractionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const systemInstruction = `You are ${employee.name}, a digital employee working as a ${employee.profession} in the ${employee.department || 'General'} department. Your skills include: ${employee.skills.join(', ')}. ${employee.complianceMode ? 'STRICT COMPLIANCE MODE ENABLED: You must ONLY answer based on the provided knowledge base. Do not hallucinate or provide information outside of your instructions.' : ''} ${employee.knowledgeBase?.length ? `Your knowledge base includes: ${employee.knowledgeBase.join(', ')}.` : ''} Respond professionally and concisely.`;
      const response = await generateChatResponse(userMsg, systemInstruction);
      
      if (response) {
        setMessages(prev => [...prev, { role: 'ai', content: response }]);
        
        // Auto-play TTS
        try {
          const audioBase64 = await generateSpeech(response, employee.voiceName);
          if (audioBase64) {
            const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
            audio.play();
          }
        } catch (e) {
          console.error("TTS Error:", e);
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I encountered an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLiveSession = async () => {
    if (isLive) {
      sessionRef.current?.close();
      setIsLive(false);
      return;
    }

    try {
      const ai = getGeminiClient();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      setAudioContext(ctx);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(ctx.destination);

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: employee.voiceName } },
          },
          systemInstruction: `You are ${employee.name}, a digital employee working as a ${employee.profession} in the ${employee.department || 'General'} department. Your skills include: ${employee.skills.join(', ')}. ${employee.complianceMode ? 'STRICT COMPLIANCE MODE ENABLED: You must ONLY answer based on the provided knowledge base. Do not hallucinate or provide information outside of your instructions.' : ''} ${employee.knowledgeBase?.length ? `Your knowledge base includes: ${employee.knowledgeBase.join(', ')}.` : ''} Respond professionally and concisely.`,
        },
        callbacks: {
          onopen: () => {
            setIsLive(true);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
              }
              
              const buffer = new ArrayBuffer(pcm16.length * 2);
              const view = new DataView(buffer);
              for (let i = 0; i < pcm16.length; i++) {
                view.setInt16(i * 2, pcm16[i], true);
              }
              
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
              
              sessionPromise.then((session) =>
                session.sendRealtimeInput({
                  media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                })
              );
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && ctx) {
              const binaryString = atob(base64Audio);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start();
            }
          },
          onclose: () => {
            setIsLive(false);
            processor.disconnect();
            source.disconnect();
            stream.getTracks().forEach(t => t.stop());
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            setIsLive(false);
          }
        }
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (error) {
      console.error("Failed to start live session:", error);
      setIsLive(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <header className="flex items-center gap-4 p-6 border-b border-white/5 bg-[#050505]">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex items-center gap-4">
          <img src={employee.avatarUrl} alt={employee.name} className="w-12 h-12 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium text-white">{employee.name}</h2>
              {employee.complianceMode && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider border border-emerald-500/20">
                  <ShieldCheck size={12} />
                  Strict Compliance
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              {employee.profession} {employee.department && `• ${employee.department}`}
              {employee.knowledgeBase && employee.knowledgeBase.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="flex items-center gap-1 text-zinc-400">
                    <FileText size={12} />
                    {employee.knowledgeBase.length} docs
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right mr-4">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Economic Swarm</div>
            <div className="text-sm font-mono text-emerald-400">${employee.economicSwarm.toLocaleString()}</div>
          </div>
          <button 
            onClick={toggleLiveSession}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isLive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isLive ? <Square size={16} /> : <Mic size={16} />}
            {isLive ? 'End Live Voice' : 'Start Live Voice'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <Volume2 size={48} className="mb-4 opacity-20" />
            <p>Start a conversation with {employee.name}</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-white text-black rounded-br-none' 
                : 'bg-[#1a1a1a] text-white border border-white/10 rounded-bl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl rounded-bl-none flex gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-[#050505] border-t border-white/5">
        <div className="relative max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${employee.name}...`}
            className="w-full bg-[#111] border border-white/10 rounded-full py-4 pl-6 pr-16 text-white focus:outline-none focus:border-white/30 transition-colors"
            disabled={isLive}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isLive}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
