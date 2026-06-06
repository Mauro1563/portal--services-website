'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, Plus } from 'lucide-react';

export function PhotoUploadButton({
  taskId,
  label = 'Upload photo & complete',
}: {
  taskId: string;
  label?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form
      ref={formRef}
      action="/api/operative/upload-photo"
      method="post"
      encType="multipart/form-data"
      onSubmit={() => setIsUploading(true)}
    >
      <input type="hidden" name="task_id" value={taskId} />
      <input
        ref={inputRef}
        type="file"
        name="photo"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            formRef.current?.requestSubmit();
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-medium text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" /> {label}
          </>
        )}
      </button>
    </form>
  );
}

export function AddPhotoButton({ taskId }: { taskId: string }) {
  return <PhotoUploadButton taskId={taskId} label="Add another photo" />;
}

export function GhostAddPhotoButton({ taskId }: { taskId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <form
      ref={formRef}
      action="/api/operative/upload-photo"
      method="post"
      encType="multipart/form-data"
      onSubmit={() => setIsUploading(true)}
    >
      <input type="hidden" name="task_id" value={taskId} />
      <input
        ref={inputRef}
        type="file"
        name="photo"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            formRef.current?.requestSubmit();
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] text-xs font-medium text-white hover:bg-white/[0.08] disabled:opacity-60"
      >
        {isUploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" /> Add another photo
          </>
        )}
      </button>
    </form>
  );
}
