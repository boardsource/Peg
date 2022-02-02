import "./singleUsableKeyCode.css"
import { Show, createSignal, onMount } from "solid-js";
import { KeyCode, LayoutKey } from "../../types/types";
import { ClientManager } from "../../logic/clientManager";
import { magicNumbers } from "../../magicNumbers";
const clientManager = ClientManager.getInstance()
type SingleUsableKeyCodeProps = {
    code: KeyCode;
    layoutKey: LayoutKey | undefined
};

export default function SingleUsableKeyCode(props: SingleUsableKeyCodeProps) {
    const mainButtonPress = () => {
        clientManager.NoticeToUpdateKey(props.code)
    }
    const returnStyles = () => {
        if (props.layoutKey) {
            return `
            left: ${props.layoutKey.x * magicNumbers.keyMultiplyer}px;
            top: ${props.layoutKey.y * magicNumbers.keyMultiplyer}px;
            width: ${props.layoutKey.w * magicNumbers.keyMultiplyer}px;
            position:absolute;
        `
        }

    }
    return (

        <button onClick={mainButtonPress} style={returnStyles()} className="SingleUsableKeyCode">
            {props.code.code}
        </button>
    );
}
