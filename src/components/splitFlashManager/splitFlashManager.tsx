
import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { ClientManager } from "../../logic/clientManager";
import { Modal } from "../../logic/modal";
import Button from '../../components/button/button'
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
                        <h4 className='mb-1 text-sm'>
                            Some changes made to keymaps on split keyboards require both halves to be flashed separately. Don't worry! This is an easy process and we are here to walk you through it.
                        </h4>
                        <p className='text-sm'>
                            We already save the changes made to the main side (left side) of your board, now we are going to need to flash the changes to the second side (right side) of your board.
                        </p>
                        <div className='flex flex-col w-full border border-base-300 rounded rounded-md p-2 mt-4'>
                            <span className="text-xl text-primary">Step 1</span>
                            <p> Unplug the main side (left side) of your keyboard.</p>

                        </div>
                        <p className='text-[.75rem] mt-1'>
                            Push the button below when you've unplugged your main side (left half) of your keyboard.
                        </p>
                        <Button className={`btn btn-success btn-block mt-5`}
                            onClick={() => ChangeDisplayState(SplitFlashStage.Unplugged)}>
                            It's Unplugged!
                        </Button>
                    </div>

                );
            case SplitFlashStage.Unplugged:

                return (
                    <div className="SplitFlashManager">
                        <h4 className='mb-1 text-sm'>
                            Nice! Okay, since we need to make changes to the other half of your keyboard, we will need to plug that side in.
                        </h4>
                        <div className='flex flex-col w-full border border-base-300 rounded rounded-md p-2 mt-4'>
                            <span className="text-xl text-primary">Step 2</span>
                            <p>Plug in the second side (right side) of your keyboard.</p>
                        </div>
                        <p className='text-[.75rem] mt-1'>
                            Click the button below when you have your second side (right side) is plugged in.
                            <span>... you know I'm not hourly right?</span>
                        </p>
                        <Button className={`btn btn-success btn-block mt-5`}
                            onClick={() => ChangeDisplayState(SplitFlashStage.OffSide)}>
                            I Plugged My Right Side In!
                        </Button>
                    </div>

                );
            case SplitFlashStage.OffSide:

                return (
                    <div className="SplitFlashManager">
                        <h4 className='mb-1 text-sm'>
                            I'm back -- sorry if you were waiting, I was in a game of Go.
                        </h4>
                        <div className='flex flex-col w-full border border-base-300 rounded rounded-md p-2 mt-4'>
                            <p className='text-xl'> I will go ahead and flash this side for you now.</p>
                        </div>
                        <div className="flex justify-between">
                            <Button className={`btn btn-success btn-block mt-5 w-[47%]`}
                                onClick={() => ChangeDisplayState(SplitFlashStage.Finished)}>
                                Thank You!
                            </Button>
                            <Button className={`btn btn-success btn-block mt-5 w-[47%]`}
                                onClick={() => ChangeDisplayState(SplitFlashStage.Finished)}>
                                Thanks For Flashing Me!
                            </Button>
                        </div>

                    </div>

                );
            case SplitFlashStage.Finished:
                return (
                    <div className="SplitFlashManager">
                        <h4 className='mb-1 text-xl'>
                            Done!
                        </h4>
                        {/* <div className="flex flex-col">
                            <p>
                                When I tell you to wait I make it quick....
                            </p>
                            <p className='text-[0.65rem'>
                                ... just saying.
                            </p>
                        </div> */}
                        <div className="flex text-xs mt-10">
                            <p><span className='font-semibold'>Pro Tip: </span>If you're changing the OLED on this half as well, keep it plugged in. If not, swap back to your main side.</p>
                        </div>
                        <Button className={`btn btn-success btn-block mt-5`}
                            onClick={() => props.close()}>
                            Close
                        </Button>
                    </div>
                );
        }
    }
    return (<div className="SplitFlashManager">
        {ReturnDisplayState()}
    </div>)


}


