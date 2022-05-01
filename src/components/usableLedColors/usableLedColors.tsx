import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types"
import { ClientManager } from "../../logic/clientManager";
import { Color } from "../../logic/color";
import SingleUsableKeyCode from "../singleUsableKeyCode/singleUsableKeyCode";
const keymap = KeyMap.getInstance()
type UableLedColorsProps = {

};

export default function UableLedColors(props: UableLedColorsProps) {
    const colorsInUse = () => {
        let tempcolorsInUse: Set<string> = new Set()
        keymap.ledMap.forEach(color => {
            tempcolorsInUse.add(color.toString())
        });
        const colorsInUse: Color[] = Array.from(tempcolorsInUse).map(colorStr => {
            const isColor = Color.IsColor(colorStr)
            if (isColor === undefined) {
                return Color.Red()
            } else {
                return isColor
            }
        })
        return colorsInUse
    }
    const [currentColors, setCurrentColors] = createSignal(colorsInUse())

    const subId = keymap.Subscribe(() => setCurrentColors(colorsInUse()))
    onCleanup(() => {
        keymap.Unsubscribe(subId)
    })
    return (
        <div className="UableLedColors" >
            <For each={currentColors()} fallback={<div>Loading...</div>}>
                {(key) => <SingleUsableKeyCode code={key} layoutKey={undefined} />}
            </For>
        </div>
    );
}
