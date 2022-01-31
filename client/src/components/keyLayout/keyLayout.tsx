import "./keyLayout.css"
import { Show, createSignal, onMount, For, createResource, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyMap } from "../../logic/keymapManager";
import { LayoutKey } from "../../types/types";
import SingleLayoutKey from "../singleLayoutKey/singleLayoutKey";
import { magicNumbers } from "../../magicNumbers";
const keymap = KeyMap.getInstance()
type KeyLayoutProps = {
    layer: number
};

export default function KeyLayout(props: KeyLayoutProps) {
    const [keys, setKeys] = createSignal({ ...keymap.keyLayout })
        , [rowCount, setRowCount] = createSignal(0)

    const setkeys = (_newMap: KeyMap) => {
        console.log("updating")
        let tempKeys = { ...keymap.keyLayout }
        if (tempKeys.layout) {
            setRowCount(tempKeys.layout[tempKeys.layout.length - 1].y)
            console.log("updating")
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
                        code={keymap.keymap[props.layer][index()]} layoutKey={layoutKey} />)}
            </For>
        </div>
    );
}
