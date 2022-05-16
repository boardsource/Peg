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
    const subId = clientManager.Subscribe(() => setStatus(returnStatus()))
    const subId2 = keymap.Subscribe(() => setStatus(returnStatus()))

    onCleanup(() => {
        clientManager.Unsubscribe(subId)
        keymap.Unsubscribe(subId2)
    })

    return (
        <StatusIndicator
            status={status()}
            keyboard={keymap.keyLayout ? `${keymap.keyLayout?.features.creator}-${keymap.keyLayout?.features.name}` : "Peg - No keyboard"}
        />
    )
}