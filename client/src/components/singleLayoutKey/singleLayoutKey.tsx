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
import {
    createDroppable,
} from "@thisbeyond/solid-dnd";

const clientManager = ClientManager.getInstance()
const toolTip = ToolTip.getInstance()
type SingleLayoutKeyProps = {
    code: KeyCode;
    index: number;
    layer: number;
    layoutKey: LayoutKey
    isLed: boolean
    isEncoder: boolean
};

export default function SingleLayoutKey(props: SingleLayoutKeyProps) {

    const returnGlowindex = () => {
        if (props.code.code === "LED") {
            const ledIndex = clientManager.keymap.keyLayout.features.perkeyCount + props.index
            // const underGlowLeds = clientManager.keymap.ledMap.slice(clientManager.keymap.keyLayout.features.underglowCount * -1)

            return ledIndex
        } else {
            return props.index
        }
    }
    const droppable = createDroppable(`${returnGlowindex()}:${props.isEncoder ? "R" : ""}`);
    const [state, setState] = createStore({
        waitingLayer: clientManager.waitingLayer,
        waitingIndex: clientManager.waitingIndex,
        code: props.code,
        subCode: props.code.subOne,
        color: clientManager.keymap.ledMap[returnGlowindex()]
    })
    const updateWaitingInfo = (_newClient: ClientManager) => {
        setState({
            waitingLayer: clientManager.waitingLayer,
            waitingIndex: clientManager.waitingIndex,
            code: props.isEncoder ?
                clientManager.keymap.encoderMap[props.layer][props.index] :
                props.code.code !== "LED" ?
                    clientManager.keymap.keymap[props.layer][props.index] :
                    props.code,
            subCode: props.code.code !== "LED" ? clientManager.keymap.keymap[props.layer][props.index].subOne : props.code.subOne,
            color: clientManager.keymap.ledMap[returnGlowindex()]
        })
    }

    const subId = clientManager.Subscribe(updateWaitingInfo)
    onCleanup(() => {
        clientManager.Unsubscribe(subId)
    })

    const mainButtonPress = () => {
        clientManager.NoticeThatKeyIsWaiting(returnGlowindex(), props.isLed, props.isEncoder)
    }
    const clearButtonPress = () => {
        const keymap = KeyMap.getInstance()
        const codes = KeyCodes.getInstance()
        keymap.ChangeKey(props.index, props.layer, codes.KeyCodeForString("KC.NO"), props.isEncoder);
    }
    const returnStyles = () => {
        let styles = `
        left: ${props.layoutKey.x * magicNumbers.keyMultiplyer}px;
        top: ${props.layoutKey.y * magicNumbers.keyMultiplyer}px;
        width: ${props.layoutKey.w * magicNumbers.keyMultiplyer}px;
         `
        if (clientManager.keymap.keyLayout?.features.perkey && state.color) {
            styles += `color: rgb(${state.color.r},${state.color.g},${state.color.b});`
        }
        if (props.code.code === "LED") {
            styles += `
            background: rgb(${state.color.r},${state.color.g},${state.color.b});
            border-radius: ${magicNumbers.keyMultiplyer}px;
            `
        } else {
            styles += `background: lightgray;`
        }
        return styles
    }
    const mouseEnter = (event: Event) => {
        const description = state.code.canHaveSub ?
            //@ts-ignore
            state.code.Description.replace("kc", state.subCode?.display !== "" ? state.subCode?.display : state.subCode?.code)
            : state.code.Description
        const title = state.code.canHaveSub ?
            //@ts-ignore
            (state.code.display !== "" ? state.code.display : state.code.code).replace("kc", state.subCode?.display !== "" ? state.subCode?.display : state.subCode?.code)
            : state.code.display !== "" ? state.code.display : state.code.code
        //@ts-ignore
        toolTip.Show(event.clientX, event.clientY, title, description)
    }
    const mouseLeave = (event: Event) => {
        toolTip.Hide()
    }


    return (
        <div
            //@ts-ignore
            use:droppable
            class="droppable"
            classList={{ "!droppable-accept": droppable.isActiveDroppable }}
            className={`singleLayoutKey ${state.waitingLayer === props.layer && state.waitingIndex === returnGlowindex() ? "waitingKey" : ""}`}
            style={returnStyles()}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        >

            <button onClick={mainButtonPress} className="singleLayoutKey__main">
                <Show when={state.code.canHaveSub} fallback={""}>

                    {state.code.display !== "" ? state.code.display : state.code.code}
                    <br />
                </Show>
                {state.code.canHaveSub ?
                    state.subCode?.display !== "" ? state.subCode?.display : state.subCode?.code
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
