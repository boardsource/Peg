import { Switch } from "solid-js";
import { Link, MatchRoute } from "@rturnq/solid-router";
import Landing from "./Landing/Landing";
import Page from "./Page/Page";
import KeymapEditView from "./keymapEditView/keymapEditView";

export default function Root() {
  return (
    <>
      <Switch fallback={<h1>404</h1>}>
        <MatchRoute end>
          <Landing />
        </MatchRoute>
        <MatchRoute path="/:id">
          {(route) => <KeymapEditView id={route.params.id} />}
        </MatchRoute>
      </Switch>
    </>
  );
}
