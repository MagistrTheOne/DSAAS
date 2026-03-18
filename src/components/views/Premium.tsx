import { Check, Crown, Zap, Building2 } from 'lucide-react';

export function Premium() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-light text-white tracking-tight mb-4">Upgrade Your Workforce</h2>
        <p className="text-zinc-400 text-lg">Scale your digital employees with our premium plans. Choose the right tier for your business needs.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Tier */}
        <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
              <Zap size={24} className="text-zinc-400" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-2">Free Tier</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-light text-white">$0</span>
              <span className="text-zinc-500">/ forever</span>
            </div>
            <p className="text-zinc-400 text-sm">Perfect for individuals trying out digital employees.</p>
          </div>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">3 Digital Employees</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">3 Functions Available</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">Basic Analytics</span>
            </div>
          </div>
          
          <button className="w-full py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Pro Tier */}
        <div className="bg-[#1a1a1a] border border-emerald-500/30 rounded-3xl p-8 flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full border border-emerald-500/30">
            Most Popular
          </div>
          
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <Crown size={24} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-2">Pro</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-light text-white">$99</span>
              <span className="text-zinc-500">/ month</span>
            </div>
            <p className="text-zinc-400 text-sm">Scale your business with a dedicated digital workforce.</p>
          </div>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">20 Digital Employees</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">20 Skills per Employee</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-white font-medium">Enterprise Avatar Synthesis</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">Priority Support</span>
            </div>
          </div>
          
          <button className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-medium transition-colors">
            Upgrade to Pro
          </button>
        </div>

        {/* Enterprise Tier */}
        <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
              <Building2 size={24} className="text-zinc-400" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-2">Enterprise</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-light text-white">Custom</span>
            </div>
            <p className="text-zinc-400 text-sm">For large organizations requiring unlimited scale.</p>
          </div>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">Unlimited Employees</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">Unlimited Skills</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">Custom Integrations</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">Dedicated Account Manager</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-zinc-300">SLA Guarantee</span>
            </div>
          </div>
          
          <button className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
