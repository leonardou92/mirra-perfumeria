import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Define a robust fallback for _jsxDEV before evaluating the app module.
// We must import `App` dynamically because static imports are hoisted and
// would be evaluated before this fallback runs.
if (typeof (globalThis as any)._jsxDEV !== "function") {
	(globalThis as any)._jsxDEV = (type: any, props: any) => React.createElement(type, props);
}

const root = createRoot(document.getElementById("root")!);

// Dynamically import App after ensuring the fallback exists so module
// evaluation in `App` won't throw due to a missing helper.
import("./App").then((mod) => {
	const App = mod.default;
	root.render(React.createElement(App));
});
