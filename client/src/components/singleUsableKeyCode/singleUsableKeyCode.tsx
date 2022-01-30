import "./singleUsableKeyCode.css"
import { Show, createSignal, onMount } from "solid-js";
import { KeyCode } from "../../types/types";
import { ClientManager } from "../../logic/clientManager";
const clientManager = ClientManager.getInstance()
type SingleUsableKeyCodeProps = {
    code: KeyCode;
};

export default function SingleUsableKeyCode(props: SingleUsableKeyCodeProps) {
    const mainButtonPress = () => {
        clientManager.NoticeToUpdateKey(props.code)
    }

    return (

        <button onClick={mainButtonPress} className="SingleUsableKeyCode">
            {props.code.code}
        </button>
    );
}
