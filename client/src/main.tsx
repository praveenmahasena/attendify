import React from "react";
import{createRoot} from "react-dom/client";
import App from "./App";
import './assets/style.css'

const elem = document.querySelector("#root") as HTMLElement;
const root = createRoot(elem);

root.render(<App />);
