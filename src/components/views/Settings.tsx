import { Shield, User, Mail, Key, Bell } from 'lucide-react';

export function Settings() {
  return (
    <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto">
      <header className="mb-12">
        <h2 className="text-3xl font-light text-white tracking-tight">Settings</h2>
        <p className="text-zinc-500 mt-1">Manage your account and security preferences</p>
      </header>

      <div className="space-y-8">
        <section className="bg-[#111] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-zinc-400" size={24} />
            <h3 className="text-xl font-medium text-white">Profile Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Nickname</label>
              <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-4">
                <User size={18} className="text-zinc-500" />
                <span className="text-white">MagistrTheOne</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-4">
                <Mail size={18} className="text-zinc-500" />
                <span className="text-white">ceo@nullxes.com</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-zinc-400" size={24} />
            <h3 className="text-xl font-medium text-white">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/50 border border-white/10 rounded-xl">
              <div className="flex items-center gap-4">
                <Key size={20} className="text-zinc-400" />
                <div>
                  <div className="text-white font-medium">Password</div>
                  <div className="text-sm text-zinc-500">Last changed 30 days ago</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                Update
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/50 border border-white/10 rounded-xl">
              <div className="flex items-center gap-4">
                <Shield size={20} className="text-zinc-400" />
                <div>
                  <div className="text-white font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-zinc-500">Secure your account with 2FA</div>
                </div>
              </div>
              <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg text-sm font-medium transition-colors">
                Enabled
              </button>
            </div>
          </div>
        </section>
        
        <section className="bg-[#111] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-zinc-400" size={24} />
            <h3 className="text-xl font-medium text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-black/50 border border-white/10 rounded-xl cursor-pointer">
              <div>
                <div className="text-white font-medium">Employee Activity Alerts</div>
                <div className="text-sm text-zinc-500">Receive notifications when tasks are completed</div>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-500">
                <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform translate-x-6" />
              </div>
            </label>
            
            <label className="flex items-center justify-between p-4 bg-black/50 border border-white/10 rounded-xl cursor-pointer">
              <div>
                <div className="text-white font-medium">Economic Swarm Updates</div>
                <div className="text-sm text-zinc-500">Daily summaries of income generated</div>
              </div>
              <div className="relative inline-block w-12 h-6 rounded-full bg-emerald-500">
                <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform translate-x-6" />
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
