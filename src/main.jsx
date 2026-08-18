import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App.jsx";
import { TaskProvider } from "./Context/TaskProvider";
import { ToastProvider } from "./Context/ToastProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </TaskProvider>
  </StrictMode>
);
