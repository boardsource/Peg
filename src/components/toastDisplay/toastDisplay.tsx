import { createSignal, For, onCleanup } from "solid-js";
import { ProgramSettings } from "../../logic/programSettings";
import { Toast } from "../../logic/toast";
import { ToastLevel, ToastMessage } from "../../types/types";
const programSettings = ProgramSettings.getInstance()
const toast = Toast.getInstance()
type ToastProps = {

};

export default function ToastDisplay(props: ToastProps) {
    const [messages, setMessages] = createSignal([...toast.messages.values()])
    const updateLocalMessages = () => {
        setMessages([...toast.messages.values()])
    }
    const subId = toast.Subscribe(updateLocalMessages)
    onCleanup(() => {
        toast.Unsubscribe(subId)
    })
    const returnClasses = () => {
        let classes = `w-[50%] mx-auto mb-3 `
        return classes
    }

    const returnToast = (message: ToastMessage) => {

        switch (message.toastLevel) {
            case ToastLevel.info:
                return (
                    <div class={`${returnClasses()}alert alert-info shadow-lg`}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className='cursor-default'>{message.message}</span>
                        </div>
                    </div>
                )
            case ToastLevel.success:
                return (<div class={`${returnClasses()}alert alert-success shadow-lg`}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className='cursor-default'>{message.message}</span>
                    </div>
                </div>)

            case ToastLevel.warn:
                return (<div class={`${returnClasses()}alert alert-warning shadow-lg`}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span className='cursor-default'>{message.message}</span>
                    </div>
                </div>)

            case ToastLevel.error:
                return (
                    <div class={`${returnClasses()}alert alert-error shadow-lg`}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className='cursor-default'>{message.message}</span>
                        </div>
                    </div>)

            case ToastLevel.debug:
                if (programSettings.debug) {
                    return (<div class={`${returnClasses()}alert shadow-lg`}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span className='cursor-default'>{message.message}</span>
                        </div>
                        <div class="flex-none">
                            <button class="btn btn-sm btn-ghost" onClick={() => toast.Close(message.id)}>Close</button>
                        </div>
                    </div>)
                } else {
                    return ("")
                }
            // case ToastLevel.debug:
            //     if (programSettings.debug) {
            //         return (<div class="bg-yellow-500 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3" id="static-example" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
            //             <div class="bg-yellow-500 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-yellow-400 rounded-t-lg">
            //                 <p class="font-bold text-white flex items-center">
            //                     <svg aria-hidden="true" data-prefix="fas" data-icon="exclamation-triangle" class="w-4 h-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            //                         <path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
            //                     </svg>
            //                     DEBUG</p>
            //                 <div class="flex items-center">
            //                     <button type="button" class="btn-close btn-close-white box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline" data-mdb-dismiss="toast" aria-label="Close" onClick={() => toast.Close(message.id)}>x</button>
            //                 </div>
            //             </div>
            //             <div class="p-3 bg-yellow-500 rounded-b-lg break-words text-white">
            //                 {message.message}
            //             </div>
            //         </div>)
            //     } else {
            //         return ("")
            //     }
        }

    }

    return (



        <div class="fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full mt-3 pointer-events-none">


            <For each={messages()} fallback={""}>
                {(message: ToastMessage, _index) => (
                    returnToast(message)
                )
                }
            </For >
        </div >

    );
}
