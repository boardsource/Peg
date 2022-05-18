import "./singleLayoutKey.sass"
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
        // inline styles that need to be set based off of app state in some way.
        let styles = `
        left: ${props.layoutKey.x * (magicNumbers.keyMultiplyer + 4)}px;
        top: ${props.layoutKey.y * (magicNumbers.keyMultiplyer + 4)}px;
        width: ${props.layoutKey.w * magicNumbers.keyMultiplyer}px;
         `
        if (props.isLed && clientManager.keymap.keyLayout?.features.perkey && state.color) {
            // if it is a normal keycode on the led tab. And the keyboard supports per key and we have a led map
            // change this down below also for LED border color
            styles += `
            fill: rgb(${state.color.r},${state.color.g},${state.color.b});
            box-shadow: 0px 0px 7px -1px rgb(${state.color.r},${state.color.g},${state.color.b});
            `
            // set to default border color if no color is selected for the key
            // old border
            // border: 1px solid rgb(${state.color.r},${state.color.g},${state.color.b}) !important;
        }
        if (props.isLed && props.code.code === "LED") {
            //if the key is on the led tab and it is a under glow led
            styles += `
                background: rgb(${state.color.r},${state.color.g},${state.color.b}); 
                border-radius: 100% !important;
                box-shadow: 0px 0px 20px 7px rgb(${state.color.r},${state.color.g},${state.color.b});
                transform: scale(0.4) !important;
                `
            // scale only takes effect after clicked, it's okay if we can't have this i will change it later

            // styles += `
            // background: rgb(${state.color.r},${state.color.g},${state.color.b});
            // border-radius: ${magicNumbers.keyMultiplyer}px;
            // `
        } else {
            // normal key not on the led tab 
            // styles += `background: lightgray;`
        }
        return styles
    }
    const returnSVGColor = () => {
        if (props.isLed && clientManager.keymap.keyLayout?.features.perkey && state.color) {
            // if it is a normal keycode on the led tab. And the keyboard supports per key and we have a led map
            return `text-[rgb(${state.color.r},${state.color.g},${state.color.b})];`
        } else {
            return "fill-base-content"
        }
    }
    // adjust these to change font size of layout key text based on char length break points defined below
    const returnFontSize = (keyDisplayCode: string, keyCode: string) => {
        const keyDisplayCodeLength = keyDisplayCode.length
        const keyCodeLength = keyCode.length
        const baseSize = 75
        let length = 0
        if (keyDisplayCode !== '') {
            length = keyDisplayCodeLength
        } else if (keyDisplayCode == '' && keyCode !== '') {
            length = keyCodeLength
        } else {
            return baseSize
        }
        if (length > 0 && length <= 2) {
            return 190
        } else if (length >= 3 && length <= 5) {
            return 130
        } else if (length >= 6 && length <= 8) {
            return 90
        } else {
            return baseSize
        }
    }

    const returnClasses = () => {
        //classes you want to apply all the time
        let classes = `
        rounded-lg hover:scale-90 hover:bg-base-300 overflow-hidden transition-all border border-base-300
         `
        if (props.isLed && props.code.code === "LED") {
            // underglow led on the led tab
            classes += `
            `
        }
        else if (props.isLed) {
            // normal key on the led tab
            classes += `
            `
        } else {
            // normal key not on the led tab 
            classes += `
            `
        }
        return classes
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
            className={`singleLayoutKey ${state.waitingLayer === props.layer && state.waitingIndex === returnGlowindex() ? "waitingKey transition-all bg-g bg-gray-300 scale-90 bg-opacity-70" : ""} ${returnClasses()}  `}
            // style keys here for top layout top layout key styles
            style={returnStyles()}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        >

            <button onClick={mainButtonPress} className={`singleLayoutKey__main w-full k${state.code.display}`}>
                <Show when={state.code.canHaveSub} fallback={""}>

                    {state.code.display !== "" ? state.code.display : state.code.code}
                    <br />
                </Show>
                <svg width="100%"
                    height="100%"
                    viewBox="0 0 500 100"
                    preserveAspectRatio="xMinYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    className=''>
                    {/*@ts-ignore*/}
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        className={`${returnSVGColor()}`}
                        font-size={returnFontSize(state.code.display, state.code.code)}
                    >  {state.code.canHaveSub ?
                        state.subCode?.display !== "" ? state.subCode?.display : state.subCode?.code
                        : state.code.display !== "" ? state.code.display : state.code.code}
                    </text>
                </svg>
            </button>
            <Show when={state.code.canHaveSub} fallback={""}>
                <button onClick={clearButtonPress} className="singleLayoutKey__clear">
                    x
                </button>
            </Show>
        </div>
    );
}
