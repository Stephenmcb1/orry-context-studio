# Context Studio — Setup

Separate Next.js 14 app. Separate Vercel deployment. Same Supabase instance as `orry-context-server`.

## 1. Create the app

```bash
# In your projects folder (NOT inside orry-context-server)
npx create-next-app@14 orry-context-studio
# Options: TypeScript yes, ESLint yes, Tailwind NO, src/ NO, App Router YES, alias @/* YES

cd orry-context-studio
npm install @supabase/supabase-js
```

## 2. Copy files from this scaffold

Replace/add the following files from this scaffold into your new app:
- `middleware.ts`
- `lib/constants.ts`
- `lib/token.ts`
- `lib/session.ts`
- `lib/supabaseAdmin.ts`
- `app/actions.ts`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/login/page.tsx`
- `app/entries/new/page.tsx`
- `app/entries/[key]/page.tsx`

Delete the default `app/page.tsx` content before replacing.

## 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
- `SUPABASE_URL` — same value as orry-context-server
- `SUPABASE_SERVICE_ROLE_KEY` — same value as orry-context-server
- `STUDIO_PASSWORD` — choose a shared password for Stephen + Thilde
- `STUDIO_SECRET` — generate with:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

## 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## 5. Deploy to Vercel

```bash
# Push to a new GitHub repo first: orry-context-studio
git init && git add . && git commit -m "initial scaffold"
git remote add origin https://github.com/Stephenmcb1/orry-context-studio.git
git push -u origin main
```

Then in Vercel (Orry Mill Pro account):
1. New project → import `orry-context-studio`
2. Add all 4 env vars in Vercel project settings
3. Deploy

## 6. Verify the cross-app contract

Before populating data, confirm `orry-context-server`'s `get_context` tool
filters to `status = 'active'` only — so archived entries are invisible to Claude.

Check `app/api/[transport]/route.ts` in the context server repo. The Supabase
query should include `.eq('status', 'active')`.
