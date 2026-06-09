// app/entries/new/page.tsx
import Link from 'next/link';
import { saveEntry } from '@/app/actions';
import { CONTENT_TYPES, TYPE_LABELS } from '@/lib/constants';

export default function NewEntryPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">New Entry</h1>
        <Link href="/" className="btn btn-secondary">
          ← Back
        </Link>
      </div>

      <div className="form-card">
        <form action={saveEntry} className="form-stack">
          <div className="form-row">
            <div className="field">
              <label htmlFor="key">Key</label>
              <input
                id="key"
                name="key"
                type="text"
                placeholder="e.g. brand-voice"
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers and hyphens only"
                required
                autoFocus
              />
              <span className="field-hint">
                Unique identifier. Lowercase, hyphens only — e.g.{' '}
                <code>orry-yarn</code>, <code>chatbot-faq-orders</code>
              </span>
            </div>

            <div className="field">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" required>
                <option value="">Select a type…</option>
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Brand Voice & Tone"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="e.g. brand, voice, tone (comma-separated)"
            />
            <span className="field-hint">Optional. Comma-separated.</span>
          </div>

          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              name="body"
              placeholder="Markdown content…"
              required
            />
            <span className="field-hint">Plain text or markdown.</span>
          </div>

          <div className="form-actions">
            <Link href="/" className="btn btn-secondary">
              Cancel
            </Link>
            <div className="form-actions-right">
              <button type="submit" className="btn btn-primary">
                Save entry
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
