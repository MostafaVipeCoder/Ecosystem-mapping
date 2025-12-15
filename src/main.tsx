import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css";
import "./i18n";
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
);
