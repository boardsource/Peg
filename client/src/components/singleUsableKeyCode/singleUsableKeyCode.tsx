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

};

export default function SingleUsableKeyCode(props: SingleUsableKeyCodeProps) {
    const draggable = createDraggable(isColor(props.code) ? props.code.toString() : props.code.code);
    const mainButtonPress = () => {

        clientManager.NoticeToUpdateKey(props.code)


    }
    const returnStyles = () => {
        let style = ""
        if (props.layoutKey) {
            style = `
            left: ${props.layoutKey.x * magicNumbers.keyMultiplyer}px;
            top: ${props.layoutKey.y * magicNumbers.keyMultiplyer}px;
            width: ${props.layoutKey.w * magicNumbers.keyMultiplyer}px;
            position:absolute;
        `
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

    return (

        <button
            //@ts-ignore
            use:draggable
            class="draggable"
            classList={{ "opacity-25": draggable.isActiveDraggable }}
            onClick={mainButtonPress}
            style={returnStyles()}
            className="SingleUsableKeyCode"
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        >
            {isKeyCode(props.code) ? props.code.display !== "" ? props.code.display : props.code.code : ""}
        </button>
    );
}
