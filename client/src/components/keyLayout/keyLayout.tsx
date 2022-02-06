import "./keyLayout.sass"
import { Show, createSignal, onMount, For, createResource, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types";
import SingleLayoutKey from "../singleLayoutKey/singleLayoutKey";
import { magicNumbers } from "../../magicNumbers";
import {
    useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { KeyCodes } from "../../logic/keycodes";
import { ClientManager } from "../../logic/clientManager";
import { Color } from "../../logic/color";

const keycodes = KeyCodes.getInstance()
const keymap = KeyMap.getInstance()
const clientManager = ClientManager.getInstance()
type KeyLayoutProps = {
    layer: number
    isLed: boolean
};

export default function KeyLayout(props: KeyLayoutProps) {
    const [keys, setKeys] = createSignal({ ...keymap.keyLayout })
        , [rowCount, setRowCount] = createSignal(3)
        , [currentLayer, setCurrentLayer] = createSignal(0)
        //@ts-ignore
        , [_, { onDragEnd }] = useDragDropContext();

    //@ts-ignore
    onDragEnd(({ draggable, droppable }) => {
        if (droppable) {
            let code: KeyCode | Color
            const isColor = Color.IsColor(draggable.id)
            if (isColor !== undefined) {
                code = isColor
            } else {
                code = keycodes.KeyCodeForString(draggable.id)
            }
            const [layer, index] = droppable.id.split(":")
            clientManager.ForceKeyChange(layer, index, code)
        }
    });

    const setkeys = (_newMap: KeyMap) => {
        let tempKeys = { ...keymap.keyLayout }
        if (tempKeys.layout) {
            setRowCount(tempKeys.layout[tempKeys.layout.length - 1].y)
        }
        setKeys(tempKeys)
    }
    const subId = keymap.Subscribe(setkeys)
    onCleanup(() => {
        keymap.Unsubscribe(subId)
    })
    const returnHeight = () => {
        if (keys().layout) {
            return `height:${(rowCount() + 1) * magicNumbers.keyMultiplyer}px;`
        } else {
            return `height:${6 * magicNumbers.keyMultiplyer}px;`
        }
    }
    //todo map over underglow leds and show that when layer === 4
    return (
        <div className="keyLayout" style={returnHeight()}>
            <div className=" keyLayout__keys">
                <For each={keys().layout} fallback={<div>Loading...</div>}>
                    {(layoutKey, index) => (
                        <SingleLayoutKey index={index()} layer={currentLayer()}
                            code={keymap.keymap[currentLayer()][index()]}
                            layoutKey={layoutKey}
                            isLed={props.isLed}
                        />)}
                </For>
            </div>
            <div className="keyLayout__layers">
                <h3>Layers</h3>
                <For each={Array.from(Array(props.isLed ? 5 : 4))} fallback={<div>Loading...</div>}>
                    {(_, index) => (
                        <button className={`$inline-block px-2 py-1 border-2  border-purple-600 ${currentLayer() === index() ? "bg-purple-600 text-white" : " text-purple-600"} font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`}
                            onClick={() => setCurrentLayer(index())}
                        >
                            {index() === 4 ? `underglow` : `layer ${index()}`}
                        </button>
                    )}
                </For>

            </div>
        </div>
    );
}
