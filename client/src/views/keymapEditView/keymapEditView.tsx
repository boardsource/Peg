import { Show, createSignal, onMount, onCleanup } from "solid-js";
import KeyLayout from "../../components/keyLayout/keyLayout";
import _basic from "../../jsonKeycodes/basic-keycodes.json"
import { ElectronEvents, KeyCode, ShareableFeatureType } from "../../types/types";
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
import Button from "../../components/button/button";
import MainView from '../../components/mainView/mainView'
// import ShareFeature from "../../components/shareFeature/shareFeature";


const clientManager = ClientManager.getInstance()
const keyMap = KeyMap.getInstance()


type KeymapEditViewProps = {
    isLed: boolean
    isEncoder: boolean
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
                        <Button onClick={scanAgain} selected={true}>
                            scan Again
                        </Button>

                    </Show>
                    <KeyLayout layer={0} isLed={props.isLed} isEncoder={props.isEncoder} />
                    {props.isLed ?
                        <LedEdit /> : <UsableKeyCodeDisplay />
                    }
                    {/* <ShareFeature featureType={props.isLed ? ShareableFeatureType.ledMaps : ShareableFeatureType.keyMaps} /> */}

                </>
            );
        }
    }

    return (
        <MainView title='Keymap Editor' description={""}>
            <div className="keymapEditView flex flex-col bg-purple-500 w-full h-full">
                <DragDropProvider>
                    <DragDropSensors>
                        {returnEditView()}
                    </DragDropSensors>
                </DragDropProvider>
            </div>
        </MainView>

    );



}
