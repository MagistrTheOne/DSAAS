import { ViewState } from '../types';
import { SidebarAccountFooter } from './sidebar/SidebarAccountFooter';
import { SidebarBrand } from './sidebar/SidebarBrand';
import { SidebarNav } from './sidebar/SidebarNav';
import { SidebarPlanCard } from './sidebar/SidebarPlanCard';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  employeeCount: number;
}

export function Sidebar({ currentView, setCurrentView, employeeCount }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-[#050505] flex flex-col justify-between p-4">
      <div>
        <SidebarBrand />
        <SidebarNav currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      <div className="pt-4 border-t border-white/10">
        <SidebarPlanCard employeeCount={employeeCount} />
        <SidebarAccountFooter />
      </div>
    </div>
  );
}
