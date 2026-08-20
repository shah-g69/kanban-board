import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, Plus, X } from "lucide-react";

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-violet-500";

function TaskModal({
  onClose,
  onCreate,
  initialTask,
  isEditing = false,
}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? ""
  );
  const [priority, setPriority] = useState(
    initialTask?.priority ?? "medium"
  );
  const [status, setStatus] = useState(
    initialTask?.status ?? "todo"
  );
  const [labelTags, setLabelTags] = useState(
    initialTask?.labels ?? []
  );
  const [labelInput, setLabelInput] = useState("");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Focus management: focus the first field on open, trap Tab within the
  // dialog, close on Escape, and restore focus to the trigger on unmount.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;

    dialog?.querySelector("input, select, textarea, button")?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.disabled);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      labels: labelTags,
      dueDate,
    });
  }

  function addLabel() {
    const trimmed = labelInput.trim();
    if (trimmed && !labelTags.includes(trimmed)) {
      setLabelTags([...labelTags, trimmed]);
      setLabelInput("");
    }
  }

  function removeLabel(labelToRemove) {
    setLabelTags(labelTags.filter((label) => label !== labelToRemove));
  }

  return (
    <>
      <style>{`
        @keyframes modal-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-panel-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-overlay-animate { animation: modal-overlay-in 0.2s ease-out; }
        .modal-panel-animate { animation: modal-panel-in 0.25s ease-out; }
      `}</style>

      <div
        className="modal-overlay-animate fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
          className="modal-panel-animate my-8 flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900"
        >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="task-modal-title"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            {isEditing ? "Edit Task" : "Create Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
            title="Close"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Build login page"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the task..."
              rows="3"
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className={inputClasses}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={inputClasses}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Labels
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={labelInput}
                onChange={(event) => setLabelInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addLabel();
                  }
                }}
                placeholder="e.g. Frontend"
                className={`${inputClasses} flex-1`}
              />
              <button
                type="button"
                onClick={addLabel}
                className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              Type a label and press Enter or click + to add.
            </p>

            {labelTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {labelTags.map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      aria-label={`Remove label ${label}`}
                      className="rounded p-0.5 text-violet-400 transition-colors hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-white/10 dark:hover:text-violet-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Due date
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className={`${inputClasses} pl-9`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]"
            >
              {isEditing ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default TaskModal;
