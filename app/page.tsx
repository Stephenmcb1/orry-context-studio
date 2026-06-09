// app/page.tsx
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { archiveEntry, restoreEntry } from '@/app/actions';
import { TYPE_LABELS, TYPE_COLOURS, ContentType } from '@/lib/constants';

interface Entry {
  key: string;
  title: string;
  type: string;
  tags: string[];
  status: string;
  updated_by: string;
  updated_at: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function TypeBadge({ type }: { type: string }) {
  const colour = TYPE_COLOURS[type as ContentType] ?? '#6b7280';
  const label = TYPE_LABELS[type as ContentType] ?? type;
  return (
    <span className="badge" style={{ background: colour }}>
      {label}
    </span>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { data, error } = await supabaseAdmin
    .from('context_entries')
    .select('key, title, type, tags, status, updated_by, updated_at')
    .order('type', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw new Error(`Failed to load entries: ${error.message}`);

  const active = (data ?? []).filter((e: Entry) => e.status === 'active');
  const archived = (data ?? []).filter((e: Entry) => e.status === 'archived');

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Context Entries</h1>
        <Link href="/entries/new" className="btn btn-primary">
          + New entry
        </Link>
      </div>

      {searchParams.error === 'missing-fields' && (
        <p className="error-msg" style={{ marginBottom: 16 }}>
          Key, title, type, and body are all required.
        </p>
      )}

      {/* Active entries */}
      <p className="section-heading">Active — {active.length}</p>
      {active.length === 0 ? (
        <div className="empty-state">No active entries yet. Add one above.</div>
      ) : (
        <table className="entry-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Key</th>
              <th>Tags</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {active.map((entry: Entry) => (
              <tr key={entry.key}>
                <td className="entry-title">
                  <Link href={`/entries/${entry.key}`}>{entry.title}</Link>
                </td>
                <td>
                  <TypeBadge type={entry.type} />
                </td>
                <td>
                  <span className="entry-key">{entry.key}</span>
                </td>
                <td>
                  <div className="tags">
                    {(entry.tags ?? []).map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="entry-meta">
                  {fmt(entry.updated_at)}
                  <br />
                  {entry.updated_by}
                </td>
                <td>
                  <div className="entry-actions">
                    <Link href={`/entries/${entry.key}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <form action={archiveEntry}>
                      <input type="hidden" name="key" value={entry.key} />
                      <button type="submit" className="btn btn-danger btn-sm">
                        Archive
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Archived entries */}
      {archived.length > 0 && (
        <>
          <p className="section-heading">Archived — {archived.length}</p>
          <table className="entry-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Key</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {archived.map((entry: Entry) => (
                <tr key={entry.key} style={{ opacity: 0.55 }}>
                  <td className="entry-title" style={{ fontStyle: 'italic' }}>
                    {entry.title}
                  </td>
                  <td>
                    <TypeBadge type={entry.type} />
                  </td>
                  <td>
                    <span className="entry-key">{entry.key}</span>
                  </td>
                  <td className="entry-meta">{fmt(entry.updated_at)}</td>
                  <td>
                    <div className="entry-actions">
                      <form action={restoreEntry}>
                        <input type="hidden" name="key" value={entry.key} />
                        <button type="submit" className="btn btn-secondary btn-sm">
                          Restore
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
