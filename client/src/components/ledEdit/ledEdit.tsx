import "./ledEdit.css"
import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types"
import "color-picker-web-component"
import { ClientManager } from "../../logic/clientManager";
import { Color } from "../../logic/color";
import UableLedColors from "../usableLedColors/usableLedColors";
const clientManager = ClientManager.getInstance()
type LedEditProps = {

};

export default function LedEdit(props: LedEditProps) {
    const [currentColor, setCurrentColor] = createStore({ r: 0, g: 0, b: 0 }),
        [changesMade, SetChangesMade] = createSignal(clientManager.changesMade)
    const updateLocalChangesMade = () => {
        SetChangesMade(clientManager.changesMade)
    }
    const subId = clientManager.Subscribe(updateLocalChangesMade)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })
    const setColor = () => {
        clientManager.NoticeToUpdateKey(new Color(currentColor.r, currentColor.g, currentColor.b))
    }
    const colorChange = (e: any) => {
        const [r, g, b] = e.detail.value.substring(0, e.detail.value.length - 1).substring(4).split(",")
        setCurrentColor({ r, g, b })
    }
    const saveMap = () => {
        clientManager.SaveMap()
    }
    return (
        <div className="LedEdit" >
            <button class={`${changesMade() ? "inline-block px-2 py-2 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out" :
                "inline-block px-2 py-2 bg-gray-200 text-gray-700 font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out"}`}
                onClick={saveMap}>
                save
            </button>
            <div className="LedEdit__colorPicker" >
                {/*@ts-ignore*/}
                <color-picker
                    onChange={colorChange}
                    id="picker"
                    value="#ff0000"
                    formats="rgb"
                // selectedformat="hex"
                >
                    {/*@ts-ignore*/}
                </color-picker>
            </div>
            <div className="LedEdit__control" >
                <button onClick={setColor} className="inline-block px-2 py-2 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out">
                    set
                </button>

            </div>
            <div className="LedEdit__useable" >
                <UableLedColors />

            </div>

        </div>
    );
}
