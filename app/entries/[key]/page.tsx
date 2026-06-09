// app/entries/[key]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { saveEntry, archiveEntry } from '@/app/actions';
import { CONTENT_TYPES, TYPE_LABELS } from '@/lib/constants';

interface Entry {
  key: string;
  title: string;
  type: string;
  tags: string[];
  body: string;
  status: string;
  updated_by: string;
  updated_at: string;
}

export default async function EditEntryPage({
  params,
}: {
  params: { key: string };
}) {
  const { data, error } = await supabaseAdmin
    .from('context_entries')
    .select('*')
    .eq('key', params.key)
    .single();

  if (error || !data) notFound();

  const entry = data as Entry;
  const isArchived = entry.status === 'archived';

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">
          Edit Entry
          {isArchived && (
            <span
              className="badge"
              style={{ background: '#6b7280', marginLeft: 10, verticalAlign: 'middle', fontSize: 12 }}
            >
              Archived
            </span>
          )}
        </h1>
        <Link href="/" className="btn btn-secondary">
          ← Back
        </Link>
      </div>

      <div className="form-card">
        <form action={saveEntry} className="form-stack">
          {/* Hidden key — server action reads this for upsert */}
          <input type="hidden" name="key" value={entry.key} />

          <div className="form-row">
            <div className="field">
              <label htmlFor="key-display">Key</label>
              <input
                id="key-display"
                type="text"
                value={entry.key}
                readOnly
              />
              <span className="field-hint">Key cannot be changed after creation.</span>
            </div>

            <div className="field">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" required defaultValue={entry.type}>
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
              defaultValue={entry.title}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              defaultValue={(entry.tags ?? []).join(', ')}
              placeholder="Comma-separated"
            />
          </div>

          <div className="field">
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              name="body"
              defaultValue={entry.body}
              required
            />
          </div>

          <div className="form-actions">
            <div>
              {!isArchived && (
                <form action={archiveEntry} style={{ display: 'inline' }}>
                  <input type="hidden" name="key" value={entry.key} />
                  <button type="submit" className="btn btn-danger btn-sm">
                    Archive
                  </button>
                </form>
              )}
            </div>
            <div className="form-actions-right">
              <Link href="/" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--stone)' }}>
          <p className="entry-meta">
            Last updated {new Date(entry.updated_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}{' '}
            by {entry.updated_by}
          </p>
        </div>
      </div>
    </>
  );
}
