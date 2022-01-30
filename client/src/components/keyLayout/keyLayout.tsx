import { Show, createState, createSignal, onMount } from "solid-js";
import SingleLayoutKey from "../singleLayoutKey/singleLayoutKey";

type KeyLayoutProps = {

};

export interface KeyCode {
    code: string;
    display: string;
    keybinding: string;
    canHaveSub: boolean;
    canHaveSubNumber: boolean;
    subNumber: number;
    description: string;
    subOne?: KeyCode;
    subTwo?: KeyCode;
}
const testKeyCode: KeyCode = {
    code: "KC.A",
    display: "",
    keybinding: "",
    canHaveSub: false,
    canHaveSubNumber: false,
    subNumber: 0,
    description: ""
}
export default function KeyLayout(props: KeyLayoutProps) {

    return (
        <div className="App">
            <SingleLayoutKey index={1} layer={0} code={testKeyCode} />

        </div>
    );
}
