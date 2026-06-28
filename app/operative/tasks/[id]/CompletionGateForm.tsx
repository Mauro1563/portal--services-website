'use client';

/**
 * Client wrapper that fires markCompleted (the existing server action) when
 * the shared CompletionGate is clicked. We render a hidden form so the action
 * sees the task_id via FormData exactly like the legacy completion paths do —
 * no second action surface to maintain.
 */
import { useTransition } from 'react';
import { CompletionGate } from '@/components/tasks/CompletionGate';
import type { ChecklistItem } from '@/components/tasks/TaskChecklist';
import { markCompleted } from '@/app/operative/actions';

export function CompletionGateForm({
  taskId,
  checklist,
  photosCount,
  requiredPhotos,
}: {
  taskId: string;
  checklist: ChecklistItem[];
  photosCount: number;
  requiredPhotos: number;
}) {
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(() => {
      const fd = new FormData();
      fd.append('task_id', taskId);
      void markCompleted(fd);
    });
  }

  return (
    <CompletionGate
      checklist={checklist}
      photosCount={photosCount}
      requiredPhotos={requiredPhotos}
      onComplete={handleComplete}
      loading={isPending}
    />
  );
}
