import "./singleUsableKeyCode.css"
import { Show, createState, createSignal, onMount } from "solid-js";
import { KeyCode } from "../../types/types";

type SingleUsableKeyCodeProps = {
    code: KeyCode;
};

export default function SingleUsableKeyCode(props: SingleUsableKeyCodeProps) {
    const mainButtonPress = () => {
        console.log("main button press", props.code.code);
    }

    return (

        <button onClick={mainButtonPress} className="SingleUsableKeyCode">
            {props.code.code}
        </button>
    );
}
