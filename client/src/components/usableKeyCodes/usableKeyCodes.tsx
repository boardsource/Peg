import { Show, createState, createSignal, onMount, For } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCode } from "../../types/types"
import SingleUsableKeyCode from "../singleUsableKeyCode/singleUsableKeyCode";
type UsableKeyCodesProps = {
    keycodes: KeyCode[]
};

export default function UsableKeyCodes(props: UsableKeyCodesProps) {
    onMount(() => {

    });
    return (
        <div className="usableKeyCodes">
            <div className="usableKeyCodes__keycodes">
                <For each={props.keycodes} fallback={<div>Loading...</div>}>
                    {(key) => <SingleUsableKeyCode code={key} />}
                </For>
            </div>
        </div>
    );
}
