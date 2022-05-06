// import "./tooltip.sass"
import { Show, createSignal, onMount, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import { ToolTip } from "../../logic/tooltip";
import { ProgramSettings } from "../../logic/programSettings";

const toolTip = ToolTip.getInstance()
const programSettings = ProgramSettings.getInstance()

type ToolTipDisplayProps = {

};

export default function ToolTipDisplay(props: ToolTipDisplayProps) {
    const [state, setState] = createStore({ x: toolTip.x, y: toolTip.y, visable: toolTip.visible, title: toolTip.title, body: toolTip.body }),
        [enable, setEnable] = createSignal(programSettings.tooltips)

    const updateLocalState = () => {
        setState({ x: toolTip.x, y: toolTip.y, visable: toolTip.visible, title: toolTip.title, body: toolTip.body });
    }
    const updateLocalChanges = () => {
        setEnable(programSettings.tooltips)
        console.log(enable(), "enable")

    }
    const subId = toolTip.Subscribe(updateLocalState)
    const subId2 = programSettings.Subscribe(updateLocalChanges)

    onCleanup(() => {
        toolTip.Unsubscribe(subId)
        programSettings.Unsubscribe(subId2)

    })
    const returnStyles = () => {
        return `
            left: ${state.x - 420}px;
            top: ${state.y - 70}px;
         
        `
    }
    return (

        <div className="ToolTipDisplay relative">
             <Show when={enable()}>
            <div className={`ToolTipDisplay__main text-sm p-5 pointer-events-none rounded-lg shadow-xl bg-base-200 z-10 absolute border ${state.visable ? "ToolTipDisplay__main__show" : "ToolTipDisplay__main__hide"}`} style={returnStyles()}>
                <h5>{state.title}</h5>
                <div className="ToolTipDisplay__main_body" >
                    <p>
                        {state.body}
                    </p>


                    </div>

                </div>
            </Show>
        </div>

    );

}
