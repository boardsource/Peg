import { createSignal, onCleanup, Show } from "solid-js";
import { ClientManager } from "../../logic/clientManager";
import { KeyMap } from "../../logic/keymapManager";
import { ElectronEvents } from "../../types/types";
import Button from "../button/button";
import NewBoardSetup from "../newBoardSetup/newBoardSetup";

import pegSquareLogo from '../../images/peg_square_logo.svg'


const clientManager = ClientManager.getInstance()

const keyMap = KeyMap.getInstance()

type LoadingBoardProps = {
    children: any
};

export default function LoadingBoard(props: LoadingBoardProps) {
    const [isScanning, setIsScanning] = createSignal(true),
        [haveMap, setHaveMap] = createSignal(keyMap.layout !== undefined),
        [showSetup, setShowSetup] = createSignal(false)


    const updateLocalIsScanning = () => {

        if (!showSetup() && clientManager.scaning) {
            setTimeout(() => {
                setShowSetup(true)
            }, 1);
        }
        setIsScanning(clientManager.scaning)

    }
    const updateLocalHaveMap = () => {
        setHaveMap(keyMap.layout !== undefined)
        if (keyMap.layout !== undefined) {
            setShowSetup(false)
        }
    }
    const subId = clientManager.Subscribe(updateLocalIsScanning)
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
    const returnCorrectView = () => {
        if (!haveMap()) {
            return (
                <div class="LoadingBoard flex flex-col w-full h-full justify-center relative">
                    <div className="flex flex-col items-center">
                        <img class='flex h-[11rem] mb-[1rem] self-center' src={pegSquareLogo} alt="peg application logo" />
                        {/* ****** this Show handles the 'scan again' features of the old loading page fallback, so if I understand correct the show should be true while the app is successfully scanning, and the show should be False when the app is not scanning and we also do not have a layout. The user can then make the app scan again.  */}
                        <Show when={!isScanning()} fallback={
                            <h4 className='mb-[3rem] animate-pulse text-base-300'>Scanning...</h4>
                        } >
                            <div className="flex flex-col bg-red-200 justify-center items-center">
                                <p className='text-[.75rem] max-w-[30rem]'><span className='text-warning'>Oops!</span> We found something while scanning but we aren't able to display the board. Please check your connected drives or visit <span className='text-primary'>peg.software/help</span> for more information.</p>
                                <Button className={`btn-warning animate-bounce btn-xs mt-3`} onClick={scanAgain} selected={true} >
                                    Scan Again
                                </Button>
                            </div>

                        </Show>
                        <Show when={showSetup()} fallback="" >
                            <NewBoardSetup />
                        </Show>

                    </div>
                </div>
            )


        } else {
            return (<>
                {props.children}
            </>)
        }
    }

    return (<>
        {returnCorrectView()}
    </>)


}
