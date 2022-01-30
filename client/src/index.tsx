import "solid-js";
import { render } from "solid-js/web";
import "tailwindcss/tailwind.css"
import "./index.css";
import App from "./App";

import { KeyMap } from "./logic/keymapManager"
const keymap = KeyMap.getInstance()
//@ts-ignore
window.electron.ipcRenderer.on('UpdateKeyMap', (arg: any) => {
    keymap.Test(arg)
})
//@ts-ignore

// window.electron.ipcRenderer.send('UpdateKeyMap', "fuck yeah")
render(App, document.getElementById("root") as Node);
