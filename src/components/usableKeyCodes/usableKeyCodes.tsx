import "./usableKeyCodes.css"
import { Show, createSignal, onMount, For } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types"
import SingleUsableKeyCode from "../singleUsableKeyCode/singleUsableKeyCode";
type UsableKeyCodesProps = {
    keycodes: KeyCode[]
    layout: LayoutKey[] | undefined
    className?: string
};

export default function UsableKeyCodes(props: UsableKeyCodesProps) {
    // onMount(() => {

    // });
    const returnLoop = () => {
        if (props.layout) {
            return (<For each={props.layout} fallback={<div>Loading...</div>}>
                {(key, index) => {
                    const code = index() >= (props.keycodes.length) ? props.keycodes[props.keycodes.length - 1] : props.keycodes[index()]
                    return (<SingleUsableKeyCode code={code} layoutKey={key} index={index()} />)
                }}
            </For>)
        } else {
            return (<For each={props.keycodes} fallback={<div>Loading...</div>}>
                {(key, index) => <SingleUsableKeyCode code={key} layoutKey={undefined} index={index()} />}
            </For>)
        }
    }
    return (
        <div className={`usableKeyCodes ${props.className ? props.className : ""}`}>
            <div className={`usableKeyCodes__keycodes ${props.layout ? "usableKeyCodes__keycodes__layout" : ""}`}>
                {returnLoop()}
            </div>
        </div>
    );
}
