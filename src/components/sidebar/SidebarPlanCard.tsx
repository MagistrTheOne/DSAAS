interface SidebarPlanCardProps {
  employeeCount: number;
}

export function SidebarPlanCard({ employeeCount }: SidebarPlanCardProps) {
  return (
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
  );
}

