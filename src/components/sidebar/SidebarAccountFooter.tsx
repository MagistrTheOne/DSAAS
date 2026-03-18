import { User } from 'lucide-react';
import { authClient } from '../../lib/authClient';

export function SidebarAccountFooter() {
  const { data, isPending, error } = authClient.useSession();
  const user = (data as any)?.user as
    | {
        name?: string;
        email?: string;
        image?: string;
      }
    | undefined;

  if (isPending) {
    return (
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-28 bg-white/10 rounded" />
          <div className="h-2 w-20 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    // If auth server isn't available yet, don't break the whole app.
    return null;
  }

  if (!user) {
    const signInUrl = `${window.location.origin}/api/auth/sign-in/email`;
    return (
      <a
        href={signInUrl}
        className="flex items-center gap-3 px-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
          <User size={20} className="text-zinc-400" />
        </div>
        <span className="font-medium">Sign in</span>
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 px-2">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name || user.email || 'User avatar'}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover bg-zinc-800"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
          <User size={20} className="text-zinc-400" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{user.name || 'User'}</span>
        <span className="text-xs text-zinc-500">{user.email || ''}</span>
      </div>
    </div>
  );
}

