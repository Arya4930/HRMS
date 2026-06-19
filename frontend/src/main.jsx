import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);