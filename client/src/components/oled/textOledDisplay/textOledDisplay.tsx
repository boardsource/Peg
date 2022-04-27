import "./textOledDisplay.sass"
import { Show, createSignal, onMount, For, onCleanup, createReaction, Index } from "solid-js";
import { createStore } from "solid-js/store";
import { magicNumbers } from "../../../magicNumbers";
import { OledPixel, OledReactionType, OledTextSection } from "../../../types/types";
import { KeyMap } from "../../../logic/keymapManager";
import { ClientManager } from "../../../logic/clientManager";
import LoopOverEnum from "../../loopOverEnum/loopOverEnum";
const clientManager = ClientManager.getInstance()
const keymap = KeyMap.getInstance()
type TextOledDisplayProps = {
    currentLayer: () => number
};

type StateType = {
    textDisplay: OledTextSection[],
    reactionType: OledReactionType[]
}
export default function TextOledDisplay(props: TextOledDisplayProps) {
    let currentOled = keymap.oled
    const [state, SetState] = createStore<StateType>({ textDisplay: currentOled?.textDisplay ? currentOled?.textDisplay : [], reactionType: currentOled?.textDisplay ? currentOled?.textDisplay?.map(oledTextSection => oledTextSection[0]) : [] })

    const subId = keymap.Subscribe(() => { currentOled = keymap.oled })
    const prosessUpdates = () => {
        console.log(" changing state")
        const newState = {
            textDisplay: currentOled?.textDisplay ? currentOled?.textDisplay : [],
            reactionType: currentOled?.textDisplay?.map(oledTextSection => oledTextSection[0])
        }
        SetState(newState)
    }
    const subId2 = currentOled ? currentOled.Subscribe(() => {
        prosessUpdates()
    }) : false

    onCleanup(() => {
        keymap.Unsubscribe(subId);
        if (subId2 && currentOled) {
            currentOled.Unsubscribe(subId2)
        }

    })
    const oledTextInput = (pos: 0 | 1 | 2 | 3) => {

        switch (state.reactionType[pos]) {
            case OledReactionType.static:
                return (<input type="text" value={state.textDisplay[pos][1][0]} onChange={(e) => {
                    //@ts-ignore
                    currentOled?.UpdateTextDisplaySection(pos, e.target.value)
                }} />)
            case OledReactionType.layer:
                return (<input type="text" value={state.textDisplay[pos][1][props.currentLayer()]} onChange={(e) => {
                    //@ts-ignore
                    currentOled?.UpdateTextDisplaySection(pos, e.target.value)
                }} />)
        }
    }
    const oledCorner = (pos: 0 | 1 | 2 | 3) => {
        return (<div className="textOledDisplay__corner flex flex-col">
            <Show when={pos < 2} fallback={""}>
                <LoopOverEnum enum={OledReactionType} buttonOnClick={(newValue: OledReactionType) => currentOled?.UpdateTextDisplaySectionReactionType(pos, newValue)} selected={state.reactionType[pos]} defaultButtons />
            </Show>
            {oledTextInput(pos)}
            <Show when={pos > 1} fallback={""}>
                <LoopOverEnum enum={OledReactionType} buttonOnClick={(newValue: OledReactionType) => currentOled?.UpdateTextDisplaySectionReactionType(pos, newValue)} selected={state.reactionType[pos]} defaultButtons />
            </Show>
        </div>)
    }
    return (
        <div className="textOledDisplay flex ">
            {oledCorner(0)}
            {oledCorner(1)}
            {oledCorner(2)}
            {oledCorner(3)}
        </div>
    );
}

