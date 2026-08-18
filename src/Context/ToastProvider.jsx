import { useCallback, useRef, useState } from "react";
import { ToastContext } from "./toastContext";

let nextId = 0;

export function ToastProvider({ children, duration = 3000 }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, { type = "success", duration: overrideDuration } = {}) => {
      const id = ++nextId;

      setToasts((current) => [...current, { id, message, type }]);

      timers.current[id] = setTimeout(
        () => removeToast(id),
        overrideDuration ?? duration
      );

      return id;
    },
    [duration, removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}
