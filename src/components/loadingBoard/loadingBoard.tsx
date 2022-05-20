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
                <div class="LoadingBoard flex flex-col w-full h-full content-center relative">
                    <div className="flex flex-col">
                        <div className="flex flex-col mt-[7rem]">
                            <img class='flex h-[11rem] mb-[1rem]' src={pegSquareLogo} alt="peg application logo" />
                            <Show when={!isScanning()} fallback={
                                <h4 className='mb-[3rem] animate-pulse text-base-300 self-center'>Scanning...</h4>
                            } >
                                <div className="flex flex-col justify-center items-center">
                                    <p className='text-[.75rem] max-w-[27rem] text-center mb-2'><span className='text-warning'>Oops!</span> We found something while scanning but we aren't able to display the board. Please check your connected drives or visit <span className='text-primary'>peg.software/help</span> for more information.</p>
                                    <Button className={`btn-warning animate-bounce btn-xs mt-3`} onClick={scanAgain} selected={false} >
                                        Scan Again
                                    </Button>
                                </div>
                            </Show>
                        </div>

                        <div className="absolute bottom-0 w-full">
                            {/* <Show when={showSetup()} fallback="" > */}
                            <Show when={true} fallback="" >
                                <NewBoardSetup />
                            </Show>
                        </div>


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
