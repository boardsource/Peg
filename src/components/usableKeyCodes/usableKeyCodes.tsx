import "./usableKeyCodes.css"
import { For } from "solid-js";

import { KeyCode, LayoutKey } from "../../types/types"
import SingleUsableKeyCode from "../singleUsableKeyCode/singleUsableKeyCode";
import { Link } from "solid-app-router";
type UsableKeyCodesProps = {
    keycodes: KeyCode[]
    layout: LayoutKey[] | undefined
    className?: string
};

export default function UsableKeyCodes(props: UsableKeyCodesProps) {

    const returnLoop = () => {
        if (props.layout) {
            return (<For each={props.layout} fallback={<div>Loading...</div>}>
                {(key, index) => {
                    const code = index() >= (props.keycodes.length) ? props.keycodes[props.keycodes.length - 1] : props.keycodes[index()]
                    return (<SingleUsableKeyCode code={code} layoutKey={key} index={index()} />)
                }}
            </For>)
        } else {
            return (<For each={props.keycodes} fallback={<div>
                <Link href="/index.html/makeCustom" >  No Keycodes Yet Make Some Here </Link>
            </div>}>
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
