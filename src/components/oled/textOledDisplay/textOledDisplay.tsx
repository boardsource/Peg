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
    //9 characters fit
    const oledTextInput = (pos: 0 | 1 | 2 | 3) => {
        const classes = 'flex w-full font-mono bg-black text-white text-[38pt] border border-[base-300] scale-90 pl-[.4rem] rounded-[.2rem]'
        switch (state.reactionType[pos]) {
            case OledReactionType.static:
                return (<input className={classes} type="text" value={state.textDisplay[pos][1][0]} onChange={(e) => {
                    //@ts-ignore
                    currentOled?.UpdateTextDisplaySection(pos, e.target.value)
                }} />)
            case OledReactionType.layer:
                return (<input className={`${classes}`} type="text" value={state.textDisplay[pos][1][props.currentLayer()]} onChange={(e) => {
                    //@ts-ignore
                    currentOled?.UpdateTextDisplaySection(pos, e.target.value)
                }} />)
        }
    }
    const oledCorner = (pos: 0 | 1 | 2 | 3) => {
        return (<div className="textOledDisplay__corner flex relative w-2/4">
            <Show when={pos < 2} fallback={""}>
                <div className="flex translate-y-[-2rem] translate-x-[1rem]">
                    <LoopOverEnum enum={OledReactionType} buttonOnClick={(newValue: OledReactionType) => currentOled?.UpdateTextDisplaySectionReactionType(pos, newValue)} selected={state.reactionType[pos]} defaultButtons oledInfo tinyButtons />
                </div>
            </Show>
            <div className="textOledDisplay__corner__input absolute w-full h-full">
                {oledTextInput(pos)}
            </div>
            <Show when={pos > 1} fallback={""}>
                <div className="flex translate-y-[5.5rem] translate-x-[1rem]">
                    <LoopOverEnum enum={OledReactionType} buttonOnClick={(newValue: OledReactionType) => currentOled?.UpdateTextDisplaySectionReactionType(pos, newValue)} selected={state.reactionType[pos]} defaultButtons oledInfo tinyButtons />
                </div>
            </Show>
        </div>)
    }
    return (
        <div className="textOledDisplay flex flex-wrap w-full">
            {oledCorner(0)}
            {oledCorner(1)}
            {oledCorner(2)}
            {oledCorner(3)}
        </div>
    );
}


