
import "./App.css";
import Root from "./views/Root";
import { Router, pathIntegration } from "@rturnq/solid-router";
//import { AppProvider } from '@/stores/AppStore';
import { KeyMap } from "./logic/keymapManager";
export default function App() {

  return (
    <Router integration={pathIntegration()}>
      <Root />
    </Router>
  );
}
