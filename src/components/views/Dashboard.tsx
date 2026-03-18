import { useState } from 'react';
import { Employee } from '../../types';
import { Search, Filter, Mic, ShieldCheck, Building2 } from 'lucide-react';

interface DashboardProps {
  employees: Employee[];
  onSelect: (emp: Employee) => void;
}

export function Dashboard({ employees, onSelect }: DashboardProps) {
  const [filter, setFilter] = useState<string>('All');
  const professions = ['All', ...Array.from(new Set(employees.map(e => e.profession)))];

  const filteredEmployees = filter === 'All' 
    ? employees 
    : employees.filter(e => e.profession === filter);

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-light text-white tracking-tight">AI Digital</h2>
          <p className="text-zinc-500 mt-1">Manage your digital workforce</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors w-64"
            />
          </div>
        </div>
      </header>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {professions.map(prof => (
          <button
            key={prof}
            onClick={() => setFilter(prof)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === prof 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {prof}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8">
        {filteredEmployees.map(emp => (
          <div 
            key={emp.id} 
            onClick={() => onSelect(emp)}
            className="group relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-square relative overflow-hidden bg-zinc-900">
              <img 
                src={emp.avatarUrl} 
                alt={emp.name} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-medium text-white flex items-center gap-2">
                    {emp.name}
                    {emp.complianceMode && (
                      <ShieldCheck size={16} className="text-emerald-400" title="Strict Compliance Mode" />
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                    <span>{emp.profession}</span>
                    {emp.department && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span className="flex items-center gap-1">
                          <Building2 size={12} />
                          {emp.department}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Mic size={14} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Economic Swarm</span>
                <span className="text-sm font-mono text-emerald-400">${emp.economicSwarm.toLocaleString()}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {emp.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5">
                    {skill}
                  </span>
                ))}
                {emp.skills.length > 3 && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5">
                    +{emp.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
