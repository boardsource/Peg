import "./singleLayoutKey.css"
import { Show, createSignal, onMount } from "solid-js";
import { KeyCode } from "../../types/types";
import { LayoutKey } from "../../types/types";
import { magicNumbers } from "../../magicNumbers";
import { ClientManager } from "../../logic/clientManager";
const clientManager = ClientManager.getInstance()
type SingleLayoutKeyProps = {
    code: KeyCode;
    index: number;
    layer: number;
    layoutKey: LayoutKey
};

export default function SingleLayoutKey(props: SingleLayoutKeyProps) {
    const mainButtonPress = () => {
        clientManager.NoticeThatKeyIsWaiting(props.index, props.layer, false)
    }
    const clearButtonPress = () => {
        console.log("clear button press", props.code.code);
    }
    const returnStyles = () => {
        return `
            left: ${props.layoutKey.x * magicNumbers.keyMultiplyer}px;
            top: ${props.layoutKey.y * magicNumbers.keyMultiplyer}px;
            width: ${props.layoutKey.w * magicNumbers.keyMultiplyer}px;
        `
    }

    return (
        <div className="singleLayoutKey" style={returnStyles()}>
            <button onClick={mainButtonPress} className="singleLayoutKey__main">
                {props.code.code}
            </button>
            <button onClick={clearButtonPress} className="singleLayoutKey__clear">
                x
            </button>
        </div>
    );
}
