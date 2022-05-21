import Searchbar from '../searchbar/searchbar'
import { Show, createSignal, onCleanup } from "solid-js";
import ConnectivityStatus from '../connectivityStatus/connectivityStatus'
// import AccountIcon from '../accountIcon/accountIcon'
import Button from "../button/button";
import { ClientManager } from "../../logic/clientManager";
const clientManager = ClientManager.getInstance()



export default function Topbar() {
    const [changesMade, SetChangesMade] = createSignal(clientManager.changesMade)
    const saveMap = () => {
        clientManager.SaveMap()
    }
    const updateLocalChanges = () => {
        SetChangesMade(clientManager.changesMade)
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
                        <kbd class="kbd kbd-xs">shift</kbd>
                        &nbsp + &nbsp
                        <kbd class="kbd kbd-xs">⌘</kbd>
                        &nbsp + &nbsp
                        <kbd class="kbd kbd-xs">S</kbd>
                        &nbsp SAVE MAP &nbsp
                    </Button>
                </div>
            </Show>


            <div className="topbar__right flex">
                <div className="topbar__right__connectivitystatus self-center">
                    <ConnectivityStatus />
                </div>
                {/* <AccountIcon /> */}
            </div>
        </div>
    )
}