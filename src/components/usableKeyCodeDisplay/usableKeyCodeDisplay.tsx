import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCodes } from "../../logic/keycodes";
import { KeyCode, LayoutKey } from "../../types/types"
import UsableKeyCodes from "../usableKeyCodes/usableKeyCodes";
import _ansi from "./layoutDisplays/ansi104.json"
import { ClientManager } from "../../logic/clientManager";
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

    const returnKeyCodeArray = (): KeyCode[] => {
        //@ts-ignore
        const tempArray: KeyCode[] = Array.from(keycodes[selectedKeyCodeName()].values())
        if (tempArray.length > 0) {
            return tempArray
        } else { return [] }
    }
    return (
        <div className="UsableKeyCodeDisplay flex flex-col flex-1 w-full">
            <div className="UsableKeyCodeDisplay__options mb-4 flex flex-wrap tabs tabs-boxed self-start">
                <For each={Array.from(keyCodeOptions.keys())} fallback={<div>Loading...</div>}>
                    {(key) =>
                        <a
                            className={`tab transition-all tab-sm ${selectedKeyCodeName() === keyCodeOptions.get(key) ? 'tab-active' : ''}`}
                            onClick={() => {
                                //@ts-ignore
                                setSelectedKeyCodeName(keyCodeOptions.get(key))
                            }}
                        >
                            {key}</a>
                    }
                </For>
            </div>



            <div className="UsableKeyCodeDisplay__current flex relative">

                <UsableKeyCodes

                    keycodes={returnKeyCodeArray()}
                    layout={usesLayout.get(selectedKeyCodeName())}
                    className="w-3/4"
                />

                <div className="flex flex-col w-1/6 absolute right-0">
                    {/* this looks funky but it works maybe just remove the title */}
                    <h2 className='mt-1 mb-2'>Commonly Used</h2>
                    <UsableKeyCodes
                        //@ts-ignore
                        keycodes={Array.from(keycodes.bonusCodes.values())}
                        layout={undefined}
                        className="w-full"

                    />


                </div>


            </div>
        </div>
    );
}
function updateLocalChanges(updateLocalChanges: any) {
    throw new Error("Function not implemented.");
}

