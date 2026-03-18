import { createAuthClient } from 'better-auth/react';

// Note: For this Vite app we assume the Better Auth server is mounted on the same origin
// under `/api/auth/*` (default Better Auth mount path).
const baseURL =
  typeof window !== 'undefined' ? window.location.origin : ('' as string);

export const authClient = createAuthClient({
  baseURL,
});

