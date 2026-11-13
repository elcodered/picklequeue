import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./login";

createRoot(document.getElementById("login-root")).render(
    <React.StrictMode>
        <Login />
    </React.StrictMode>
);