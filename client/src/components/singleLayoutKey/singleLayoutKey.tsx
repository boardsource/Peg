import "./singleLayoutKey.css"
import { Show, createState, createSignal, onMount } from "solid-js";
import { KeyCode } from "../../types/types";

type SingleLayoutKeyProps = {
    code: KeyCode;
    index: number;
    layer: number;
};

export default function SingleLayoutKey(props: SingleLayoutKeyProps) {
    const mainButtonPress = () => {
        console.log("main button press", props.code.code);
    }
    const clearButtonPress = () => {
        console.log("clear button press", props.code.code);
    }

    return (
        <div className="singleLayoutKey">
            <button onClick={mainButtonPress} className="singleLayoutKey__main">
                {props.code.code}
            </button>
            <button onClick={clearButtonPress} className="singleLayoutKey__clear">
                x
            </button>
        </div>
    );
}
