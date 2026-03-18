import { useState, FormEvent } from 'react';
import { Employee } from '../../types';
import { generateAvatar } from '../../services/geminiService';
import { Loader2, ImagePlus, CheckCircle2 } from 'lucide-react';

interface CreateEmployeeProps {
  onAdd: (emp: Employee) => void;
}

export function CreateEmployee({ onAdd }: CreateEmployeeProps) {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [department, setDepartment] = useState('');
  const [instructions, setInstructions] = useState('');
  const [skills, setSkills] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [complianceMode, setComplianceMode] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [avatarPrompt, setAvatarPrompt] = useState('');

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt) return;
    setIsGenerating(true);
    try {
      const url = await generateAvatar(avatarPrompt);
      setAvatarUrl(url);
    } catch (error) {
      console.error("Failed to generate avatar:", error);
      alert("Failed to generate avatar. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !profession) return;

    const newEmp: Employee = {
      id: Date.now().toString(),
      name,
      profession,
      department: department || 'General',
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      knowledgeBase: knowledgeBase.split(',').map(s => s.trim()).filter(Boolean),
      complianceMode,
      instructions: instructions.trim() || undefined,
      budgetLimit: budgetLimit ? parseInt(budgetLimit, 10) : 0,
      avatarUrl: avatarUrl || `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/400/400`,
      economicSwarm: 0,
      timeWorked: 0,
      tasksCompleted: 0,
      incomeGenerated: 0,
      voiceName: 'Puck', // Default voice
    };

    onAdd(newEmp);
  };

  return (
    <div className="p-8 h-full overflow-y-auto w-full">
      <header className="mb-12">
        <h2 className="text-3xl font-light text-white tracking-tight">Create Employee</h2>
        <p className="text-zinc-500 mt-1">Deploy a new AI agent to your workforce</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col items-center">
            <div className="w-48 h-48 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden mb-6 relative group">
              {avatarUrl ? (
                <>
                  <img src={avatarUrl} alt="Generated Avatar" className="w-full h-full object-cover" />
                  {!isGenerating && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-black p-1.5 rounded-full shadow-lg backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                      <CheckCircle2 size={20} className="text-black" />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <ImagePlus size={48} strokeWidth={1} />
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="animate-spin text-white" size={32} />
                </div>
              )}
            </div>

            <div className="w-full space-y-4">
              <label className="block text-sm font-medium text-zinc-400">Avatar Prompt (Enterprise Image Synthesis)</label>
              <textarea 
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                placeholder="A professional portrait of a futuristic CFO..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/30 h-24 resize-none"
              />
              <button 
                type="button"
                onClick={handleGenerateAvatar}
                disabled={isGenerating || !avatarPrompt}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Avatar'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Vantage"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Position</label>
                <input 
                  type="text" 
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Sales Director"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Department</label>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Finance, Legal, HR"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Monthly Budget Limit ($)</label>
                <input 
                  type="number" 
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Skills (comma separated)</label>
              <input 
                type="text" 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Lead Generation, Negotiation, CRM"
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Knowledge Base Documents (comma separated)</label>
              <input 
                type="text" 
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                placeholder="e.g. Tax Code 2026, Internal Policy v2"
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
              <input 
                type="checkbox" 
                id="complianceMode"
                checked={complianceMode}
                onChange={(e) => setComplianceMode(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-black/50 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0"
              />
              <div>
                <label htmlFor="complianceMode" className="text-sm font-medium text-white cursor-pointer block">Strict Compliance Mode (GovTech)</label>
                <p className="text-xs text-zinc-500 mt-0.5">Enforces strict grounding. The agent will only answer based on Knowledge Base documents and will not hallucinate.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">System Instructions</label>
              <textarea 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Define the behavior, tone, and specific instructions for this digital employee..."
                className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 h-48 resize-none transition-colors"
              />
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button 
                type="submit"
                className="px-8 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors"
              >
                Deploy Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
