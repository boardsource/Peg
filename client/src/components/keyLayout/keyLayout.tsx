import "./keyLayout.css"
import { Show, createSignal, onMount, For, createResource, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyMap } from "../../logic/keymapManager";
import { LayoutKey } from "../../types/types";
import SingleLayoutKey from "../singleLayoutKey/singleLayoutKey";
import { magicNumbers } from "../../magicNumbers";
import {
    useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { KeyCodes } from "../../logic/keycodes";
import { ClientManager } from "../../logic/clientManager";

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
        //@ts-ignore
        , [_, { onDragEnd }] = useDragDropContext();

    //@ts-ignore
    onDragEnd(({ draggable, droppable }) => {
        if (droppable) {
            const code = keycodes.KeyCodeForString(draggable.id)
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



    return (
        <div className="KeyLayout" style={returnHeight()}>
            <For each={keys().layout} fallback={<div>Loading...</div>}>
                {(layoutKey, index) => (
                    <SingleLayoutKey index={index()} layer={props.layer}
                        code={keymap.keymap[props.layer][index()]}
                        layoutKey={layoutKey}
                        isLed={props.isLed}
                    />)}
            </For>
        </div>
    );
}
