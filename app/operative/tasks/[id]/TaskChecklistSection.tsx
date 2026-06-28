'use client';

/**
 * Client wrapper that bridges the shared <TaskChecklist /> component to
 * the toggleChecklistItem server action. We keep an optimistic-ish local
 * view so the checkbox flips immediately — the action then revalidates
 * the page and the prop-driven items take over again.
 *
 * We use useTransition so a slow round-trip doesn't block further toggles
 * (the user can rattle through 8 items without each one stalling on the
 * previous network call).
 */
import { useOptimistic, useTransition } from 'react';
import {
  TaskChecklist,
  type ChecklistItem,
} from '@/components/tasks/TaskChecklist';
import { toggleChecklistItem } from '@/app/operative/actions';

export function TaskChecklistSection({
  taskId,
  items,
  readOnly = false,
  userNames,
}: {
  taskId: string;
  items: ChecklistItem[];
  readOnly?: boolean;
  userNames?: Record<string, string>;
}) {
  const [, startTransition] = useTransition();
  // useOptimistic gives us instant visual feedback while the server
  // action is in-flight — without it the checkbox would appear to lag
  // by the full RTT, which feels broken on mobile data.
  const [optimisticItems, applyOptimistic] = useOptimistic<
    ChecklistItem[],
    { key: string; done: boolean }
  >(items, (state, { key, done }) =>
    state.map((it) => (it.key === key ? { ...it, done } : it)),
  );

  function handleToggle(key: string, done: boolean) {
    startTransition(() => {
      applyOptimistic({ key, done });
      const fd = new FormData();
      fd.append('task_id', taskId);
      fd.append('item_key', key);
      fd.append('done', done ? '1' : '0');
      void toggleChecklistItem(fd);
    });
  }

  return (
    <TaskChecklist
      items={optimisticItems}
      onToggle={handleToggle}
      readOnly={readOnly}
      userNames={userNames}
    />
  );
}
