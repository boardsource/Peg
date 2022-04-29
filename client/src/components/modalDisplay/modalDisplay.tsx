
import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import { Modal } from "../../logic/modal";
import { ModalDefault } from "../../types/types";
import { SplitFlashManager } from "../splitFlashManager/splitFlashManager";
import { Transition } from 'solid-transition-group'



type ModalDisplayDisplayProps = {

};

export default function ModalDisplay(props: ModalDisplayDisplayProps) {
    const modal = Modal.getInstance()
    const [state, setState] = createStore({ visable: modal.visible, canClose: modal.canClose, render: modal.render, title: modal.title, defaultView: modal.defaultView });

    const updateLocalState = () => {
        setState({ visable: modal.visible, canClose: modal.canClose, render: modal.render, title: modal.title, defaultView: modal.defaultView });
    }
    const subId = modal.Subscribe(updateLocalState)
    onCleanup(() => {
        modal.Unsubscribe(subId)
    })
    const returnClose = () => {

        if (state.canClose) {
            return (<button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => modal.Close()}>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>)
        } else {
            return ""
        }
    }

    const returnContent = () => {
        // If you need to call a modal from a pure logic file you do the jsx part here. see clientManager>SaveMap for example of how to call
        // you will also need to add a option to the enum in the types file
        switch (state.defaultView) {
            case ModalDefault.SplitFlashManager:
                return (<>
                    <SplitFlashManager close={() => modal.Close()} />
                </>)
            default:
                return modal.render
        }
    }

    return (
        <Transition
            onEnter={(el, done) => {
                const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
                    duration: 400
                });
                a.finished.then(done);
            }}
            onExit={(el, done) => {
                const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
                    duration: 400
                });
                a.finished.then(done);
            }}
        >
            <Show when={state.visable} fallback={""}>

                <div id="defaultModal" tabindex="-1" aria-hidden="true" class="flex flex-col justify-center align-center items-center content-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full backdrop-blur-sm">
                    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                        {/* <!-- Modal content --> */}
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                                <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
                                    {state.title}
                                </h3>
                                {returnClose()}
                            </div>
                            {/* <!-- Modal body --> */}
                            <div class="">
                                {returnContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </Show >
        </Transition>
    );

}
