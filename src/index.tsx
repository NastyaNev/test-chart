import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./components/app/App";
import { ThemeProvider } from "./hooks/useTheme";

if (typeof window !== 'undefined') {
  const { worker } = await import("./mocks/browser");
  await worker.start({
    serviceWorker: {
      url: '/test-chart/mockServiceWorker.js'
    },
    onUnhandledRequest: 'bypass',
  });
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
