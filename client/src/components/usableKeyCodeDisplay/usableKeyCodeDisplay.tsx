import { Show, createSignal, onMount, For } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCodes } from "../../logic/keycodes";
import { KeyCode } from "../../types/types"
import UsableKeyCodes from "../usableKeyCodes/usableKeyCodes";
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
                    keycodes={Array.from(keycodes[selectedKeyCodeName()].values())} />
            </div>
        </div>
    );
}
