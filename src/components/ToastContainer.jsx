import { useContext } from "react";
import { CheckCircle, X, XCircle } from "lucide-react";
import { ToastContext } from "../Context/toastContext";

const typeConfig = {
  success: {
    icon: CheckCircle,
    containerClass:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
    iconClass: "text-emerald-500 dark:text-emerald-400",
    textClass: "text-emerald-800 dark:text-emerald-200",
    closeClass:
      "text-emerald-400 hover:text-emerald-600 dark:text-emerald-500 dark:hover:text-emerald-300",
  },
  error: {
    icon: XCircle,
    containerClass:
      "border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10",
    iconClass: "text-rose-500 dark:text-rose-400",
    textClass: "text-rose-800 dark:text-rose-200",
    closeClass:
      "text-rose-400 hover:text-rose-600 dark:text-rose-500 dark:hover:text-rose-300",
  },
};

function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6">
      {toasts.map((t) => {
        const config = typeConfig[t.type] ?? typeConfig.success;
        const Icon = config.icon;

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-xl animate-toast-in sm:w-auto ${config.containerClass}`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${config.iconClass}`} />

            <p className={`flex-1 text-sm font-medium ${config.textClass}`}>
              {t.message}
            </p>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className={`shrink-0 rounded-lg p-1 transition-colors ${config.closeClass}`}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
