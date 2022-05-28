import "./keyLayout.sass"
import { Show, createSignal, onMount, For, createResource, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { KeyMap } from "../../logic/keymapManager";
import { KeyCode, LayoutKey } from "../../types/types";
import SingleLayoutKey from "../singleLayoutKey/singleLayoutKey";
import { magicNumbers } from "../../magicNumbers";
import {
    useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { KeyCodes } from "../../logic/keycodes";
import { ClientManager } from "../../logic/clientManager";
import { Color } from "../../logic/color";
import LayerSelector from "../layerSelector/layerSelector";


const keycodes = KeyCodes.getInstance()
const keymap = KeyMap.getInstance()
const clientManager = ClientManager.getInstance()
type KeyLayoutProps = {
    layer: number
    isLed: boolean
    isEncoder: boolean
};
import ShareFeature from "../../components/shareFeature/shareFeature";

export default function KeyLayout(props: KeyLayoutProps) {
    const [keys, setKeys] = createSignal({ ...keymap.keyLayout })
        , [rowCount, setRowCount] = createSignal(3)
        , [currentLayer, setCurrentLayer] = createSignal(clientManager.currentLayer)
        //@ts-ignore
        , [_, { onDragEnd }] = useDragDropContext();
    let ledCode: KeyCode = keycodes.CodeForStringAndSetOrNO("LED", keycodes.hackCodes)
    //@ts-ignore
    onDragEnd(({ draggable, droppable }) => {
        if (droppable) {
            let code: KeyCode | Color
            const draggable_id = draggable.id.split(":")[1]
            const isColor = Color.IsColor(draggable_id)
            if (isColor !== undefined) {
                code = isColor
            } else {
                code = keycodes.KeyCodeForString(draggable_id)
            }
            const [index, encoder] = droppable.id.split(":")
            console.log("drop", droppable.id, index, encoder)
            clientManager.ForceKeyChange(currentLayer(), index, code, encoder === "R")
        }
    });

    const updateLayer = () => {
        setCurrentLayer(clientManager.currentLayer)
    }
    const setkeys = (_newMap: KeyMap) => {
        let tempKeys = { ...keymap.keyLayout }
        if (tempKeys.layout) {
            setRowCount(tempKeys.layout[tempKeys.layout.length - 1].y)
        }
        setKeys(tempKeys)
    }
    const subId = keymap.Subscribe(setkeys)
    const subId2 = clientManager.Subscribe(updateLayer)
    onCleanup(() => {
        keymap.Unsubscribe(subId)
        clientManager.Unsubscribe(subId2)
    })
    const returnHeight = () => {
        if (keys().layout) {
            return `height:${(rowCount() + 1) * magicNumbers.keyMultiplyer}px;`
        } else {
            return `height:${6 * magicNumbers.keyMultiplyer}px;`
        }
    }
    const generateEncoders = (numberOfEncoders: number) => {
        let tempEncoders = []
        for (let index = 0; index < numberOfEncoders; index++) {
            const even = index % 2 == 0
            tempEncoders.push({
                w: 1,
                y: index > 4 ? 2 : 1,
                x: even ? index : index + 4,
                h: 1
            })
            tempEncoders.push({
                w: 1,
                y: index > 4 ? 2 : 1,
                x: even ? index + 1 : index + 5,
                h: 1
            })

        }
        return tempEncoders
    }
    const returnRenderLayout = () => {
        if (props.isEncoder && keymap.keyLayout) {
            return generateEncoders(keymap.keyLayout ? keymap.keyLayout.features.encoderCount : 1)
        }
        const layout = keys()
        if (currentLayer() === 1 && layout.features.underglow && layout.underglow.length !== 0 && props.isLed) {
            return layout.underglow
        } else {
            return layout.layout
        }
    }

    const returnCurrentCode = (index: number) => {
        if (props.isEncoder && keymap.encoderMap.length > 0) {
            return keymap.encoderMap[currentLayer()][index]
        } else {
            if (currentLayer() === 1 && props.isLed) {
                return ledCode
            } else if (keymap.keymap.length > 0) {
                return keymap.keymap[currentLayer()][index]
            } else {
                return {
                    code: "KC.NO",
                    display: "no",
                    keybinding: "",
                    canHaveSub: false,
                    canHaveSubNumber: false,
                    subNumber: 0,
                    Description: "no key set yet"
                }
            }

        }
    }

    //todo map over underglow leds and show that when layer === 4

    return (
        // keymap board container
        <div className="keyLayout relative h-[320px]" style={returnHeight()}>
            <div className=" keyLayout__keys">
                <For each={returnRenderLayout()} fallback={<div>Loading...</div>}>
                    {(layoutKey, index) => (
                        <SingleLayoutKey
                            index={index()}
                            layer={currentLayer()}
                            code={returnCurrentCode(index())}
                            layoutKey={layoutKey}
                            isLed={props.isLed}
                            isEncoder={props.isEncoder}
                        />)}
                </For>
            </div>
            <div className="keyLayout__layers absolute right-0 top-0 self-end">
                {/* <h3>Layers</h3> */}
                <LayerSelector isLed={props.isLed} />
            </div>


        </div>
    );
}
