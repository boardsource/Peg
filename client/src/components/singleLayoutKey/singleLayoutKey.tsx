import "./singleLayoutKey.css"
import { Show, createSignal, onMount, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyCode } from "../../types/types";
import { LayoutKey } from "../../types/types";
import { magicNumbers } from "../../magicNumbers";
import { ClientManager } from "../../logic/clientManager";
import { ToolTip } from "../../logic/tooltip";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCodes } from "../../logic/keycodes";
const clientManager = ClientManager.getInstance()
const toolTip = ToolTip.getInstance()
type SingleLayoutKeyProps = {
    code: KeyCode;
    index: number;
    layer: number;
    layoutKey: LayoutKey
};

export default function SingleLayoutKey(props: SingleLayoutKeyProps) {
    const [state, setState] = createStore({ waitingLayer: clientManager.waitingLayer, waitingIndex: clientManager.waitingIndex, code: props.code });
    const updateWaitingInfo = (_newClient: ClientManager) => {
        setState({ waitingLayer: clientManager.waitingLayer, waitingIndex: clientManager.waitingIndex, code: clientManager.keymap.keymap[props.layer][props.index] })
    }
    const subId = clientManager.Subscribe(updateWaitingInfo)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })

    const mainButtonPress = () => {
        clientManager.NoticeThatKeyIsWaiting(props.index, props.layer, false)
    }
    const clearButtonPress = () => {
        const keymap = KeyMap.getInstance()
        const codes = KeyCodes.getInstance()
        keymap.ChangeKey(props.index, props.layer, codes.KeyCodeForString("KC.NO"));
    }
    const returnStyles = () => {
        return `
            left: ${props.layoutKey.x * magicNumbers.keyMultiplyer}px;
            top: ${props.layoutKey.y * magicNumbers.keyMultiplyer}px;
            width: ${props.layoutKey.w * magicNumbers.keyMultiplyer}px;
        `
    }
    const mouseEnter = (event: Event) => {
        //@ts-ignore
        toolTip.Show(event.clientX, event.clientY, state.code.display !== "" ? state.code.display : state.code.code, state.code.Description)
    }
    const mouseLeave = (event: Event) => {
        toolTip.Hide()
    }


    return (
        <div className={`singleLayoutKey ${state.waitingLayer === props.layer && state.waitingIndex === props.index ? "waitingKey" : ""}`}
            style={returnStyles()}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        >
            <Show when={state.code.canHaveSub} fallback={""}>
                <p>
                    {state.code.subOne?.code}
                </p>
            </Show>
            <button onClick={mainButtonPress} className="singleLayoutKey__main">
                {state.code.canHaveSub ?
                    state.code.subOne?.display !== "" ? state.code.subOne?.display : state.code.subOne?.code
                    : state.code.display !== "" ? state.code.display : state.code.code}
            </button>
            <Show when={state.code.canHaveSub} fallback={""}>
                <button onClick={clearButtonPress} className="singleLayoutKey__clear">
                    x
                </button>
            </Show>
        </div>
    );
}
