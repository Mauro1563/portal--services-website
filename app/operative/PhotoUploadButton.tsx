'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Upload,
  X,
} from 'lucide-react';

type Pending = { id: string; previewUrl: string; blob: Blob; sizeKB: number };

const MAX_DIM = 1600;
const QUALITY = 0.85;

// Resize + JPEG-encode on the device so 4-5MB phone photos turn into
// ~300-600KB uploads. Falls back to the original file if the browser
// lacks the APIs (very old Safari).
async function compressImage(file: File): Promise<Blob> {
  if (typeof createImageBitmap !== 'function') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * ratio);
    const h = Math.round(bitmap.height * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', QUALITY),
    );
    return blob ?? file;
  } catch {
    return file;
  }
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PhotoUploadButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Pending | null>(null);

  // Revoke blob URLs when the component unmounts so we don't leak memory.
  useEffect(() => {
    return () => {
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setProcessing(true);
    setError(null);
    try {
      const next: Pending[] = [];
      for (const f of Array.from(files)) {
        if (!f.type.startsWith('image/')) continue;
        const blob = await compressImage(f);
        next.push({
          id: uid(),
          blob,
          previewUrl: URL.createObjectURL(blob),
          sizeKB: Math.round(blob.size / 1024),
        });
      }
      setPending((p) => [...p, ...next]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not process photo',
      );
    } finally {
      setProcessing(false);
      // Reset input so picking the same file twice still triggers onChange.
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function remove(id: string) {
    setPending((curr) => {
      const removed = curr.find((x) => x.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return curr.filter((x) => x.id !== id);
    });
  }

  async function uploadAll() {
    if (pending.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('task_id', taskId);
      pending.forEach((p, i) =>
        fd.append(
          'photo',
          new File([p.blob], `photo-${i}-${p.id}.jpg`, { type: 'image/jpeg' }),
        ),
      );
      const res = await fetch('/api/operative/upload-photo', {
        method: 'POST',
        body: fd,
      });
      // The endpoint redirects to /operative on success or
      // /operative?error=... on failure (it always 2xx after follow).
      const finalUrl = new URL(res.url);
      const serverError = finalUrl.searchParams.get('error');
      if (serverError) throw new Error(serverError);
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      // Soft SPA nav instead of `window.location.assign('/operative')` —
      // the hard reload was forcing the browser to re-parse all the JS,
      // CSS and HTML for a page the user was already on, doubling the
      // perceived latency vs a router refresh + push.
      setPending([]);
      router.replace('/operative');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  }

  const totalKB = pending.reduce((s, p) => s + p.sizeKB, 0);
  const busy = processing || uploading;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      {pending.length > 0 ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-graphite-3">
            <span>
              {pending.length} foto{pending.length === 1 ? '' : 's'} lista
              {pending.length === 1 ? '' : 's'} · {totalKB} KB
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Comprimidas
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {pending.map((p) => (
              <div
                key={p.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-line bg-surface-2"
              >
                <button
                  type="button"
                  onClick={() => setPreview(p)}
                  className="block h-full w-full"
                  aria-label="Open preview"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  disabled={busy}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition active:scale-90 disabled:opacity-50"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-line bg-paper text-sm font-semibold text-graphite-1 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-brand-400 active:scale-[0.99] disabled:opacity-60"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Procesando…
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              {pending.length === 0 ? 'Take photo' : 'Take another'}
            </>
          )}
        </button>

        {pending.length > 0 ? (
          <button
            type="button"
            onClick={uploadAll}
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-sm font-bold text-white shadow-brand-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading {pending.length}…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Upload {pending.length} & complete
              </>
            )}
          </button>
        ) : null}
      </div>

      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreview(null)}
          role="dialog"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.previewUrl}
            alt=""
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setPreview(null)}
            aria-label="Close preview"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              remove(preview.id);
              setPreview(null);
              setTimeout(() => inputRef.current?.click(), 100);
            }}
            className="absolute bottom-6 left-1/2 inline-flex h-11 -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-bold text-rose-700 shadow-xl"
          >
            <RotateCcw className="h-4 w-4" /> Retake
          </button>
        </div>
      ) : null}
    </div>
  );
}
