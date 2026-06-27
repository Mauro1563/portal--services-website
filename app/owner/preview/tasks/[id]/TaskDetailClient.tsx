/**
 * Public preview: Owner → Task detail (interactive client view).
 * Includes inline edit panel, chat modal, and a click-to-enlarge photo lightbox.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  MessageSquare,
  Send,
  Star,
  X,
} from 'lucide-react';
import { DemoBottomTabBar } from '../../_components/DemoBottomTabBar';

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

type TaskDetail = {
  id: string;
  property: string;
  address: string;
  mapsQuery: string;
  hero: string;
  beds: number;
  baths: number;
  area: number;
  cleaner: string;
  cleanerInitials: string;
  cleanerPin: string;
  client: string;
  clientInitials: string;
  rating: string;
  cleaningsPerMonth: number;
  date: string;
  time: string;
  status: TaskStatus;
  notes: string;
};

const STATUS: Record<TaskStatus, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: 'Pendiente', cls: 'bg-slate-100 text-slate-700', icon: Clock },
  in_progress: { label: 'En curso', cls: 'bg-amber-100 text-amber-800', icon: Clock },
  completed: { label: 'Completada', cls: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelada', cls: 'bg-rose-100 text-rose-700', icon: Clock },
};

const STATUS_ORDER: TaskStatus[] = ['pending', 'in_progress', 'completed', 'cancelled'];
const CLEANER_OPTIONS = [
  'Carmen Ruiz',
  'Lucía Vega',
  'Pedro Kovac',
  'María Reyes',
];

const WORK_PHOTOS = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=70',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=70',
];

const DETAILS: Record<string, TaskDetail> = {
  'demo-1': {
    id: 'demo-1', property: 'Soho Loft',
    address: '22 Old Compton St, Soho, London W1D 4TR',
    mapsQuery: '22+Old+Compton+St+London',
    hero: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&auto=format&fit=crop&q=70',
    beds: 2, baths: 2, area: 65,
    cleaner: 'Carmen Ruiz', cleanerInitials: 'CR', cleanerPin: '026389',
    client: 'María García', clientInitials: 'MG', rating: '4.9', cleaningsPerMonth: 3,
    date: 'Hoy', time: '09:00 – 11:00', status: 'in_progress',
    notes: 'Cocina, salón y 2 baños completados. Reposición de toallas hecha. El detergente del baño se está acabando — comprar antes del lunes.',
  },
  'demo-2': {
    id: 'demo-2', property: 'Camden House',
    address: '47 Camden High St, London NW1 0LT',
    mapsQuery: '47+Camden+High+St+London',
    hero: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=70',
    beds: 4, baths: 3, area: 180,
    cleaner: 'Lucía Vega', cleanerInitials: 'LV', cleanerPin: '041572',
    client: 'Direct booking', clientInitials: 'DB', rating: '5.0', cleaningsPerMonth: 4,
    date: 'Hoy', time: '11:30 – 14:00', status: 'completed',
    notes: 'Limpieza completa con cambio de sábanas en 4 habitaciones. Terraza barrida y muebles repuestos.',
  },
  'demo-3': {
    id: 'demo-3', property: 'Notting Hill Flat',
    address: '12 Portobello Rd, London W11 2DZ',
    mapsQuery: '12+Portobello+Rd+London',
    hero: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&auto=format&fit=crop&q=70',
    beds: 1, baths: 1, area: 45,
    cleaner: 'Pedro Kovac', cleanerInitials: 'PK', cleanerPin: '093821',
    client: 'Ana Romero', clientInitials: 'AR', rating: '4.7', cleaningsPerMonth: 2,
    date: 'Hoy', time: '14:00 – 15:30', status: 'pending',
    notes: 'Programada para esta tarde. Llaves en cerradura inteligente, código 4712.',
  },
  'demo-4': {
    id: 'demo-4', property: 'Mayfair Studio',
    address: '8 Berkeley St, Mayfair, London W1J 8DY',
    mapsQuery: '8+Berkeley+St+Mayfair+London',
    hero: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=70',
    beds: 0, baths: 1, area: 32,
    cleaner: 'María Reyes', cleanerInitials: 'MR', cleanerPin: '058914',
    client: 'Direct booking', clientInitials: 'DB', rating: '4.8', cleaningsPerMonth: 5,
    date: 'Hoy', time: '17:00 – 18:00', status: 'pending',
    notes: 'Turn-around rápido entre huéspedes. Reposición standard.',
  },
};

function fallback(id: string): TaskDetail {
  return {
    id,
    property: 'Limpieza programada',
    address: 'London',
    mapsQuery: 'London',
    hero: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=70',
    beds: 2, baths: 1, area: 60,
    cleaner: 'Carmen Ruiz', cleanerInitials: 'CR', cleanerPin: '000000',
    client: 'Cliente demo', clientInitials: 'CD', rating: '4.8', cleaningsPerMonth: 2,
    date: 'Próx.', time: '10:00 – 12:00', status: 'pending',
    notes: 'Tarea de demostración.',
  };
}

type ChatMsg = { from: 'owner' | 'cleaner'; text: string; ts: string };

export function TaskDetailClient({ id }: { id: string }) {
  const initial = DETAILS[id] ?? fallback(id);

  const [task, setTask] = useState<TaskDetail>(initial);
  const [editing, setEditing] = useState(false);
  const [draftCleaner, setDraftCleaner] = useState(initial.cleaner);
  const [draftTime, setDraftTime] = useState(initial.time);
  const [draftNotes, setDraftNotes] = useState(initial.notes);

  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([
    { from: 'cleaner', text: 'Hola, ya estoy en la propiedad.', ts: '09:02' },
    { from: 'owner', text: '¡Genial! Avísame cuando termines.', ts: '09:03' },
    { from: 'cleaner', text: 'El detergente del baño se está acabando.', ts: '10:15' },
  ]);
  const [chatDraft, setChatDraft] = useState('');

  const [photos, setPhotos] = useState<string[]>(WORK_PHOTOS.slice(0, 3));
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const st = STATUS[task.status];
  const StIcon = st.icon;

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 1800);
  }

  function setStatus(status: TaskStatus) {
    setTask((t) => ({ ...t, status }));
    setStatusOpen(false);
    showToast(`Estado: ${STATUS[status].label}`);
  }

  function saveEdits() {
    setTask((t) => ({
      ...t,
      cleaner: draftCleaner,
      time: draftTime,
      notes: draftNotes,
    }));
    setEditing(false);
    showToast('Cambios guardados');
  }

  function deletePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setLightboxIdx(null);
    showToast('Foto eliminada');
  }

  function addPhoto() {
    setPhotos((prev) => {
      const next = WORK_PHOTOS[(prev.length) % WORK_PHOTOS.length];
      return [...prev, next];
    });
    showToast('Foto subida');
  }

  function sendChat() {
    const text = chatDraft.trim();
    if (!text) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setChat((c) => [...c, { from: 'owner', text, ts: `${hh}:${mm}` }]);
    setChatDraft('');
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-5">
          <Link
            href="/owner/preview/tasks"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Demo · {task.id}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setStatusOpen((s) => !s)}
              title="Cambiar el estado de la tarea"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition hover:brightness-95 ${st.cls}`}
            >
              <StIcon className="h-3 w-3" /> {st.label}
              <span aria-hidden className="text-[10px] opacity-60">▾</span>
            </button>
            {statusOpen ? (
              <div className="absolute left-0 top-9 z-30 w-44 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
                {STATUS_ORDER.map((s) => {
                  const cfg = STATUS[s];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-slate-50 ${
                        s === task.status ? 'font-bold text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {cfg.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">
              {task.property}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              <a
                href={`https://maps.google.com/?q=${task.mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir en Google Maps"
                className="hover:text-blue-700 hover:underline"
              >
                {task.address}
              </a>
              <span>· {task.date} {task.time}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing((e) => !e)}
              title="Cambiar cleaner asignado, hora o notas"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {editing ? 'Cerrar' : 'Editar'}
            </button>
            {task.status !== 'cancelled' && task.status !== 'completed' ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Cancelar esta tarea?')) {
                    setStatus('cancelled');
                  }
                }}
                title="Marcar la tarea como cancelada"
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
              >
                Cancelar tarea
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (confirm('¿Eliminar definitivamente esta tarea?')) {
                  showToast('Tarea eliminada');
                  window.setTimeout(() => {
                    window.location.href = '/owner/preview/tasks';
                  }, 600);
                }
              }}
              title="Eliminar definitivamente la tarea (no se puede deshacer)"
              className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Eliminar
            </button>
          </div>
        </div>

        {editing ? (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-slate-700">
                Cleaner asignado
                <select
                  value={draftCleaner}
                  onChange={(e) => setDraftCleaner(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                >
                  {(CLEANER_OPTIONS.includes(draftCleaner)
                    ? CLEANER_OPTIONS
                    : [draftCleaner, ...CLEANER_OPTIONS]).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Hora
                <input
                  value={draftTime}
                  onChange={(e) => setDraftTime(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                />
              </label>
            </div>
            <label className="mt-3 block text-xs font-semibold text-slate-700">
              Notas
              <textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </label>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={saveEdits}
                className="h-9 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="h-9 rounded-lg bg-white px-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setLightboxIdx(0)}
                title="Pulsa para ver las fotos a tamaño completo"
                className="block w-full"
              >
                <img
                  src={task.hero}
                  alt={task.property}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition hover:opacity-95"
                />
              </button>
              <div className="border-t border-slate-100 p-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  Notas del cleaner
                </h3>
                <p className="mt-1 text-sm text-slate-600">{task.notes}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <Info className="h-3 w-3" /> Toca una foto para ampliarla
                </p>
                <button
                  type="button"
                  onClick={addPhoto}
                  title="Añadir una foto nueva al trabajo (simula la subida del cleaner)"
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[10.5px] font-semibold text-white hover:bg-blue-700"
                >
                  + Subir foto
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {photos.map((src, i) => (
                  <button
                    type="button"
                    key={`${src}-${i}`}
                    onClick={() => setLightboxIdx(i)}
                    title={`Ver foto ${i + 1} a tamaño completo`}
                    className="group relative overflow-hidden rounded-xl ring-1 ring-slate-200"
                  >
                    <img
                      src={src}
                      alt={`Foto del trabajo ${i + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                      Foto {i + 1}
                    </span>
                  </button>
                ))}
                {photos.length === 0 ? (
                  <p className="col-span-3 rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center text-[11px] text-slate-500">
                    Sin fotos todavía.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700">Check-in</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>09:02 · GPS confirmado en la propiedad</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>09:15 · Foto inicial subida</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                  <span>Foto final pendiente</span>
                </li>
              </ul>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Cleaner
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                  {task.cleanerInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {task.cleaner}
                  </p>
                  <p className="text-xs text-slate-500">PIN {task.cleanerPin}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                title="Abrir chat con el cleaner asignado"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Enviar mensaje
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Cliente
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
                  {task.clientInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {task.client}
                  </p>
                  <p className="text-xs text-slate-500">
                    {task.cleaningsPerMonth} limpiezas/mes
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-amber-400">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="ml-1 text-xs text-slate-600">
                  {task.rating} avg
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Propiedad
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <Building2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {task.property}
                  </p>
                  <p className="text-xs text-slate-500">
                    {task.beds} dorm · {task.baths} baños · {task.area}m²
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Chat modal */}
      {chatOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Chat con {task.cleaner}
                </p>
                <p className="text-[11px] text-slate-500">Demo · mock messages</p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Cerrar chat"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto bg-slate-50/50 p-4">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'owner' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      m.from === 'owner'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-800 ring-1 ring-slate-200'
                    }`}
                  >
                    <p>{m.text}</p>
                    <p
                      className={`mt-0.5 text-[10px] ${m.from === 'owner' ? 'text-white/70' : 'text-slate-400'}`}
                    >
                      {m.ts}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChat();
              }}
              className="flex items-center gap-2 border-t border-slate-200 p-3"
            >
              <input
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                placeholder="Escribe un mensaje…"
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              />
              <button
                type="submit"
                title="Enviar mensaje"
                className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Photo lightbox */}
      {lightboxIdx !== null && photos[lightboxIdx] ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/85 p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            aria-label="Cerrar lightbox"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deletePhoto(lightboxIdx);
            }}
            title="Eliminar esta foto"
            className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Eliminar foto
          </button>
          <img
            src={photos[lightboxIdx]}
            alt={`Foto ${lightboxIdx + 1}`}
            className="max-h-[70vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className="flex gap-2 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {photos.map((src, i) => (
              <button
                type="button"
                key={`${src}-${i}`}
                onClick={() => setLightboxIdx(i)}
                title={`Ver foto ${i + 1}`}
                className={`overflow-hidden rounded-md ring-2 transition ${
                  i === lightboxIdx ? 'ring-white' : 'ring-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="h-14 w-14 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            ✓ {toast}
          </div>
        </div>
      ) : null}

      <DemoBottomTabBar active="tasks" />
    </main>
  );
}
