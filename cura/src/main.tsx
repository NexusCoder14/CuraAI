import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// Remove the boot orb once React mounts.
const boot = document.getElementById("boot");
if (boot) boot.style.transition = "opacity .4s";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

requestAnimationFrame(() => {
  if (boot) { boot.style.opacity = "0"; setTimeout(() => boot.remove(), 400); }
});
