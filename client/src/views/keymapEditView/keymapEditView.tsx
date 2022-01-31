import { Show, createSignal, onMount } from "solid-js";
import KeyLayout from "../../components/keyLayout/keyLayout";
import UsableKeyCodes from "../../components/usableKeyCodes/usableKeyCodes";
import _basic from "../../jsonKeycodes/basic-keycodes.json"
import { KeyCode } from "../../types/types";

import { Router, Routes, Route, Link } from "solid-app-router";


type PageProps = {

};

export default function KeymapEditView(props: PageProps) {
    //@ts-ignore

    const basicKeycodes = _basic as KeyCode[];

    return (
        <div className="keymapEditView">
            <KeyLayout layer={0} />
            <UsableKeyCodes keycodes={basicKeycodes} />
        </div>
    );
}
