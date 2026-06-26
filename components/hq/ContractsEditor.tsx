'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Printer, FileSignature, Save, X } from 'lucide-react';
import { saveMarketingSection } from '@/app/hq/actions';

type Contract = {
  id: string;
  client: string;
  plan: string;
  value: string;
  startDate: string;
  term: string;
  extra: string;
  body: string;
  createdAt: string;
};

type ClientLite = { id: string; name: string; plan?: string };

const input = 'mt-1 h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40';
const area = 'mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40';

function buildBody(c: Omit<Contract, 'id' | 'body' | 'createdAt'>): string {
  return `CONTRATO DE PRESTACIÓN DE SERVICIOS
PORTAL HOME

Entre Portal Home ("el Proveedor") y ${c.client || '[Cliente]'} ("el Cliente"), con fecha de inicio ${c.startDate || '[fecha]'}, se acuerda lo siguiente:

1. OBJETO
El Proveedor concede al Cliente acceso a la plataforma Portal Home bajo el plan ${c.plan || '[plan]'}, incluyendo los portales y funciones correspondientes a dicho plan.

2. PRECIO Y FACTURACIÓN
El Cliente abonará ${c.value || '[importe]'} con periodicidad mensual. La facturación se emitirá de forma digital tras cada periodo.

3. DURACIÓN
El presente contrato tendrá una duración de ${c.term || '[n]'} meses desde la fecha de inicio, renovable automáticamente por periodos iguales salvo aviso con 30 días de antelación.

4. NIVEL DE SERVICIO
El Proveedor garantiza una disponibilidad del 99,9% y soporte conforme al plan contratado.

5. PROTECCIÓN DE DATOS
El tratamiento de datos se realizará conforme al RGPD. Los datos residen en la UE y el Cliente es responsable de los datos que introduce.

6. CONFIDENCIALIDAD
Ambas partes mantendrán la confidencialidad de la información intercambiada.
${c.extra ? `\n7. CLÁUSULAS ADICIONALES\n${c.extra}\n` : ''}
Y en prueba de conformidad, ambas partes firman el presente contrato.


_____________________________            _____________________________
Portal Home                  ${c.client || '[Cliente]'}
`;
}

/**
 * Generate a real PDF (no browser print dialog). Layout: branded
 * header band, contract body (auto-wrapped + paginated), signature
 * block, page numbers in footer.
 */
async function downloadContractPdf(c: Contract) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 56;
  const contentWidth = pageWidth - margin * 2;

  // ── Header band ────────────────────────────────────────────────
  doc.setFillColor(15, 23, 41); // #0F1729
  doc.rect(0, 0, pageWidth, 72, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PORTAL HOME', margin, 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 200, 230);
  doc.text('Cleaning & Facilities · portalservices.digital', margin, 50);
  // Right side: doc ref
  doc.setFontSize(8);
  const ref = `Ref: ${c.id.slice(0, 8).toUpperCase()}`;
  doc.text(ref, pageWidth - margin, 32, { align: 'right' });
  doc.text(
    `Emitido: ${new Date(c.createdAt).toLocaleDateString('es-ES')}`,
    pageWidth - margin,
    50,
    { align: 'right' },
  );

  // ── Title ──────────────────────────────────────────────────────
  doc.setTextColor(15, 23, 41);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`Contrato de servicios · ${c.client || 'Cliente'}`, margin, 108);

  // ── Body (split + paginate) ────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);
  const lines = doc.splitTextToSize(c.body, contentWidth) as string[];
  const lineH = 14;
  let y = 130;
  for (const line of lines) {
    if (y + lineH > pageHeight - 80) {
      // Footer + new page
      drawFooter(doc, pageWidth, pageHeight, margin);
      doc.addPage();
      y = 80;
    }
    doc.text(line, margin, y);
    y += lineH;
  }
  drawFooter(doc, pageWidth, pageHeight, margin);

  // Filename: contract-{client-slug}-{date}.pdf
  const slug =
    (c.client || 'cliente')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'cliente';
  const stamp = new Date(c.createdAt).toISOString().slice(0, 10);
  doc.save(`contrato-${slug}-${stamp}.pdf`);
}

function drawFooter(
  doc: import('jspdf').jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number,
) {
  const pageCount = doc.getNumberOfPages();
  const current = doc.getCurrentPageInfo().pageNumber;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 56, pageWidth - margin, pageHeight - 56);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Portal Home · portalservices.digital', margin, pageHeight - 36);
  doc.text(
    `Página ${current} de ${pageCount}`,
    pageWidth - margin,
    pageHeight - 36,
    { align: 'right' },
  );
}

export function ContractsEditor({
  initial,
  clients,
}: {
  initial: Contract[];
  clients: ClientLite[];
}) {
  const [items, setItems] = useState<Contract[]>(initial);
  const [draft, setDraft] = useState<Contract | null>(null);
  const [saving, startSaving] = useTransition();

  const persist = (next: Contract[]) =>
    startSaving(async () => {
      setItems(next);
      await saveMarketingSection('contracts', next);
    });

  const newContract = () =>
    setDraft({ id: crypto.randomUUID(), client: '', plan: '', value: '', startDate: new Date().toISOString().slice(0, 10), term: '12', extra: '', body: '', createdAt: new Date().toISOString() });

  const setField = (k: keyof Contract, v: string) => draft && setDraft({ ...draft, [k]: v });

  const regen = () => {
    if (!draft) return;
    setDraft({ ...draft, body: buildBody(draft) });
  };

  const saveDraft = () => {
    if (!draft) return;
    const body = draft.body || buildBody(draft);
    const final = { ...draft, body };
    const exists = items.some((i) => i.id === final.id);
    persist(exists ? items.map((i) => (i.id === final.id ? final : i)) : [...items, final]);
    setDraft(null);
  };

  const remove = (id: string) => {
    if (!confirm('¿Eliminar este contrato?')) return;
    persist(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-graphite-3">{items.length} contrato(s) guardado(s).</p>
        <button onClick={newContract} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-3.5 text-sm font-semibold text-white transition hover:brightness-110">
          <Plus className="h-4 w-4" /> Nuevo contrato
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-graphite-4">Aún no hay contratos generados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Cliente</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Plan</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Importe</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-graphite-4">Inicio</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-graphite-1">{c.client || '—'}</td>
                  <td className="px-4 py-3 text-graphite-2">{c.plan || '—'}</td>
                  <td className="px-4 py-3 text-graphite-2">{c.value || '—'}</td>
                  <td className="px-4 py-3 text-graphite-2">{c.startDate || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => downloadContractPdf(c)} className="rounded-lg p-1.5 text-graphite-3 hover:bg-slate-100 hover:text-brand-600" aria-label="Descargar PDF"><Printer className="h-4 w-4" /></button>
                      <button onClick={() => setDraft(c)} className="rounded-lg p-1.5 text-graphite-3 hover:bg-slate-100 hover:text-brand-600" aria-label="Editar"><FileSignature className="h-4 w-4" /></button>
                      <button onClick={() => remove(c.id)} className="rounded-lg p-1.5 text-graphite-3 hover:bg-rose-50 hover:text-rose-600" aria-label="Eliminar"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDraft(null)}>
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-paper p-6 ring-1 ring-line" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-graphite-1">Contrato</h3>
              <button onClick={() => setDraft(null)} className="rounded-lg p-1.5 text-graphite-3 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-[11px] font-medium text-graphite-3">Cliente</span>
                {clients.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => {
                      const c = clients.find((x) => x.id === e.target.value);
                      if (c) setDraft({ ...draft, client: c.name, plan: c.plan || draft.plan });
                    }}
                    className={`${input} mb-2`}
                  >
                    <option value="">— elegir de clientes —</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
                <input value={draft.client} onChange={(e) => setField('client', e.target.value)} className={input} placeholder="Nombre / empresa" />
              </label>
              <label className="block"><span className="text-[11px] font-medium text-graphite-3">Plan</span><input value={draft.plan} onChange={(e) => setField('plan', e.target.value)} className={input} /></label>
              <label className="block"><span className="text-[11px] font-medium text-graphite-3">Importe</span><input value={draft.value} onChange={(e) => setField('value', e.target.value)} className={input} placeholder="£119 / mes" /></label>
              <label className="block"><span className="text-[11px] font-medium text-graphite-3">Fecha de inicio</span><input type="date" value={draft.startDate} onChange={(e) => setField('startDate', e.target.value)} className={input} /></label>
              <label className="block"><span className="text-[11px] font-medium text-graphite-3">Duración (meses)</span><input type="number" value={draft.term} onChange={(e) => setField('term', e.target.value)} className={input} /></label>
              <label className="block sm:col-span-2"><span className="text-[11px] font-medium text-graphite-3">Cláusulas adicionales</span><textarea rows={2} value={draft.extra} onChange={(e) => setField('extra', e.target.value)} className={area} /></label>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button onClick={regen} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-brand-600 ring-1 ring-inset ring-line hover:bg-slate-50">
                <FileSignature className="h-4 w-4" /> Generar texto
              </button>
              <span className="text-[11px] text-graphite-4">Puedes editar el texto generado abajo.</span>
            </div>

            <textarea
              rows={12}
              value={draft.body}
              onChange={(e) => setField('body', e.target.value)}
              placeholder="Pulsa «Generar texto» para crear el contrato a partir de los datos."
              className="mt-2 w-full rounded-xl bg-white px-3 py-2 font-mono text-xs leading-relaxed text-graphite-1 ring-1 ring-inset ring-line focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />

            <div className="mt-5 flex justify-end gap-2">
              {draft.body && (
                <button onClick={() => downloadContractPdf({ ...draft, body: draft.body || buildBody(draft) })} className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium text-graphite-2 ring-1 ring-inset ring-line hover:bg-slate-50">
                  <Printer className="h-4 w-4" /> Descargar PDF
                </button>
              )}
              <button onClick={saveDraft} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
                <Save className="h-4 w-4" /> {saving ? 'Guardando…' : 'Guardar contrato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
