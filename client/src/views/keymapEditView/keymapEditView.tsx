import { Show, createState, createSignal, onMount } from "solid-js";
import KeyLayout from "../../components/keyLayout/keyLayout";
import UsableKeyCodes from "../../components/usableKeyCodes/usableKeyCodes";
import _basic from "../../jsonKeycodes/basic-keycodes.json"
import { KeyCode } from "../../types/types";

type PageProps = {
    id: string;
};

export default function KeymapEditView(props: PageProps) {
    //@ts-ignore
    const basicKeycodes = _basic as KeyCode[];
    return (
        <div className="keymapEditView">
            <KeyLayout />
            <UsableKeyCodes keycodes={basicKeycodes} />
        </div>
    );
}
