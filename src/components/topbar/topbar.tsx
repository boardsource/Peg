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
        <div className="topbar flex w-f flex-1 items-center justify-between">


            {/* <Searchbar /> */}
            <Show when={true} fallback={<div>Make Changes To Save Map...</div>}>
                <div className="saveButton z-50 mr-1" >
                    <Button selected={changesMade()} onClick={saveMap}>
                        &nbsp SAVE MAP &nbsp
                    </Button>
                </div>
            </Show>


            <div className="topbar__right flex">
                <Show when={canUnplug()} fallback={<div className="badge badge-error gap-2 badge-lg mr-2 mt-2">
                    Dont Unplug
                </div>}>
                    <div className="badge badge-success gap-2 badge-lg  mr-2 mt-2">

                        Safe To Unplug


                    </div>
                </Show>
                <div className="topbar__right__connectivitystatus self-center">
                    <ConnectivityStatus />
                </div>
                {/* <AccountIcon /> */}
            </div>
        </div>
    )
}