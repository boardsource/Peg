import { Show, createSignal, onMount, onCleanup } from "solid-js";
import KeyLayout from "../../components/keyLayout/keyLayout";
import _basic from "../../jsonKeycodes/basic-keycodes.json"
import { ElectronEvents, KeyCode } from "../../types/types";
import { Router, Routes, Route, Link } from "solid-app-router";
import UsableKeyCodeDisplay from "../../components/usableKeyCodeDisplay/usableKeyCodeDisplay";
import NewBoardSetup from "../../components/newBoardSetup/newBoardSetup";
import { ClientManager } from "../../logic/clientManager";
import { KeyMap } from "../../logic/keymapManager";
import LedEdit from "../../components/ledEdit/ledEdit";
import {
    DragDropProvider,
    DragDropSensors,
} from "@thisbeyond/solid-dnd";

const clientManager = ClientManager.getInstance()
const keyMap = KeyMap.getInstance()


type KeymapEditViewProps = {
    isLed: boolean
};

export default function KeymapEditView(props: KeymapEditViewProps) {
    const [isScaning, setIsScaning] = createSignal(clientManager.scaning)
        , [haveMap, setHaveMap] = createSignal(keyMap.layout !== undefined)
    const updatelocalIsScaning = () => {
        setIsScaning(clientManager.scaning)

        // console.log("scaning updating", isScaning())
    }
    const updateLocalHaveMap = () => {
        setHaveMap(keyMap.layout !== undefined)
    }
    const subId = clientManager.Subscribe(updatelocalIsScaning)
    const subId2 = keyMap.Subscribe(updateLocalHaveMap)

    onCleanup(() => {
        clientManager.Unsubscribe(subId)
        keyMap.Unsubscribe(subId2)
    })
    const scanAgain = () => {
        if (!clientManager.scaning && clientManager.keymap.layout === undefined) {
            clientManager.sendToBackend(ElectronEvents.Scan, "")
        }
    }

    const returnEditView = () => {
        if (isScaning()) {
            return (

                <NewBoardSetup />

            )
        } else {
            return (
                <>
                    <Show when={!haveMap()} fallback={""}>
                        <button className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out" onClick={scanAgain}>
                            scan Again
                        </button>
                    </Show>
                    <KeyLayout layer={0} isLed={props.isLed} />
                    {props.isLed ?
                        <LedEdit /> : <UsableKeyCodeDisplay />
                    }

                </>
            );
        }
    }
    return (
        <div className="keymapEditView" style="width:100%">
            <DragDropProvider>
                <DragDropSensors>
                    {returnEditView()}
                </DragDropSensors>
            </DragDropProvider>
        </div>
    );



}
