import { createSignal, onCleanup } from 'solid-js'
import { ClientManager } from '../../logic/clientManager'
import { KeyMap } from '../../logic/keymapManager'
import { ProgramSettings } from '../../logic/programSettings'
import StatusIndicator from './statusIndicator/statusIndicator'
const clientManager = ClientManager.getInstance()
const keymap = KeyMap.getInstance()

export enum ConnectionStatus {
    BoardAndInternet,
    Board,
    Internet,
    NoConnection
}



export default function ConnectivityStatus() {
    const returnStatus = () => {
        if (keymap.keyLayout) {
            if (clientManager.isOnLine) {
                return ConnectionStatus.BoardAndInternet
            } else {
                return ConnectionStatus.Board
            }
        } else {
            if (clientManager.isOnLine) {
                return ConnectionStatus.Internet

            } else {
                return ConnectionStatus.NoConnection
            }
        }
    }
    const [status, setStatus] = createSignal(returnStatus())
    const subId = keymap.Subscribe(() => setStatus(returnStatus()))

    onCleanup(() => { keymap.Unsubscribe(subId) })

    return (
        <StatusIndicator
            status={status()}
            keyboard={`${keymap.keyLayout?.features.creator}-${keymap.keyLayout?.features.name}`}
        />
    )
}