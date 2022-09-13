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
            left: ${props.layoutKey.x * (magicNumbers.usableKeyMultiplier + 3)}px;
            top: ${props.layoutKey.y * (magicNumbers.usableKeyMultiplier + 3)}px;
            width: ${props.layoutKey.w * (magicNumbers.usableKeyMultiplier)}px;
            position:absolute;
        `
        } else {
            style += `
            margin-right: 5px;
            `
        }
        if (isColor(props.code)) {
            style += `background: rgb(${props.code.r},${props.code.g},${props.code.b});`
        }
        return style

    }
    const returnClasses = () => {
        let classes = ''
        if (props.layoutKey) {
            // this is only to style keys on ansi layout 
        }

        if (isColor(props.code)) {
            // scale-90 breaks dnd so I removed it
            // bg-[rgb(${props.code.r},${props.code.g},${props.code.b})] does not seem to do anything because its being set with inline styles and that has a higher priority so I removed it
            classes += `  rounded-full  border-none `
        } else {
            //hover:scale-90 breaks dnd so I removed it
            classes += `bg-base-100 border border-base-300 rounded-md shadow shadow-base-300 hover:shadow-lg hover:bg-base-100 hover:transition-all`
        }
        return classes
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
    const returnMaxHeight = () => {
        return `max-height: ${magicNumbers.usableKeyMultiplier}px`
    }
    const returnFontSize = () => {
        if (!isColor(props.code)) {
            const keyDisplayCode = props.code.display, keyCode = props.code.code
            const keyDisplayCodeLength =keyDisplayCode? keyDisplayCode.length:0
            // console.log('from usable lower, keyDisplayCodeLength =', keyDisplayCodeLength)
            const keyCodeLength = keyCode?keyCode.length:0
            // console.log('from useable lwoer 2nd param, keyCodeLength =', keyCodeLength)
            const baseSize = 6
            let length = 0
            if (keyDisplayCode !== '') {
                length = keyDisplayCodeLength
            } else if (keyDisplayCode == '' && keyCode !== '') {
                length = keyCodeLength
            } else {
                return baseSize
            }
            if (length > 0 && length <= 3) {
                return 9
            } else if (length >= 4 && length < 5) {
                return 7
            } else if (length >= 6 && length <= 8) {
                return baseSize
            } else {
                return baseSize
            }
        }
        else {
            return
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
            className={`SingleUsableKeyCode ${returnClasses()}`}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        >
            <div className={`codeContainer`}>
                <svg width={`29px`}
                    height={`100%`}
                    viewBox="0 0 29 29"
                    preserveAspectRatio="xMinYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    style={``}
                    className={`flex self-center !max-w-[${magicNumbers.keyMultiplyer}px] !max-h-[${magicNumbers.keyMultiplyer}]px`}>
                    {/*@ts-ignore*/}
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        fill="black"
                        className={`fill-base-content max-w-[${magicNumbers.keyMultiplyer}]`}
                        // font-size='100%'
                        font-size={returnFontSize()}
                    >

                        {isKeyCode(props.code) ? props.code.display !== "" ? props.code.display : props.code.code : ""}
                    </text>
                </svg>
            </div>

        </button>
    );
}
