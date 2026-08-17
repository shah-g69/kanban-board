import { Plus } from "lucide-react";

function Illustration() {
  return (
    <svg
      width="200"
      height="150"
      viewBox="0 0 200 150"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-sm"
    >
      <defs>
        <linearGradient
          id="empty-blob"
          x1="0"
          y1="0"
          x2="200"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8b5cf6" stopOpacity="0.16" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* soft brand glow */}
      <circle cx="100" cy="75" r="64" fill="url(#empty-blob)" />

      {/* column stubs */}
      <rect
        x="40"
        y="46"
        width="36"
        height="64"
        rx="7"
        className="fill-slate-200 dark:fill-white/10"
      />
      <rect
        x="82"
        y="32"
        width="36"
        height="78"
        rx="7"
        className="fill-slate-200 dark:fill-white/10"
      />
      <rect
        x="124"
        y="52"
        width="36"
        height="58"
        rx="7"
        className="fill-slate-200 dark:fill-white/10"
      />

      {/* cards sitting in the columns */}
      <rect
        x="46"
        y="52"
        width="24"
        height="13"
        rx="4"
        className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-white/10"
        strokeWidth="1.5"
      />
      <rect
        x="88"
        y="38"
        width="24"
        height="13"
        rx="4"
        className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-white/10"
        strokeWidth="1.5"
      />
      <rect
        x="88"
        y="58"
        width="24"
        height="13"
        rx="4"
        className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-white/10"
        strokeWidth="1.5"
      />
      <rect
        x="130"
        y="58"
        width="24"
        height="13"
        rx="4"
        className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-white/10"
        strokeWidth="1.5"
      />

      {/* floating card with motion trails */}
      <rect
        x="99"
        y="12"
        width="26"
        height="17"
        rx="4"
        className="fill-violet-500 shadow-lg"
      />
      <rect
        x="104"
        y="17"
        width="12"
        height="2"
        rx="1"
        className="fill-white/70"
      />
      <rect
        x="104"
        y="22"
        width="8"
        height="2"
        rx="1"
        className="fill-white/40"
      />
      <path
        d="M97 20.5h-9M95 16h-5M103 20.5h9M105 16h5"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 4"
        className="stroke-violet-400"
      />

      {/* sparkle */}
      <path
        d="M164 96l2.2 4.6 4.6 2.2-4.6 2.2L164 109.6l-2.2-4.6-4.6-2.2 4.6-2.2z"
        className="fill-violet-300 dark:fill-violet-500/60"
      />
      <circle cx="30" cy="98" r="2.5" className="fill-slate-300 dark:fill-white/15" />
      <circle cx="170" cy="36" r="1.8" className="fill-slate-300 dark:fill-white/15" />
    </svg>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex animate-fade-in-up flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/60 px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.03]">
      <Illustration />

      <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
