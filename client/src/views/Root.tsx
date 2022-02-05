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
import Topbar from '../components/topbar/topbar'
import Menubar from '../components/menubar/menubar'
import ToolTipDisplay from '../components/tooltipDisplay/tooltipDisplay';
import MakeCustomCodes from './makeCustomCodes/makeCustomCodes';


export default function Root() {
  return (
    <>
      {/* bg-gray-200 */}
      <div className="peg-wrapper relative font-sans">
        <Menubar />
        <div className="peg-wrapper__sidebar">
          <Sidebar />
        </div>

        <div className="peg-wrapper__views flex flex-1 flex-col m-5">
          <div className="peg-wrapper__views__topbar flex mb-5">
            <Topbar />
          </div>

          <div className="peg-wrapper__views__main flex flex-1 bg-white">
            <ToolTipDisplay />
            <Routes>
              {/* i comment this out when i am working on stuff because it breaks widths */}
              <Route path="/index.html" element={<KeymapEditView isLed={false} />} />
              <Route path="/index.html/led" element={<KeymapEditView isLed={true} />} />
              <Route path="/index.html/oled" element={<OLED />} />
              <Route path="/index.html/makeCustom" element={<MakeCustomCodes />} />
              <Route path="/index.html/tester" element={<Tester />} />
              <Route path="/index.html/options" element={<Options />} />
              <Route path="/index.html/account" element={<Account />} />
            </Routes>
          </div>
        </div>
      </div>

    </>
  );
}
