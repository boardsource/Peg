import './main.sass'
import { Switch } from "solid-js";
import { Router, Routes, Route, Link } from "solid-app-router";
import KeymapEditView from "./keymapEditView/keymapEditView";
import NotFound from './NotFound';
import Sidebar from '../components/sidebar/sidebar'
import ToolTipDisplay from '../components/tooltipDisplay/tooltipDisplay';
export default function Root() {
  return (
    <>

      <div className="peg-wrapper font-sans">
        <div className="peg-wrapper__sidebar">
          <Sidebar />
        </div>
        <div className="peg-wrapper__views flex p-6">
          <ToolTipDisplay />
          <Routes>
            {/* i comment this out when i am working on stuff because it breaks widths */}
            <Route path="/index.html" element={<KeymapEditView />} />
            <Route path="/index.html/led" element={<NotFound />} />
          </Routes>
        </div>


      </div>

    </>
  );
}
