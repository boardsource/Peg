
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
            return (<button type="button" class="btn btn-sm btn-circle absolute right-4 top-4" onClick={() => modal.Close()}>
                ✕
            </button>

            )
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

                <div id="defaultModal" tabindex="-1" aria-hidden="true" class="flex flex-col overflow-y-auto overflow-x-hidden justify-center items-center fixed top-0 right-0 left-0 z-50 w-full md:inset-0 !backdrop-blur-[4px]">
                    <div class="modal-box relative w-full max-w-2xl h-full md:h-auto">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xl font-semibold">
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

                {/* <div id="defaultModal" tabindex="-1" aria-hidden="true" class="flex flex-col justify-center align-center items-center content-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full backdrop-blur-sm">
                    <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                        <div class="relative bg-base-100 rounded-lg shadow !rounded-2xl overflow-hidden p-5">
                            <div class="flex justify-between items-start border-b dark:border-gray-600 mb-2">
                                <h3 class="text-xl font-semibold">
                                    {state.title}
                                </h3>
                                {returnClose()}
                            </div>
                            <div class="">
                                {returnContent()}
                            </div>
                        </div>
                    </div>
                </div> */}

            </Show >
        </Transition>
    );

}
