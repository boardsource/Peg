import { Show, createSignal, onMount, For } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCodes } from "../../logic/keycodes";
import { KeyCode, LayoutKey } from "../../types/types"
import UsableKeyCodes from "../usableKeyCodes/usableKeyCodes";
import _ansi from "./layoutDisplays/ansi104.json"
const ansi = _ansi as LayoutKey[]
const keycodes = KeyCodes.getInstance()
type UsableKeyCodeDisplayProps = {

};

export default function UsableKeyCodeDisplay(props: UsableKeyCodeDisplayProps) {
    // disply name : logic name
    const keyCodeOptions = new Map(
        [
            ["Ansi", "basic"],
            ["Layers", "layers"],
            ["LED", "led"],
            ["Custom Codes", "customCodes"],
            ["Modifiers", "modifiers"],
            ["Shifted", "shifted"],
            ["LessUsed", "lessUsed"],
            ["Bluetooth", "bluetooth"],
            ["InternalCodes", "internalCodes"],
            ["International", "international"],
        ]
    )
    const usesLayout: Map<string, LayoutKey[] | undefined> = new Map(
        [
            ["basic", ansi],
            ["layers", undefined],
            ["led", undefined],
            ["customCodes", undefined],
            ["modifiers", undefined],
            ["shifted", undefined],
            ["lessUsed", undefined],
            ["bluetooth", undefined],
            ["internalCodes", undefined],
            ["international", undefined]
        ]
    )
    const [selectedKeyCodeName, setSelectedKeyCodeName] = createSignal("basic")
    return (
        <div className="UsableKeyCodeDisplay">
            <div className="UsableKeyCodeDisplay__options">
                <For each={Array.from(keyCodeOptions.keys())} fallback={<div>Loading...</div>}>
                    {(key) =>
                        <button onClick={() => {
                            //@ts-ignore
                            setSelectedKeyCodeName(keyCodeOptions.get(key))
                        }}>
                            {key}
                        </button>
                    }
                </For>
            </div>

            <div className="UsableKeyCodeDisplay__current">
                <UsableKeyCodes
                    //@ts-ignore
                    keycodes={Array.from(keycodes[selectedKeyCodeName()].values())}
                    layout={usesLayout.get(selectedKeyCodeName())}
                />
            </div>
        </div>
    );
}
