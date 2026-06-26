'use client';

import { Download } from 'lucide-react';

function csvEscape(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

/**
 * Generic CSV export button. Pass an array of plain objects + the
 * header columns to include. Generates an RFC-4180 CSV in the browser
 * and triggers a Downloads-folder save with a date-stamped filename.
 *
 * Reused across owner list pages — tasks, clients, properties, cleaners.
 * For HQ leads we have a more specific button; this one stays generic so
 * adding it to a new list page is one line.
 */
export function CsvExportButton<T extends Record<string, unknown>>({
  rows,
  headers,
  filename,
  label = 'Export CSV',
}: {
  rows: T[];
  headers: { key: keyof T; label: string }[];
  filename: string;
  label?: string;
}) {
  const onClick = () => {
    const headerRow = headers.map((h) => csvEscape(h.label)).join(',');
    const dataRows = rows.map((r) =>
      headers.map((h) => csvEscape(r[h.key])).join(','),
    );
    const csv = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={rows.length === 0}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-surface-2 bg-surface-0 px-3 text-xs font-semibold text-text-1 transition hover:border-surface-3 hover:bg-surface-1 disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
