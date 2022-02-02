import "./usableKeyCodes.css"
import { Show, createSignal, onMount, For } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types"
import SingleUsableKeyCode from "../singleUsableKeyCode/singleUsableKeyCode";
type UsableKeyCodesProps = {
    keycodes: KeyCode[]
    layout: LayoutKey[] | undefined
};

export default function UsableKeyCodes(props: UsableKeyCodesProps) {
    onMount(() => {
        console.log("prop", props)
    });
    const returnLoop = () => {
        if (props.layout) {
            return (<For each={props.layout} fallback={<div>Loading...</div>}>
                {(key, index) => {
                    const code = index() >= (props.keycodes.length) ? props.keycodes[props.keycodes.length - 1] : props.keycodes[index()]
                    return (<SingleUsableKeyCode code={code} layoutKey={key} />)
                }}
            </For>)
        } else {
            return (<For each={props.keycodes} fallback={<div>Loading...</div>}>
                {(key) => <SingleUsableKeyCode code={key} layoutKey={undefined} />}
            </For>)
        }
    }
    return (
        <div className="usableKeyCodes">
            <div className={`usableKeyCodes__keycodes ${props.layout ? "usableKeyCodes__keycodes__layout" : ""}`}>
                {returnLoop()}
            </div>
        </div>
    );
}
