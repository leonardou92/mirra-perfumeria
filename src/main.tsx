import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";


if (typeof (globalThis as any)._jsxDEV !== "function") {
	(globalThis as any)._jsxDEV = (type: any, props: any) => React.createElement(type, props);
}

const root = createRoot(document.getElementById("root")!);

import("./App").then((mod) => {
	const App = mod.default;
	root.render(React.createElement(App));
});
