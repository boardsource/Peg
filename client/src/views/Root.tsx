import './main.sass'
import { Switch } from "solid-js";
import { Router, Routes, Route, Link } from "solid-app-router";
import KeymapEditView from "./keymapEditView/keymapEditView";
import LED from './led/led'
import OLED from './oled/oled'
import Tester from './tester/tester'
import Options from './options/options'
import Account from './account/account'
import NotFound from './NotFound';
import Sidebar from '../components/sidebar/sidebar'
export default function Root() {
  return (
    <>
      <div className="peg-wrapper font-sans bg-gray-200">
        <div className="peg-wrapper__sidebar">
          <Sidebar />
        </div>
        <div className="peg-wrapper__views flex-1 bg-white rounded-xl m-5 flex p-6">
          <Routes>
            {/* i comment this out when i am working on stuff because it breaks widths */}
            <Route path="/index.html" element={<KeymapEditView />} />
            <Route path="/index.html/led" element={<LED />} />
            <Route path="/index.html/oled" element={<OLED />} />
            <Route path="/index.html/tester" element={<Tester />} />
            <Route path="/index.html/options" element={<Options />} />
            <Route path="/index.html/account" element={<Account />} />
          </Routes>
        </div>


      </div>

    </>
  );
}
