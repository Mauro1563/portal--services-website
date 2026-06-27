'use client';

import { useState } from 'react';
import { CreditCard, FileText, Mail } from 'lucide-react';

type Item = {
  key: 'flyer' | 'card' | 'email';
  label: string;
  Icon: typeof FileText;
  ready: boolean;
  payload?: string;
  filename?: string;
};

export function DownloadablesRow({
  businessName,
  publicUrl,
}: {
  businessName: string;
  publicUrl: string;
}) {
  const [toast, setToast] = useState<string | null>(null);

  // Note: PDF generators not wired yet — jspdf is installed but the Flyer A5
  // and business card layouts need design assets to render properly.
  const items: Item[] = [
    {
      key: 'flyer',
      label: 'Flyer A5 (PDF)',
      Icon: FileText,
      ready: false,
    },
    {
      key: 'card',
      label: 'Tarjeta de presentación',
      Icon: CreditCard,
      ready: false,
    },
    {
      key: 'email',
      label: 'Plantilla de email para clientes',
      Icon: Mail,
      ready: true,
      filename: 'plantilla-email-clientes.txt',
      payload: emailTemplate(businessName, publicUrl),
    },
  ];

  function handleClick(it: Item) {
    if (!it.ready || !it.payload || !it.filename) {
      setToast('Próximamente');
      setTimeout(() => setToast(null), 1800);
      return;
    }
    const blob = new Blob([it.payload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = it.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <ul className="mt-4 divide-y divide-surface-2 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0">
        {items.map(({ key, label, Icon, ready }) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => handleClick(items.find((i) => i.key === key)!)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-1"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-1">
                <Icon className="h-4 w-4 text-brand-600" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text-1">{label}</span>
                <span className="block text-[11px] text-text-3">
                  {ready ? 'Descargar ahora' : 'Próximamente'}
                </span>
              </span>
              <span
                className={
                  'inline-flex h-7 items-center rounded-lg px-2 text-[10px] font-semibold ring-1 ring-inset ' +
                  (ready
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                    : 'bg-surface-1 text-text-3 ring-surface-2')
                }
              >
                {ready ? 'Listo' : 'Pronto'}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {toast ? (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-text-1/90 px-4 py-2 text-xs font-medium text-white shadow-card-lg lg:bottom-8">
          {toast}
        </div>
      ) : null}
    </>
  );
}

function emailTemplate(businessName: string, publicUrl: string): string {
  return [
    `Asunto: Reserva tu próxima limpieza en 30 segundos`,
    ``,
    `Hola {Nombre},`,
    ``,
    `Gracias por elegir ${businessName}. Para que reservar sea aún más rápido,`,
    `ahora puedes hacerlo directamente desde nuestro enlace:`,
    ``,
    publicUrl,
    ``,
    `• Elige el día y la hora que mejor te queden`,
    `• Confirma con un par de toques — sin llamadas`,
    `• Recibe el recordatorio automático un día antes`,
    ``,
    `Cualquier duda, responde a este mismo correo.`,
    ``,
    `— Equipo ${businessName}`,
    ``,
  ].join('\n');
}
