'use client';

import { Download } from 'lucide-react';

type Lead = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string | null;
  message: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

function csvEscape(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  // RFC 4180: wrap in quotes if it contains a comma, quote, or newline.
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function ExportLeadsButton({ leads }: { leads: Lead[] }) {
  const onClick = () => {
    const headers = [
      'created_at',
      'status',
      'source',
      'name',
      'email',
      'phone',
      'company',
      'interest',
      'message',
    ];
    const rows = leads.map((l) =>
      [
        l.created_at,
        l.status,
        l.source ?? '',
        l.name ?? '',
        l.email,
        l.phone ?? '',
        l.company ?? '',
        l.interest ?? '',
        l.message ?? '',
      ]
        .map(csvEscape)
        .join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={leads.length === 0}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </button>
  );
}
