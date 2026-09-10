import { useCallback, useRef, useState } from "react";

const UNDO_WINDOW_MS = 6000;

// Deletes immediately (matches the app's existing optimistic-delete feel) but keeps
// the deleted item around long enough to restore it via `onRestore`, so a misclick
// isn't permanent. `onDelete`/`onRestore` do the actual API calls.
export function useUndoDelete({ onDelete, onRestore }) {
  const [pending, setPending] = useState(null);
  const timerRef = useRef(null);

  const deleteWithUndo = useCallback(
    async (item, label) => {
      await onDelete(item);
      if (timerRef.current) clearTimeout(timerRef.current);
      setPending({ item, label });
      timerRef.current = setTimeout(() => setPending(null), UNDO_WINDOW_MS);
    },
    [onDelete]
  );

  const undo = useCallback(async () => {
    if (!pending) return;
    clearTimeout(timerRef.current);
    const { item } = pending;
    setPending(null);
    await onRestore(item);
  }, [pending, onRestore]);

  const dismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    setPending(null);
  }, []);

  return { pending, deleteWithUndo, undo, dismiss };
}
