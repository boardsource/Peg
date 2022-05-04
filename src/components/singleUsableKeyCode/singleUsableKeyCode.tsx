import "./singleUsableKeyCode.css"
import { Show, createSignal, onMount } from "solid-js";
import { KeyCode, LayoutKey } from "../../types/types";
import { ClientManager } from "../../logic/clientManager";
import { magicNumbers } from "../../magicNumbers";
import { ToolTip } from "../../logic/tooltip";
import {
    createDraggable,
} from "@thisbeyond/solid-dnd";
import { Color } from "../../logic/color";
import { isColor, isKeyCode } from "../../logic/helpers";

const clientManager = ClientManager.getInstance()
const toolTip = ToolTip.getInstance()
type SingleUsableKeyCodeProps = {
    code: KeyCode | Color;
    layoutKey: LayoutKey | undefined
    index: number

};
export default function SingleUsableKeyCode(props: SingleUsableKeyCodeProps) {
    const draggable = createDraggable(isColor(props.code) ? `${props.index}:${props.code.toString()}` : `${props.index}:${props.code.code}`);
    const mainButtonPress = () => {
        clientManager.NoticeToUpdateKey(props.code)
    }
    const returnStyles = () => {
        let style = ""
        if (props.layoutKey) {
            style = `
            left: ${props.layoutKey.x * (magicNumbers.usableKeyMultiplier + 2)}px;
            top: ${props.layoutKey.y * (magicNumbers.usableKeyMultiplier + 2)}px;
            width: ${props.layoutKey.w * (magicNumbers.usableKeyMultiplier)}px;
            position:absolute;
        `
        } else {
            style += `width: ${magicNumbers.usableKeyMultiplier}px;`
        }
        if (isColor(props.code)) {
            style += `background: rgb(${props.code.r},${props.code.g},${props.code.b});`
        }
        return style

    }
    const mouseEnter = (event: Event) => {
        if (isKeyCode(props.code)) {
            //@ts-ignore
            toolTip.Show(event.clientX, event.clientY, props.code.display !== "" ? props.code.display : props.code.code, props.code.Description)
        }
    }
    const mouseLeave = (event: Event) => {
        if (isKeyCode(props.code)) {
            toolTip.Hide()
        }
    }
    const returnFontSize = () => {
        if (!isColor(props.code)) {
            const keyDisplayCode = props.code.display, keyCode = props.code.code
            const keyDisplayCodeLength = keyDisplayCode.length
            // console.log('from usable lower, keyDisplayCodeLength =', keyDisplayCodeLength)
            const keyCodeLength = keyCode.length
            // console.log('from useable lwoer 2nd param, keyCodeLength =', keyCodeLength)
            const baseSize = 'bg-purple-500'
            let length = 0
            if (keyDisplayCode !== '') {
                length = keyDisplayCodeLength
            } else if (keyDisplayCode == '' && keyCode !== '') {
                length = keyCodeLength
            } else {
                return baseSize
            }
            if (length > 0 && length <= 3) {
                return 300
            } else if (length >= 4 && length <= 5) {
                return 300
            } else if (length >= 6 && length <= 8) {
                return 300
            } else {
                return 300
            }
        }
        else {
            return 300
        }
    }

    return (

        <button
            //@ts-ignore
            use:draggable
            class="draggable"
            classList={{ "opacity-25": draggable.isActiveDraggable }}
            onClick={mainButtonPress}
            style={returnStyles()}
            className={`SingleUsableKeyCode rounded-sm hover:rounded-md hover:transition-all ${returnFontSize()}`}
            // transition-all this class is making dnd super laggy 
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        >
            <div className='codeContainer'>
                <svg width="100%"
                    height='100%'
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMinYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    className=''>
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        fill="black"
                        font-size='120'
                    >

                        {isKeyCode(props.code) ? props.code.display !== "" ? props.code.display : props.code.code : ""}
                    </text>
                </svg>
            </div>

        </button>
    );
}
