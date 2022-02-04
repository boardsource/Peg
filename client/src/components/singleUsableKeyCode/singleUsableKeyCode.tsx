import "./singleUsableKeyCode.css"
import { Show, createSignal, onMount } from "solid-js";
import { KeyCode, LayoutKey } from "../../types/types";
import { ClientManager } from "../../logic/clientManager";
import { magicNumbers } from "../../magicNumbers";
import { ToolTip } from "../../logic/tooltip";
import {
    DragDropProvider,
    DragDropSensors,
    DragOverlay,
    createDraggable,
    createDroppable,
} from "@thisbeyond/solid-dnd";

const clientManager = ClientManager.getInstance()
const toolTip = ToolTip.getInstance()
type SingleUsableKeyCodeProps = {
    code: KeyCode;
    layoutKey: LayoutKey | undefined
};

export default function SingleUsableKeyCode(props: SingleUsableKeyCodeProps) {
    const draggable = createDraggable(props.code.code);
    const mainButtonPress = () => {
        clientManager.NoticeToUpdateKey(props.code)
    }
    const returnStyles = () => {
        if (props.layoutKey) {
            return `
            left: ${props.layoutKey.x * magicNumbers.keyMultiplyer}px;
            top: ${props.layoutKey.y * magicNumbers.keyMultiplyer}px;
            width: ${props.layoutKey.w * magicNumbers.keyMultiplyer}px;
            position:absolute;
        `
        }

    }
    const mouseEnter = (event: Event) => {

        //@ts-ignore
        toolTip.Show(event.clientX, event.clientY, props.code.display !== "" ? props.code.display : props.code.code, props.code.Description)
    }
    const mouseLeave = (event: Event) => {
        toolTip.Hide()
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
            {props.code.display !== "" ? props.code.display : props.code.code}
        </button>
    );
}
