import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Fallback for _jsxDEV emitted by some JSX transforms when runtime helpers
// are not injected correctly in certain environments (fixes `_jsxDEV is not a function`).
if (typeof (globalThis as any)._jsxDEV !== "function") {
	(globalThis as any)._jsxDEV = (type: any, props: any) => React.createElement(type, props);
}

const root = createRoot(document.getElementById("root")!);
root.render(React.createElement(App));
