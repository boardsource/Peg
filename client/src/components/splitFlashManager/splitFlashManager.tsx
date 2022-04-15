
import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { ClientManager } from "../../logic/clientManager";
import { Modal } from "../../logic/modal";

import { SplitFlashStage } from "../../types/types";

type SplitFlashManagerProps = {
    close: () => void
};

export const SplitFlashManager = (props: SplitFlashManagerProps) => {
    const clientManager = ClientManager.getInstance()
    const [state, setState] = createStore({ displayState: SplitFlashStage.MainSide })

    const updateLocalState = () => {
        setState({ displayState: clientManager.SplitFlashDisplayState });
    }
    const subId = clientManager.Subscribe(updateLocalState)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })
    const ChangeDisplayState = (newDisplayState: SplitFlashStage) => {
        clientManager.ChangeSplitFlashDisplayState(newDisplayState)
    }
    const ReturnDisplayState = () => {


        switch (state.displayState) {
            case SplitFlashStage.MainSide:

                return (
                    <div className="SplitFlashManager">
                        <h4>
                            You made changes to your LED map.
                        </h4>
                        <p>
                            Because of this we need to update the other side. We are going to get though this together.
                        </p>
                        <p>
                            First we need you to unplug your main side (left side)
                        </p>
                        <p>
                            Push the button Below when you are done.
                        </p>
                        <button class="inline-block px-2 py-2 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                            onClick={() => ChangeDisplayState(SplitFlashStage.Unplugged)}>
                            Ok Done
                        </button>
                    </div>

                );
            case SplitFlashStage.Unplugged:

                return (
                    <div className="SplitFlashManager">
                        <h4>
                            Good job Plug
                        </h4>
                        <p>
                            Next Plug in the second side.
                        </p>
                        <p>
                            Dont worry I'll wait here until its done
                        </p>
                        <p>
                            ...... you know Im not hourly right?
                        </p>

                    </div>

                );
            case SplitFlashStage.OffSide:

                return (
                    <div className="SplitFlashManager">
                        <h4>
                            Sorry Im back I was playing a game of go while I waited on you.
                        </h4>
                        <p>
                            I Will go ahead and flash the changes to this side too one sec.
                        </p>

                    </div>

                );
            case SplitFlashStage.Finished:
                return (
                    <div className="SplitFlashManager">
                        <h4>
                            Done
                        </h4>
                        <p>
                            When I tell you to wait I make it quick....
                        </p>
                        <p>
                            Just saying
                        </p>

                        <p>
                            If you want to change this OLED if you have one feel free to keep this side plugged in and make the changes.
                        </p>
                        <p>
                            But otherwise swap back to having the main side plugged in.
                        </p>
                        <p>
                            I hope you have a AWESOME day.
                        </p>
                        <button class="inline-block px-2 py-2 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                            onClick={() => props.close()}>
                            Close
                        </button>
                    </div>
                );
        }
    }
    return (<div className="SplitFlashManager">
        {ReturnDisplayState()}
    </div>)


}


