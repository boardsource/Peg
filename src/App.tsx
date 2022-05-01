
import "./App.css";
import Root from "./views/Root";
import { Router, } from "solid-app-router";
//import { AppProvider } from '@/stores/AppStore';
import { KeyMap } from "./logic/keymapManager";
export default function App() {

  return (
    <Router>
      <Root />
    </Router>
  );
}
