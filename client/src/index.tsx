import "solid-js";
import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
import { ClientManager } from "./logic/clientManager";
const clientManager = ClientManager.getInstance()
render(App, document.getElementById("root") as Node);
