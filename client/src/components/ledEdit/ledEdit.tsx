import "./ledEdit.css"
import { Show, createSignal, onMount, For } from "solid-js";
import { createStore } from "solid-js/store";

import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types"
import "color-picker-web-component"
import { ClientManager } from "../../logic/clientManager";
import { Color } from "../../logic/color";
const clientManager = ClientManager.getInstance()
type LedEditProps = {

};

export default function LedEdit(props: LedEditProps) {
    const [currentColor, setCurrentColor] = createStore({ r: 0, g: 0, b: 0 })
    const setColor = () => {
        clientManager.NoticeToUpdateKey(new Color(currentColor.r, currentColor.g, currentColor.b))
    }
    const colorChange = (e: any) => {
        const [r, g, b] = e.detail.value.substring(0, e.detail.value.length - 1).substring(4).split(",")
        setCurrentColor({ r, g, b })
    }
    return (
        <div className="LedEdit" >

            <div className="LedEdit__colorPicker" >
                {/*@ts-ignore*/}
                <color-picker
                    onChange={colorChange}
                    id="picker"
                    value="#ff0000"
                    formats="rgb"
                    selectedformat="hex"
                >
                    {/*@ts-ignore*/}
                </color-picker>
            </div>
            <div className="LedEdit__control" >
                <button onClick={setColor}>
                    set
                </button>
            </div>

        </div>
    );
}
