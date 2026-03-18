import { LayoutDashboard, BarChart3, UserPlus, Settings, Crown } from 'lucide-react';
import type { ReactNode } from 'react';
import { ViewState } from '../../types';
import { cn } from '../../lib/utils';

interface SidebarNavProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

type NavId = Exclude<ViewState, 'interaction'>;

const NAV_ITEMS: ReadonlyArray<{
  id: NavId;
  label: string;
  icon: (props: { size: number; className?: string }) => ReactNode;
}> = [
  { id: 'dashboard', label: 'AI Digital', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'create', label: 'Create Employee', icon: UserPlus },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'premium', label: 'Premium', icon: Crown },
];

function isNavItemActive(currentView: ViewState, itemId: NavId) {
  // UX: when user is in interaction screen, "AI Digital" stays highlighted.
  return currentView === itemId || (currentView === 'interaction' && itemId === 'dashboard');
}

export function SidebarNav({ currentView, setCurrentView }: SidebarNavProps) {
  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = isNavItemActive(currentView, item.id);

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white',
            )}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

