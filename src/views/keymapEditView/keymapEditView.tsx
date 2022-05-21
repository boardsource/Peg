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
import MainView from "../../components/mainView/mainView";


const clientManager = ClientManager.getInstance()
const keyMap = KeyMap.getInstance()


type KeymapEditViewProps = {
    isLed: boolean
    isEncoder: boolean
    title: string
};

export default function KeymapEditView(props: KeymapEditViewProps) {



    const returnEditView = () => {

        return (
            <>

                <KeyLayout layer={0} isLed={props.isLed} isEncoder={props.isEncoder} />
                {props.isLed ?
                    <LedEdit /> : <UsableKeyCodeDisplay />
                }

                {/* <ShareFeature featureType={props.isLed ? ShareableFeatureType.ledMaps : ShareableFeatureType.keyMaps} /> */}


            </>
        );

    }
    const isSupported = () => {
        if (props.isEncoder && keyMap.keyLayout) {
            return keyMap.keyLayout.features.encoders
        }
        if (props.isLed && keyMap.keyLayout) {
            return keyMap.keyLayout.features.perkey
        }
        return true
    }
    const returnDescription = () => {
        if (props.isEncoder) {
            return "Encoders are another want to interact with your keyboard. Beyond being able to press some inputs are better used with a knob like volume. This view will let you configure this feature"
        }
        if (props.isLed) {
            return "Led are a great way to match your keyboard to the rest of your setup Or just help you see in the dark. This view will let you configure this feature"
        }
        return "Your Keymap is the primary way for you to get your keyboard to work for you. Put the keys exactly where you want them. This view will let you configure this feature"
    }

    return (

        <MainView title={props.title} supported={isSupported()} description={returnDescription()} featureType={props.isLed ? ShareableFeatureType.ledMaps : ShareableFeatureType.keyMaps} showNoBoardFallBack={true}>

            <div className="keymapEditView flex flex-col w-full h-full">
                <DragDropProvider>
                    <DragDropSensors>
                        {returnEditView()}
                    </DragDropSensors>
                </DragDropProvider>
            </div>
        </MainView>
    );



}
