import {
  ArrowRight,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import EmptyState from "./EmptyState";

const typeStyles = {
  created: {
    icon: Plus,
    tint: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  moved: {
    icon: ArrowRight,
    tint: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-500/10",
  },
  completed: {
    icon: CheckCircle2,
    tint: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  deleted: {
    icon: Trash2,
    tint: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
  },
};

function timeAgo(timestamp) {
  const diffSeconds = Math.round((Date.now() - timestamp) / 1000);

  if (diffSeconds < 60) {
    return "just now";
  }

  const minutes = Math.round(diffSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function Activity({ activity }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Activity
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A record of what's been happening in this project.
        </p>
      </div>

      {activity.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="When you create, move, or complete tasks, the changes will show up here."
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <ul className="space-y-1">
            {activity.map((event) => {
              const style = typeStyles[event.type] ?? typeStyles.created;
              const Icon = style.icon;

              return (
                <li
                  key={event.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg}`}
                  >
                    <Icon className={`h-4 w-4 ${style.tint}`} />
                  </span>

                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {event.message}
                  </p>

                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    {timeAgo(event.timestamp)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Activity;
