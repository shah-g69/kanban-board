export const DUE_WINDOW_DAYS = 14;

// How close the deadline is, as a 0-100 fill. The bar fills over the
// two weeks before the due date and saturates once it's overdue.
export function getDueProgress(dateStr) {
  const due = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - today) / 86400000);

  const pct =
    diffDays < 0
      ? 100
      : Math.min(
          100,
          Math.round(
            ((DUE_WINDOW_DAYS - diffDays) / DUE_WINDOW_DAYS) * 100
          )
        );

  let barClass = "bg-emerald-400";
  if (diffDays < 0) barClass = "bg-rose-500";
  else if (diffDays <= 1) barClass = "bg-amber-500";
  else if (diffDays <= 5) barClass = "bg-violet-500";

  return { pct, barClass };
}

// Human-friendly deadline label + chip styling.
export function getDueDateInfo(dateStr, isDone) {
  const due = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due - today) / 86400000);

  const neutral = {
    label: due.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    className:
      "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
  };

  if (isDone) {
    return neutral;
  }

  if (diffDays < 0) {
    return {
      label: `Overdue · ${Math.abs(diffDays)}d`,
      className:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    };
  }

  if (diffDays === 0) {
    return {
      label: "Due today",
      className:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    };
  }

  if (diffDays === 1) {
    return {
      label: "Due tomorrow",
      className:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    };
  }

  if (diffDays < 7) {
    return {
      label: `Due in ${diffDays}d`,
      className:
        "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
    };
  }

  return neutral;
}
