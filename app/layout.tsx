// app/layout.tsx
import type { ReactNode } from 'react';
import { getSession } from '@/lib/session';
import { logout } from '@/app/actions';
import './globals.css';

export const metadata = {
  title: 'Context Studio — The Orry Mill',
  description: 'Manage shared LLM context entries for The Orry Mill.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en-GB">
      <body>
        <header className="header">
          <div className="header-left">
            <span className="header-wordmark">
              The Orry Mill <em>·</em> Context Studio
            </span>
          </div>
          {session && (
            <div className="header-right">
              <span className="header-user">
                {session.user === 'thilde' ? 'Thilde' : 'Stephen'}
              </span>
              <form action={logout}>
                <button type="submit" className="btn-ghost">
                  Sign out
                </button>
              </form>
            </div>
          )}
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
