import Searchbar from '../searchbar/searchbar'
import { Show, createSignal, onCleanup } from "solid-js";
import ConnectivityStatus from '../connectivityStatus/connectivityStatus'
// import AccountIcon from '../accountIcon/accountIcon'
import Button from "../button/button";
import { ClientManager } from "../../logic/clientManager";
const clientManager = ClientManager.getInstance()



export default function Topbar() {
    const [changesMade, SetChangesMade] = createSignal(clientManager.changesMade),
        [canUnplug, SetcanUnplug] = createSignal(clientManager.canUnplug)
    const saveMap = () => {
        clientManager.SaveMap()
    }
    const updateLocalChanges = () => {
        SetChangesMade(clientManager.changesMade)
        SetcanUnplug(clientManager.canUnplug)
    }
    const subId = clientManager.Subscribe(updateLocalChanges)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)


    })
    return (
        <div className="topbar flex w-f flex-1 justify-between mt-[.6rem]">


            {/* <Searchbar /> */}
            <Show when={true} fallback={<div>Make Changes To Save Map...</div>}>
                <div className="saveButton z-50 mr-1" >
                    <Button selected={changesMade()} onClick={saveMap}>
                        &nbsp SAVE MAP &nbsp
                    </Button>
                </div>
            </Show>


            <div className="topbar__right flex flex-col-reverse items-end">
                <Show when={canUnplug()} fallback={<div className="flex content-center mr-[.25rem] mt-[.2rem]  items-center">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-error" fill="none" viewBox="0 0 24 24" stroke="" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                    <span className="text-[.85rem]">
                        Do Not Unplug
                    </span>
                </div>}>
                    <div className="flex content-center mr-[.25rem] mt-[.2rem]  items-center">

                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-success" fill="none" viewBox="0 0 24 24" stroke="" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[.85rem]">
                            Safe To Unplug
                        </span>



                    </div>
                </Show>
                {/* <Show when={canUnplug()} fallback={<div className="badge badge-error gap-2 badge-lg mr-2 mt-2">
                    Don't Unplug
                </div>}>
                    <div className="badge badge-success badge-outline gap-2 badge-md  mr-2 mt-2">

                        Safe To Unplug


                    </div>
                </Show> */}
                <div className="topbar__right__connectivitystatus self-center">
                    <ConnectivityStatus />
                </div>
                {/* <AccountIcon /> */}
            </div>
        </div>
    )
}