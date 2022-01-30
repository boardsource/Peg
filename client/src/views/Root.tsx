import './main.sass'
import { Switch } from "solid-js";
import { Link, MatchRoute } from "@rturnq/solid-router";
import Landing from "./Landing/Landing";
import Page from "./Page/Page";
import KeymapEditView from "./keymapEditView/keymapEditView";
import Sidebar from '../components/sidebar/sidebar'

export default function Root() {
  return (
    <>
      <div className="peg-wrapper font-sans">
        <div className="peg-wrapper__sidebar">
          <Sidebar />
        </div>
        <div className="peg-wrapper__views flex p-6">
          <Switch fallback={<h1>404</h1>}>
            <MatchRoute end>
              <Landing />
            </MatchRoute>
            {/* i comment this out when i am working on stuff because it breaks widths */}
            <MatchRoute path="/:id">
              {(route) => <KeymapEditView id={route.params.id} />}
            </MatchRoute>
          </Switch>
        </div>


      </div>

    </>
  );
}
