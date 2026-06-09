// app/login/page.tsx
import { login } from '@/app/actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1 className="login-title">Context Studio</h1>
        <p className="login-sub">Sign in to manage context entries.</p>

        {searchParams.error && (
          <p className="error-msg" style={{ marginBottom: 16 }}>
            Incorrect password. Try again.
          </p>
        )}

        <form action={login} className="login-stack">
          <div className="field">
            <label htmlFor="user">Who are you?</label>
            <select id="user" name="user" required>
              <option value="stephen">Stephen</option>
              <option value="thilde">Thilde</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
