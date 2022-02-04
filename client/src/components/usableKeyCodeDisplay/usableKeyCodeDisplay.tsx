import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCodes } from "../../logic/keycodes";
import { KeyCode, LayoutKey } from "../../types/types"
import UsableKeyCodes from "../usableKeyCodes/usableKeyCodes";
import _ansi from "./layoutDisplays/ansi104.json"
import { ClientManager } from "../../logic/clientManager";
const clientManager = ClientManager.getInstance()
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
    const [selectedKeyCodeName, setSelectedKeyCodeName] = createSignal("basic"),
        [changesMade, SetChangesMade] = createSignal(clientManager.changesMade)
    const updateLocalChangesMade = () => {
        SetChangesMade(clientManager.changesMade)
    }
    const subId = clientManager.Subscribe(updateLocalChangesMade)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)

    })
    const saveMap = () => {
        clientManager.SaveMap()
    }
    return (
        <div className="UsableKeyCodeDisplay">
            <div className="UsableKeyCodeDisplay__options">
                <For each={Array.from(keyCodeOptions.keys())} fallback={<div>Loading...</div>}>
                    {(key) =>
                        <button class="inline-block px-2 py-1 border-2 border-purple-600 text-purple-600 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                            onClick={() => {
                                //@ts-ignore
                                setSelectedKeyCodeName(keyCodeOptions.get(key))
                            }}>
                            {key}
                        </button>
                    }
                </For>
                <button class={`${changesMade() ? "inline-block px-2 py-2 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out" :
                    "inline-block px-2 py-2 bg-gray-200 text-gray-700 font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out"}`}
                    onClick={saveMap}>
                    save
                </button>
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
function updateLocalChanges(updateLocalChanges: any) {
    throw new Error("Function not implemented.");
}

