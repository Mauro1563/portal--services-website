'use client';

import { useState, useTransition } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { checkInTask } from './actions';

export function CheckInButton({ taskId }: { taskId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    if (!('geolocation' in navigator)) {
      setError('GPS not supported on this device');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const formData = new FormData();
        formData.set('task_id', taskId);
        formData.set('lat', String(position.coords.latitude));
        formData.set('lng', String(position.coords.longitude));
        startTransition(() => {
          checkInTask(formData);
        });
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Allow location access to check in'
            : 'Could not get your location',
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-sm font-bold text-white shadow-brand-glow transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Checking in…
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4" /> Check in (GPS)
          </>
        )}
      </button>
      {error && (
        <p className="mt-1.5 text-center text-xs text-rose-700">{error}</p>
      )}
    </div>
  );
}
