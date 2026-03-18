import { LayoutDashboard, BarChart3, UserPlus, Settings, Crown, User } from 'lucide-react';
import { ViewState } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  employeeCount: number;
}

export function Sidebar({ currentView, setCurrentView, employeeCount }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'AI Digital', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'create', label: 'Create Employee', icon: UserPlus },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'premium', label: 'Premium', icon: Crown },
  ] as const;

  return (
    <div className="w-64 h-full bg-[#050505] flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-xl leading-none">N</span>
          </div>
          <h1 className="text-white font-bold tracking-widest uppercase text-sm">Nullxes Digital</h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (currentView === 'interaction' && item.id === 'dashboard');
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="px-2 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-white uppercase tracking-wider">Free Plan</span>
              <span className="text-xs text-zinc-500">{employeeCount}/3</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-1.5">
              <div 
                className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((employeeCount / 3) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
            <User size={20} className="text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">MagistrTheOne</span>
            <span className="text-xs text-zinc-500">ceo@nullxes.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
