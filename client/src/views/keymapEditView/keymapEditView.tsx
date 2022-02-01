import { Show, createSignal, onMount, onCleanup } from "solid-js";
import KeyLayout from "../../components/keyLayout/keyLayout";
import _basic from "../../jsonKeycodes/basic-keycodes.json"
import { KeyCode } from "../../types/types";
import { Router, Routes, Route, Link } from "solid-app-router";
import UsableKeyCodeDisplay from "../../components/usableKeyCodeDisplay/usableKeyCodeDisplay";
import NewBoardSetup from "../../components/newBoardSetup/newBoardSetup";
import { ClientManager } from "../../logic/clientManager";
const clientManager = ClientManager.getInstance()


type PageProps = {

};

export default function KeymapEditView(props: PageProps) {
    const [isScaning, setIsScaning] = createSignal(false)
    const updatelocalIsScaning = () => {
        setIsScaning(clientManager.scaning)
        console.log("scaning updating", isScaning())
    }
    const subId = clientManager.Subscribe(updatelocalIsScaning)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })
    const returnEditView = () => {
        if (isScaning()) {
            return (

                <NewBoardSetup />

            )
        } else {
            return (
                <>
                    <KeyLayout layer={0} />
                    <UsableKeyCodeDisplay />
                </>
            );
        }
    }
    return (
        <div className="keymapEditView">
            {returnEditView()}
        </div>
    );



}
